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
        const worklogDatesIn = await Log.find({ user: userDetails } ).limit(1).sort({"timeIn": -1})         //en esta busqueda está la clave. Falta, tambien, una 
                                                                                                        //funcion que de la hora al apretar el boton, o volver a poner default en el Model
        const worklogDatesOut = await Log.find({ user: userDetails } ).limit(1).sort({"timeOut": -1})  
        res.render("profile/profile.hbs", {userDetails, worklogDatesIn, worklogDatesOut, isWorking}) 
        console.log("enseña worklogDatesIn", worklogDatesIn)
        console.log("enseña worklogDatesOut", worklogDatesOut)

       
    } catch(err) {
        next(err)
    }
    //!add eventlistener to show/hidde the button
})

//POST "/profile/log-in" => takes info from "worklog form" and updates DB
router.post("/log-in", async (req, res, next) => {
    //1. funcionalidad botón worklog para que fiche con la hora con el Log.model
    //eventListener que quan es premi botó, canvia a OUT ( jugar amb el hidden) i isWorking a true. 
    //eventListener lo mismo pero al revés.
    
    const {comment, validation, user} = req.body;
    const timeIn = new Date()
    
    try {
        //2. ruta para cambiar isWorking de false a true, feed from worklog button
        const userDetails = await User.findById(req.session.activeUser._id)     
        await User.findByIdAndUpdate(userDetails, {isWorking: true})
        //  const userDetails = User.findById(req.session.activeUser._id)
       console.log("timeIn", timeIn)
        Log.create({
            timeIn: timeIn,
            comment: comment,
            validation: validation,
            user: user
        }) 
        return res.redirect("/profile")

    } catch (error) {
    next(error)
    }
})


//POST "/profile/log-out" => takes info from "worklog form" and updates DB
router.post("/log-out", async (req, res, next) => {
    //1. funcionalidad botón worklog para que fiche con la hora con el Log.model
    //eventListener que quan es premi botó, canvia a OUT ( jugar amb el hidden) i isWorking a true. 
    //eventListener lo mismo pero al revés.
    const {comment, validation, user} = req.body;
    const timeOut = new Date()
    console.log("timeOut", timeOut)
    try {
        //2. ruta para cambiar isWorking de false a true, feed from worklog button
        const userDetails = await User.findById(req.session.activeUser._id)     
        await User.findByIdAndUpdate(userDetails, {isWorking: false})
        //  const userDetails = User.findById(req.session.activeUser._id)
     
        Log.create({
            timeOut: timeOut,
            comment: comment,
            validation: validation,
            user: user,
        })
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