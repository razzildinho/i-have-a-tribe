function notLoggedIn(req, res, next){
    if(!req.session.user){
        next();
    }
    else{
        res.json({
            error:409
        });
    }
}

module.exports = notLoggedIn;
