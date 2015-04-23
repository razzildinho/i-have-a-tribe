var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session')
var redis_store = require('connect-redis')(session);
var mongoose = require('mongoose');
var cors= require('cors');

var mongoStr = "mongodb://127.0.0.1:27017/ihat";
mongoose.connect(mongoStr);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection-error'));
db.once('open', function(){
    console.log('Connected to MongoDB: '+mongoStr);
});

var api_user = require('./routes/api/user');
var api_shows = require('./routes/api/shows');
var api_video = require('./routes/api/video');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Allow CORS
app.use(cors());

app.use(favicon());
app.use(bodyParser({limit: '12mb'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(session({ store: new redis_store(),
                  secret: 'njJ^7H8()*dbfdjN#~mNBvs£$%sjdhUp',
                  cookie: {maxAge: 3600000}
                 }));
app.use('/user', api_user);
app.use('/shows', api_shows);
app.use('/video', api_video);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        if (err.status == 404){
            // respond with html page
            if (req.accepts('html')) {
                res.render('404')
                return;
            }
            // respond with json
            if (req.accepts('json')) {
                res.json({ error: 'Not found' });
                return;
            }
            // default to plain-text. send()
            res.type('txt').send('Not found');
        }
        else{
            res.render('error', {
                message: err.message,
                error: err
            });
        }
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    if (err.status == 404){
        // respond with html page
        if (req.accepts('html')) {
            res.render('404')
            return;
        }
        // respond with json
        if (req.accepts('json')) {
            res.json({ error: 'Not found' });
            return;
        }
        // default to plain-text. send()
        res.type('txt').send('Not found');
    }
    else{
        res.render('error', {
            message: err.message,
            error: err
        });
    }
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
