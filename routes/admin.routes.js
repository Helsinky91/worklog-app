const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const Log = require("../models/Log.model");
const validation = require("../utils/validation.js")


//GET /admin/profile
router.get("/profile", async (req, res, next) => {

    try {
        const adminDetails = await User.findById(req.session.activeUser._id)    
       // console.log(adminDetails)

        const allUsers = await User.find()
       // console.log(allUsers)
        res.render("admin/admin-profile", {adminDetails, allUsers})


  //!necesitamos la info del isWorking to be true or false para mandarla a la vista. (MONDAY)

    } catch (error) {
    next(error)
    }

})

//GET /admin/all-users => list of all user names and department
router.get("/all-users", async (req, res, next) => {
    try{
        //set dif views depending of department

        const cookDepartment = await User.find({"department": "cook"});
        const receptionistDepartment = await User.find({"department": "receptionist"});
        const restaurantDepartment = await User.find({"department": "restaurant"});
        const reservationDepartment = await User.find({"department": "reservations"});
       
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


// POST /admin/worklog-validation/:userId
router.post("/worklog-validation/:userId", async (req, res, next) => {
    const { userId } = req.params


try { 
    const pendingValidationIn = await Log.find({$and: [ {user: userId}, {timeOut: undefined}, {validation: "Pending"} ]}).limit(3).sort({"timeIn": -1})
    const pendingValidationOut = await Log.find({$and: [ {user: userId}, {timeIn: undefined}, {validation: "Pending"}  ]}).limit(3).sort({"timeIn": -1})  
    const deniedValidationIn = await Log.find({$and: [ {user: userId}, {timeOut: undefined}, {validation: "Denied"} ]}).limit(3).sort({"timeIn": -1})    
    const deniedValidationOut = await Log.find({$and: [ {user: userId}, {timeIn: undefined}, {validation: "Denied"} ]}).limit(3).sort({"timeIn": -1})    
    const validateValidationIn = await Log.find({$and: [ {user: userId}, {timeOut: undefined}, {validation: "Approved"}  ]}).limit(3).sort({"timeIn": -1})    
    const validateValidationOut = await Log.find({$and: [ {user: userId}, {timeIn: undefined}, {validation: "Approved"} ]}).limit(3).sort({"timeIn": -1})
    const userDetails = await Log.find({user: userId}).populate("user")
    console.log(pendingValidationIn)

    res.render("admin/worklog-validation.hbs", { 
        pendingValidationIn, 
        pendingValidationOut, 
        deniedValidationIn, 
        deniedValidationOut, 
        validateValidationIn, 
        validateValidationOut,
        userDetails,
        validation
    })
} catch (error) {
    next(error)
}

})




//POST "/admin/:logId/edit" => recieve the data from the form and update validation state
router.post("/:logId/edit", async (req, res, next) => {

        const { logId } = req.params
        const { validation }  = req.body
        console.log("validation",  validation )



    try {
        const userId = await Log.findById(logId).populate("user")
        console.log("userID", userId)
        await Log.findByIdAndUpdate(logId, { validation } )
        res.redirect(`/admin/all-users`)
        
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
