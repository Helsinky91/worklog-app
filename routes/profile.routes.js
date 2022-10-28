const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const Log = require("../models/Log.model")
const { isAdmin } = require("../middlewares/auth.middleware.js")
const department = require("../utils/department")
const role = require("../utils/role")
const fileUploader = require('../config/cloudinary.config');

// GET "/profile" => render user or admin profile
router.get("/", async (req, res, next) => {
    if (req.session.activeUser.role === "admin") {
        res.redirect("/admin/profile")
        return;
    }
        let data = {} //stores all the following code inside the data object
    try {

        data.userDetails = await User.findById(req.session.activeUser._id)
        data.isWorking = data.userDetails.isWorking
    
        data.worklogDatesIn = await Log.find({ user: data.userDetails }).sort({ "timeIn": -1 }).limit(1)
        data.formatedWorklogDatesIn = data.worklogDatesIn[0]?.timeIn?.toDateString()
        data.formatedWorklogHoursIn = data.worklogDatesIn[0]?.timeIn?.toLocaleTimeString()       
               
        data.worklogDatesOut = await Log.find({ user: data.userDetails }).sort({ "timeOut": -1 }).limit(1)
        data.formatedWorklogDatesOut = data.worklogDatesOut[0]?.timeOut?.toDateString();
        data.formatedWorklogHoursOut = data.worklogDatesOut[0]?.timeOut?.toLocaleTimeString()
        
        data.userFavEvents = await User.findById(req.session.activeUser._id).populate("events")
        data.userEventsList = data.userFavEvents.events
        
        res.render("profile/profile.hbs", data)

    } catch (err) {
        next(err)
    }
})

//POST "/profile/log-in" => takes info from "worklog form" and updates DB
router.post("/log-in", async (req, res, next) => {
        //1. funcionalidad botón worklog para que fiche con la hora con el Log.model
    const { comment, validation, user } = req.body;
    const timeIn = new Date()

    try {
        //2. ruta para cambiar isWorking de false a true, feed from worklog button
        const userDetails = await User.findById(req.session.activeUser._id)
        await User.findByIdAndUpdate(userDetails, { isWorking: true })

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
    const { comment, validation, user } = req.body;
    const timeOut = new Date()
    try {
        //2. ruta para cambiar isWorking de true a false, feed from worklog button
        const userDetails = await User.findById(req.session.activeUser._id)
        await User.findByIdAndUpdate(userDetails, { isWorking: false })

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

    if (req.session.activeUser.role === "admin") {
        adminRole = true;
    }

    try {
        const userDetails = await User.findById(userId)

        res.render("profile/profile-edit.hbs", { userDetails, adminRole, role, department })
    } catch (err) {
        next(err)
    }
})

//POST "profile/edit/:userId" => recieve data to update profile's user.
router.post("/edit/:userId", fileUploader.single('profilePicImage'), async (req, res, next) => {
    const { userId } = req.params
    const { firstName, lastName, photo, email, role, department, interest } = req.body

    const userDetails = {
        firstName,
        lastName,
        photo: req.file?.path, //el ? es un microcondicional, si es undefined no leas "path"
        email,
        role,
        department,
        interest
    }

    try {
        await User.findByIdAndUpdate(userId, userDetails)
        res.redirect("/profile")
        
    } catch (error) {
        next(err)
    }
})


module.exports = router;