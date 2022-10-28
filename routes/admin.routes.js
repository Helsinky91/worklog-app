const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const Log = require("../models/Log.model");
const validation = require("../utils/validation.js")


//GET /admin/profile
router.get("/profile", async (req, res, next) => {

    try {
        const adminDetails = await User.findById(req.session.activeUser._id)    
        const allUsers = await User.find()
        res.render("admin/admin-profile", {adminDetails, allUsers})

    } catch (error) {
    next(error)
    }
})

//GET /admin/all-users => list of all user names and department
router.get("/all-users", async (req, res, next) => {
    try{
        //set dif views depending of department
        const cookDepartment = await User.find({$and: [{"department": "Cook"}, {"role": "user"}]});
        const receptionistDepartment = await User.find({$and: [{"department": "Receptionist"}, {"role": "user"}]});
        const restaurantDepartment = await User.find({$and: [{"department": "Restaurant"}, {"role": "user"}]});
        const reservationDepartment = await User.find({$and: [{"department": "Reservations"}, {"role": "user"}]});
       
        res.render("admin/all-users.hbs", {
            cookDepartment,
            receptionistDepartment,
            restaurantDepartment,
            reservationDepartment,
            validation
        })  
    } catch (error) {
        next(error)
    }
})


// get /admin/worklog-validation/:userId
router.get("/worklog-validation/:userId", async (req, res, next) => {
    const { userId } = req.params
    let data = {}
    try { 
        //pending validation
        data.pendingIn = await Log.find({$and: [ {user: userId}, {timeOut: undefined}, {validation: "Pending"} ]}).sort({"timeIn": -1}).limit(1)
        data.pendingOut = await Log.find({$and: [ {user: userId}, {timeIn: undefined}, {validation: "Pending"}  ]}).sort({"timeOut": -1}).limit(1)  
        
        data.datesPendingIn = data.pendingIn[0]?.timeIn?.toDateString()  //format the date to String
        data.hoursPendingIn = data.pendingIn[0]?.timeIn?.toLocaleTimeString()  //format the Hour
        
        data.datesPendingOut = data.pendingOut[0]?.timeOut?.toDateString()
        data.hoursPendingOut = data.pendingOut[0]?.timeOut?.toLocaleTimeString()

        //denied validation
        data.deniedIn = await Log.find({$and: [ {user: userId}, {timeOut: undefined}, {validation: "Denied"} ]}).sort({"timeIn": -1}).limit(1)    
        data.deniedOut = await Log.find({$and: [ {user: userId}, {timeIn: undefined}, {validation: "Denied"} ]}).sort({"timeOut": -1}).limit(1)    
        
        data.datesDeniedIn = data.deniedIn[0]?.timeIn?.toDateString()
        data.hoursDeniedIn = data.deniedIn[0]?.timeIn?.toLocaleTimeString()
        
        data.datesDeniedOut = data.deniedOut[0]?.timeOut?.toDateString()
        data.hoursDeniedOut = data.deniedOut[0]?.timeOut?.toLocaleTimeString()

        //approved validation
        data.approvedIn = await Log.find({$and: [ {user: userId}, {timeOut: undefined}, {validation: "Approved"}  ]}).sort({"timeIn": -1}).limit(1)    
        data.approvedOut = await Log.find({$and: [ {user: userId}, {timeIn: undefined}, {validation: "Approved"} ]}).sort({"timeOut": -1}).limit(1)
    
        data.datesApprovedIn = data.approvedIn[0]?.timeIn?.toDateString()
        data.hoursApprovedIn = data.approvedIn[0]?.timeIn?.toLocaleTimeString()
        
        data.datesApprovedOut = data.approvedOut[0]?.timeOut?.toDateString()
        data.hoursApprovedOut = data.approvedOut[0]?.timeOut?.toLocaleTimeString()

        data.userInfo = await Log.find({user: userId}).populate("user")
        data.userDetails = data.userInfo[0]?.user
        data.validation = validation  
    
        res.render("admin/worklog-validation.hbs", data)

    } catch (error) {
    next(error)
    }
})

//POST "/admin/:logId/edit" => recieve the data from the form and update validation state
router.post("/:logId/edit", async (req, res, next) => {

        const { logId } = req.params
        const { validation }  = req.body

    try {
        const userId = await Log.findById(logId).populate("user")
        await Log.findByIdAndUpdate(logId, { validation } )
        res.redirect(`/admin/worklog-validation/${userId.user._id}`)
        
    } catch (error) {
        next(error)
    }
})


// POST /admin/:userId/delete
router.post("/:userId/delete", async (req, res, next) => {
    const {userId} = req.params;

    try {
        await User.findByIdAndRemove(userId);
        res.redirect("/admin/all-users")
    } catch (error) {
        next(error)
    }
})



module.exports = router;