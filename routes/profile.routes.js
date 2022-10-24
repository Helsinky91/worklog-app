const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const Log = require("../models/Log.model")
const {isAdmin} = require("../middlewares/auth.middleware.js")


// GET "/profile" => render user or admin profile
router.get("/", async (req, res, next) => {
    if(req.session.activeUser.role === "admin" ) {
       // const adminDetails = await User.findById(req.session.activeUser._id)
        res.redirect("/admin/profile")
        return;
    } 
    
    try {

        
        const userDetails = await User.findById(req.session.activeUser._id)     
        
        const worklogDates = await Log.find({"user": userDetails}).limit(1).populate("user")
        // console.log("this is worlogdates:", worklogDates)
        
        
        res.render("profile/profile.hbs", {userDetails, worklogDates})

    } catch(err) {
        next(err)
    }
    //!add eventlistener to show/hidde the button
})

//POST "/profile" => takes info from "worklog form" and updates DB
router.post("/", async (req, res, next) => {
    //funcionalidad botón worklog para que fiche con la hora con el Log.model
        
    const {timeIn, timeOut, comment, validation, user, isWorking} = req.body;
    
    try {
        //!pendiente: ruta para cambiar isWorking de false a true
        
  //  const userDetails = User.findById(req.session.activeUser._id)
    Log.create({
        timeIn: timeIn,
        timeOut: timeOut,
        comment: comment,
        validation: validation,
        user: user,
        isWorking: isWorking
    })
    res.redirect("/profile")
    
    } catch (error) {
    next(error)
    }
})

//GET "/profile/edit/:userId" => USER: render a form to edit user profile
router.get("/edit/:userId", async (req, res, next) => {
        const { userId } = req.params
        let adminRole = false;
        if(req.session.activeUser.role = "admin"){
            adminRole = true;
        }
      //  console.log(adminRole)
    try {
        const userDetails = await User.findById(userId)
        
        res.render("profile/profile-edit.hbs", {userDetails, adminRole})
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