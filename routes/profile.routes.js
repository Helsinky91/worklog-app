const express = require("express");
const router = express.Router();
const User = require("../models/User.model");



//GET "/profile" => render user or admin profile
router.get("/", async (req, res, next) => {
    try {
        const userDetails = await User.findById(req.session.activeUser._id)
        res.render("profile/profile.hbs", {userDetails})
    } catch(err) {
        next(err)
    }
    
})

//GET "/profile/edit/:userId" => USER: render a form to edit user profile
router.get("/edit/:userId", async (req, res, next) => {
        const { userId } = req.params
    try {
        const userDetails = await User.findById(userId)
        res.render("profile/profile-edit.hbs", {userDetails})
    } catch(err) {
        next(err)
    }
})

//POST "profile/edit/:userId" => recieve data to update profile's user.
router.get("/edit/:userId", async (req, res, next) => {
    const { userId } = req.params
    const { firstName, lastName, photo, email, role, department, interest } = req.body
    const newUserDetails = { firstName, lastName, photo, email, role, department, interest } 
    try {
        await User.findByIdAndUpdate(userId, { newUserDetails } )
        res.redirect("/profile")
    } catch (error) {
        next(err)
    }
})


module.exports = router;