const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const Log = require("../models/Log.model")

//GET /admin/profile
router.get("/profile", async (req, res, next) => {

    try {
        const adminDetails = await User.findById(req.session.activeUser._id)    
       // console.log(adminDetails)

        const allUsers = await User.find()
        console.log(allUsers)
        res.render("admin/admin-profile", {adminDetails, allUsers})


  //!necesitamos la info del isWorking to be true or false para mandarla a la vista. (MONDAY)

    } catch (error) {
    next(error)
    }

})


//GET /admin/all-users



// GET /admin/:userId
// "admin/:userId/" => la info de un user específico q renders "profiles/profile-edit"


// POST /admin/worklog-validation 


// GET /admin/:userId/edit


// POST /admin/:userId/edit


// POST /admin/:userId/delete


module.exports = router;
