const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const Log = require("../models/Log.model")
const {isAdmin} = require("../middlewares/auth.middleware.js")
const department = require("../utils/department")
const role = require("../utils/role")

// GET "/profile" => render user or admin profile
router.get("/", async (req, res, next) => {
    if(req.session.activeUser.role === "admin" ) {
        console.log(req.session.activeUser.role)
       // const adminDetails = await User.findById(req.session.activeUser._id)
      res.redirect("/admin/profile")
        return;
    }
    
    try {
        
        const userDetails = await User.findById(req.session.activeUser._id)     
        let isWorking = userDetails.isWorking
        
        if(isWorking === false) {
            const worklogDates = await Log.find({"user": userDetails}).limit(1).sort({"timeIn": -1}).populate("user")
            //console.log("this is worlogdates:", worklogDates)
            await User.findByIdAndUpdate(userDetails._id, {isWorking: true})
            return res.render("profile/profile.hbs", {userDetails, worklogDates})
       } else {
           const worklogDates = await Log.find({"user": userDetails}).limit(1).sort({"timeOut": -1}).populate("user")
           await User.findByIdAndUpdate(userDetails._id, {isWorking: false})
           return res.render("profile/profile.hbs", {userDetails, worklogDates})

       } next();
        

       
    } catch(err) {
        next(err)
    }
    //!add eventlistener to show/hidde the button
})

//POST "/profile" => takes info from "worklog form" and updates DB
router.post("/", async (req, res, next) => {
    //1. funcionalidad botón worklog para que fiche con la hora con el Log.model
    //eventListener que quan es premi botó, canvia a OUT ( jugar amb el hidden) i isWorking a true. 
    //eventListener lo mismo pero al revés.
    
    
    
    const {timeIn, timeOut, comment, validation, user, isWorking} = req.body;
    
    try {
        //2. ruta para cambiar isWorking de false a true, feed from worklog button
        const userDetails = await User.findById(req.session.activeUser._id)     
        let isWorking = userDetails.isWorking
        //  const userDetails = User.findById(req.session.activeUser._id)
        if (isWorking === false){
        Log.create({
            timeIn: timeIn,
            comment: comment,
            validation: validation,
            user: user,
            isWorking: isWorking
        }) 
        return res.redirect("/profile")
      
        } else if (isWorking === true){
        Log.create({
            timeOut: timeOut,
            comment: comment,
            validation: validation,
            user: user,
            isWorking: isWorking
        })
        }
        return res.redirect("/profile")
    
    } catch (error) {
    next(error)
    }
})

//GET "/profile/edit/:userId" => USER: render a form to edit user profile
router.get("/edit/:userId", async (req, res, next) => {
        const { userId } = req.params
        let adminRole = false;
       // console.log(req.session.activeUser.role)
        if(req.session.activeUser.role = "admin"){
            adminRole = true;
        }
     //  console.log(adminRole)
    try {
        const userDetails = await User.findById(userId)
        
        res.render("profile/profile-edit.hbs", {userDetails, adminRole, role, department})
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