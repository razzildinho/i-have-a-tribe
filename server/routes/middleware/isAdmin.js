function isAdmin(req, res, next){
    if (req.session.user.admin){
        next();
    }
    else{
        res.json({
            error:403
        });
    }
}

module.exports = isAdmin;