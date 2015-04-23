var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var Shows = require('./showsModel');
var isAdmin = require('../middleware/isAdmin');
var notLoggedIn = require('../middleware/notLoggedIn');
var loggedIn = require('../middleware/loggedIn');
var expressJwt = require('express-jwt');
var mime= require('mime');
var fs = require('fs');



router.get("/", function(req, res){
    var now = new Date();
    Shows.find({'when': {'$gte': now}}).sort('when').exec(function(err, shows){
        if(err){
            console.log(err);
            res.json({
                error:504
            });
        }
        else{
            process.nextTick(function(){
                Shows.find({'when': {'$lt': now}}).remove().exec(function(err, shows){
                    if(err){
                        console.log('Could not remove past shows.');
                    }
                });
            });
            res.json({
                success: 200,
                shows: shows
            });
        }
    });
});

router.post("/", expressJwt({secret: 'h1aki3niU?o@f*et'}), function(req, res){
    if (!req.user.admin){
        res.json({
            error: 401
        });
    }
    var show = req.body;
    var id = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for( var i=0; i < 5; i++ ){
        id += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    show.url = id;
    show.imageUrl = null;
    show.when = new Date(show.when);
    var index = 0;
    var count_and_add = function(show, index){
        if (index > 0){
            show.url += index.toString();
        }
        Shows.count({url: show.url}, function(err, count){
            if (err){
                console.log(err);
                res.json({
                    error:504
                });
            }
            else if (count != 0){
                console.log('Url '+show.url+' already exists - changing.');
                index += 1;
                count_and_add(show, index);
            }
            else{
                var newShows = new Shows(show);
                newShows.save(function(err){
                    if(err){
                        console.log(err);
                        res.json({
                            error:504
                        });
                    }
                    else{
                        Shows.find({}).sort('exec').exec(function(err, shows){
                            if(err){
                                console.log(err);
                                res.json({
                                    error:504
                                });
                            }
                            else{
                                res.json({
                                    success: 200,
                                    shows: shows
                                });
                            }
                        });
                    }
                });
            }
        });
    }
    count_and_add(show, index);
});

router.post("/delete", expressJwt({secret: 'h1aki3niU?o@f*et'}), function(req, res){
    if (!req.user.admin){
        res.json({
            error: 401
        });
    }
    var show = req.body;
    Shows.remove({url: show.url}, function(err){
        if (err){
            console.log(err);
            res.json({
                error:504
            });
        }
        else{
            if(show.imageUrl && show.imageUrl !== 'dummy_pic.jpg'){
                var delete_me = "./public/images/" + show.imageUrl;
                process.nextTick(function(){
                    fs.unlink(delete_me, function(err){
                        if(err){
                            console.log('Could not remove existing photo for '+show.url+".");
                        }
                    });
                });
            }
            console.log('Removed '+show.url+' from DB.');
            res.json({
                success: 200
            });
        }
    });
});

router.post('/image', expressJwt({secret: 'h1aki3niU?o@f*et'}), function(req, res){
    if (!req.user.admin){
        res.json({
            error: 401
        });
    }
    var image = req.body.image;
    var regex = /^data:.+\/(.+);base64,(.*)$/;
    var matches = image.substr(0,50).match(regex);
    var ext = matches[1];
    var data = matches[2] + image.substr(50);
    var buffer = new Buffer(data, 'base64');
    var show = req.body.show;
    fs.writeFileSync("./"+show.url+"."+ext, buffer);
    var tmp_path = "./"+show.url+"."+ext;
    var timestamp = String(new Date().getTime());
    var filetype = mime.lookup(tmp_path);
    console.log(filetype);
    var tgt_path = './public/images/' + timestamp + show.url+"."+ext;
    if(image.size > 11000000){
        fs.unlink(tmp_path, function(err){
            if(err){
                console.log(err);
                res.json({
                    error: 403
                });
            }
            else{
                console.log("Removed large image.");
                res.json({
                    error: 403
                });
            }
        });
    }
    else if(filetype.indexOf('image') === -1){
        fs.unlink(tmp_path, function(err){
            if(err){
                console.log(err);
                res.json({
                    error: 403
                });
            }
            else{
                console.log("Removed non-image file.");
                res.json({
                    error: 403
                });
            }
        });
    }
    else{
        fs.rename(tmp_path, tgt_path, function(err){
            if(err){
                console.log(err);
                res.json({
                    error: 500
                });
            }
            else{
                fs.unlink(tmp_path, function(err){
                    if(err && err.errno != 34){
                        console.log(err);
                    }
                    Shows.findOne({url: show.url}, function(err, show){
                        if(err){
                            console.log(err);
                            res.json({
                                error: 500
                            });
                        }
                        else{
                            if(show.imageUrl && show.imageUrl !== 'dummy_pic.jpg'){
                                var delete_me = "./public/images/" + show.imageUrl;
                                process.nextTick(function(){
                                    fs.unlink(delete_me, function(err){
                                        if(err){
                                            console.log('Could not remove existing photo for '+show.url+".");
                                        }
                                    });
                                });
                            }
                            show.imageUrl = timestamp + show.url+"."+ext;
                            show.save(function(err){
                                if(err){
                                    console.log(err);
                                    res.json({
                                        error: 500
                                    });
                                }
                                else{
                                    console.log('Updated photo for '+show.url+'.');
                                    res.json({
                                        success: 200,
                                        show: show
                                    });
                                }
                            });
                        }
                    });
                });
            }
        });
    }
});


module.exports = router;
