const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const Log = require("../models/Log.model")


//GET "/profile" => render user or admin profile
router.get("/", async (req, res, next) => {
    try {
        const userDetails = await User.findById(req.session.activeUser._id)     

        const worklogDates = await Log.find({"user": userDetails}).limit(1).populate("user")
        console.log("this is worlogdates:", worklogDates)
        
        res.render("profile/profile.hbs", {userDetails, worklogDates})

    } catch(err) {
        next(err)
    }
    
})

//POST "/profile" => takes info from "worklog form" and updates DB
router.post("/", async (req, res, next) => {
    //funcionalidad botón worklog para que fiche con la hora con el Log.model
        
    const {timeIn, timeOut, comment, validation, user} = req.body;
    try {
        
  //  const userDetails = User.findById(req.session.activeUser._id)
    Log.create({
        timeIn: timeIn,
        timeOut: timeOut,
        comment: comment,
        validation: validation,
        user: user
    })
    res.redirect("/profile")
    
    } catch (error) {
    next(error)
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
router.post("/edit/:userId", async (req, res, next) => {
    const { userId } = req.params
    const { firstName, lastName, photo, email, role, department, interest } = req.body
    const userDetails = { firstName, lastName, photo, email, role, department, interest } 
    try {
        await User.findByIdAndUpdate(userId,  userDetails  )
      //  console.log(userDetails)
        res.redirect("/profile")
    } catch (error) {
        next(err)
    }
})


module.exports = router;