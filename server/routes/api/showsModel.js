var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 14;

var ShowSchema = new Schema({
    when: {
        type: Date,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    imageUrl: String,
    venueName: {
        type: String,
        required: true
    },
    eventUrl: String,
    address: String,
    city: {
        type: String,
        required: true
    },
    country: String
});

module.exports = mongoose.model('Show', ShowSchema);
