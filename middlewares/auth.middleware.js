// function to detect if user is logged
const isAdmin = (req, res, next) => {
    if (req.session.activeUser.role !== "admin") {
        res.redirect("/auth/login")
    } else {
        next()
    }
}

const isLoggedIn = (req, res, next) => {
    if (req.session.activeUser === undefined) {
        res.redirect("/auth/login")   
    } else {
        next() 
    }
}





module.exports = {
    isLoggedIn,
    isAdmin
}