var express = require('express');
var router = express.Router();
var User = require('./userModel');
var isAdmin = require('../middleware/isAdmin');
var notLoggedIn = require('../middleware/notLoggedIn');
var loggedIn = require('../middleware/loggedIn');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

/* APIs. */

/*router.post('/user', function(req, res){
    req.body.email = req.body.email.replace(/ /g,'');
    req.body.password = req.body.password.replace(/ /g,'');
    if(req.body.email.length < 2 || req.body.password.length < 5){
        console.log('Invalid email/password length.');
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
                    email: req.body.email,
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
                            success: 200,
                            admin: admin
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
});*/

router.post('/session', function(req, res){
    req.body.email = req.body.email.replace(/ /g,'');
    req.body.password = req.body.password.replace(/ /g,'');
    if(req.body.email == "" || req.body.password == ""){
        console.log('Invalid email/password length.');
        res.json({
            error:403
        });
        return;
    }
    User.findOne({email: req.body.email}, function(err, user){
        if(err){
            console.log(err);
            res.json({
                error:504
            });
        }
        else if(user == null){
            res.json({
                error: 401
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
                        var token = jwt.sign(user, 'h1aki3niU?o@f*et', {expiresInMinutes: 60*3});
                        res.json({
                            success: 200,
                            user: user,
                            token: token
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

router.get('/status', expressJwt({secret: 'h1aki3niU?o@f*et'}), function(req, res){
    if (req.user){
        var user = {
            email: req.user.email,
            admin: req.user.admin
        };
        res.json({
            user: user
        })
    }
    else{
        res.json({
            user: null
        });
    }
});

module.exports = router;
