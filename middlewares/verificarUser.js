module.exports=(req,res,next) => {
    if(req.isAuthenticated()){//verifica si un usuario tiene la cuenta activa (isAuthenticaded)
        return next()
    }
    res.redirect("/auth/login");
}