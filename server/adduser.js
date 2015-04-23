var mongoose = require('mongoose');
var mongoStr = "mongodb://127.0.0.1:27017/ihat";
mongoose.connect(mongoStr);
var db = mongoose.connection;
var User = require('./routes/api/userModel');

var email = process.argv[2];
var password = process.argv[3];

db.on('error', console.error.bind(console, 'connection-error'));
db.once('open', function(){
    console.log('Connected to MongoDB: '+mongoStr);
    if (email.indexOf('@') < 1 || email.indexOf('.') <= email.indexOf('@') + 1){
        console.log('Invalid email');
        process.exit(1);
    }
    if (password.length < 5){
        console.log('password too short');
        process.exit(1);
    }
    User.count({email: email}, function(err, count){
        if(err){
            console.log(err);
            process.exit(1);
        }
        else if (count != 0){
            console.log('User '+email+' already exists.');
            process.exit(1);
        }
        else{
            User.count({admin: true}, function(err, count){
                admin = count == 0;
                var newUser = new User({
                    email: email,
                    password: password,
                    admin: admin
                });
                newUser.save(function(err){
                    if(err){
                        console.log(err);
                        process.exit(1);
                    }
                    else{
                        if (admin){
                            console.log('Added '+email+' to DB with admin privilege.');
                        }
                        else{
                            console.log('Added '+email+' to DB.');
                        }
                        process.exit(1);
                    }
                });
            });
        }
    });
});
