var express = require('express');
var mongoose = require('mongoose');
var request = require('request');
var router = express.Router();
var Video = require('./videoModel');
var isAdmin = require('../middleware/isAdmin');
var notLoggedIn = require('../middleware/notLoggedIn');
var loggedIn = require('../middleware/loggedIn');
var expressJwt = require('express-jwt');
var mime= require('mime');
var fs = require('fs');



router.get("/", function(req, res){
    Video.find({}, function(err, videos){
        if(err){
            console.log(err);
            res.json({
                error:504
            });
        }
        else{
            res.json({
                success: 200,
                videos: videos
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
    var video = req.body;
    Video.count({videoid:video.videoid}, function(err, count){
        if(count > 0 || video.videoid.length == 0){
            res.json({
                error: 504
            });
        }

        else{

            request('http://gdata.youtube.com/feeds/api/videos/'+video.videoid+'?v=2&alt=json', function(err, response, body){
                if (err || response.statusCode != 200){
                    res.json({
                        error: 504
                    });
                }
                else{
                    var parsed = JSON.parse(body);
                    video.title = parsed.entry.title.$t.replace('I Have A Tribe - ','');
                    newVideo = new Video(video);
                    newVideo.save(function(err){
                        if(err){
                            console.log(err)
                            res.json({
                                error: 504
                            });
                        }
                        else{
                            Video.find({}, function(err, videos){
                                if(err){
                                    console.log(err)
                                    res.json({
                                        error: 504
                                    });
                                }
                                else{
                                    res.json({
                                        success: 200,
                                        videos: videos
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });

});

router.post("/delete", expressJwt({secret: 'h1aki3niU?o@f*et'}), function(req, res){
    if (!req.user.admin){
        res.json({
            error: 401
        });
    }
    var video = req.body;
    Video.remove({videoid: video.videoid}, function(err){
        if (err){
            console.log(err);
            res.json({
                error:504
            });
        }
        else{
            res.json({
                success: 200
            });
        }
    });
});

module.exports = router;
