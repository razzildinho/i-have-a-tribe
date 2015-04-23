function loggedIn(req, res, next){
    if(req.session.user){
        next();
    }
    else{
        res.json({
            error:403
        });
    }
}

module.exports = loggedIn;