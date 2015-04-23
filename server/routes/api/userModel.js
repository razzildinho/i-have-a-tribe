var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 14;

var UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        required: true
    }
});

UserSchema.pre('save', function(next){
    var user = this;
    
    if (!user.isModified('password')){
        return next();
    }
    
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
        if (err){
            return next(err);
        }
        bcrypt.hash(user.password, salt, function(err, hash){
            if (err){
                return next(err);
            }
            user.password = hash;
            next();
        });
    }); 
});

UserSchema.methods.comparePassword = function(candidatePassword, next){
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
        if (err){
            return next(err);
        }
        next(null, isMatch);
    });
}

module.exports = mongoose.model('User', UserSchema);
