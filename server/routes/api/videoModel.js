var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 14;

var VideoSchema = new Schema({
    videoid: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    width: {
        type: String,
        default: '100%'
    },
    height: {
        type: String,
        default: '100%'
    }
});

module.exports = mongoose.model('Video', VideoSchema);
