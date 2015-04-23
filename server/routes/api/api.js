var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('./userModel');
var Event = require('./eventModel')
var isAdmin = require('./middleware/isAdmin');
var notLoggedIn = require('../middleware/notLoggedIn');
var loggedIn = require('../middleware/loggedIn');

var mongoStr = "mongodb://127.0.0.1:27017/rtdb";
mongoose.connect(mongoStr);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection-error'));
db.once('open', function(){
    console.log('Connected to MongoDB: '+mongoStr);
});

/* APIs. */

router.post('/user', function(req, res){
    req.body.username = req.body.username.replace(/ /g,'');
    req.body.password = req.body.password.replace(/ /g,'');
    if(req.body.username.length < 2 || req.body.password.length < 5){
        console.log('Invalid username/password length.');
        res.json({
            error:403
        });
        return;
    }
    User.count({username: req.body.username}, function(err, count){
        if(err){
            console.log(err);
            res.json({
                error:504 
            });
        }
        else if (count != 0){
            console.log('User '+req.body.username+' already exists.');
            res.json({
                error:409
            });
        }
        else{
            User.count({admin: true}, function(err, count){
                admin = count == 0;
                var newUser = new User({
                    username: req.body.username,
                    password: req.body.password,
                    admin: admin
                });
                newUser.save(function(err){
                    if(err){
                        console.log(err);
                        res.json({
                            error:504 
                        });
                    }
                    else{
                        res.json({
                            success:200,
                            user: req.body.username
                        });
                        if (admin){
                            console.log('Added '+req.body.username+' to DB with admin privilege.');
                        }
                        else{
                            console.log('Added '+req.body.username+' to DB.');
                        }
                    }
                });
            });
        }
    });
});

router.get('/session', function(req, res){
    if(req.session.user){
        res.json({
            user: req.session.user.username,
            admin: req.session.user.admin
        });
    }
    else{
        res.json({
            user: false,
            admin: false
        });
    }
});

router.delete('/session', loggedIn, function(req, res){
    req.session.destroy()
    res.json({
       user: false 
    });
});

router.post('/session', notLoggedIn, function(req, res){    
    req.body.username = req.body.username.replace(/ /g,'');
    req.body.password = req.body.password.replace(/ /g,'');
    if(req.body.username == "" || req.body.password == ""){
        console.log('Invalid username/password length.');
        res.json({
            error:403
        });
        return;
    }
    User.findOne({username: req.body.username}, function(err, user){
        if(err){
            console.log(err);
            res.json({
                error:504
            });
        }
        else{
            user.comparePassword(req.body.password, function(err, isMatch){
                if(err){
                    console.log(err);
                    res.json({
                        error:504
                    });
                }
                else{
                    if(isMatch){
                        req.session.user = user;
                        res.json({
                            success: 200,
                            user: {
                                user: user.username,
                                admin: user.admin
                            }
                        });
                    }
                    else{
                        res.json({
                            error: 401
                        });
                    }
                }
            });
        }
    });
});

module.exports = router;
