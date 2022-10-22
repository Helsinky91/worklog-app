const express = require('express');
const router = express.Router();
const {isLoggedIn, isAdmin} = require("../middlewares/auth.middleware.js")
const User = require("../models/User.model");
const Event = require("../models/Event.model");


//GET "/events" => render the page with all events
router.get("/", async (req, res, next) => {
    
    try { 
        const allEvents = await Event.find()
        res.render("events/events.hbs", {
            allEvents
        })
        
    } catch (error) {
        next(error)
    }
})

//GET "/events/create" => render a page whit a form to create events
router.get("/create", isAdmin, async(req, res, next) => {
    
    try {
        const adminDetails = await User.findById(req.session.activeUser._id)
        res.render("events/create.hbs", {adminDetails})
    } 
        
        
     catch (error) {
        next(error)
        
    
}
})


//POST "/events/create" => recive the data from the form and add to the DB/ redirect
router.post("/create", isAdmin, async (req, res, next) => {
    const { name, description, eventType, date, place, adminId } = req.body

    try {   const adminDetails = await User.findById(req.session.activeUser._id)     

        const adminCreator = await Event.find({"adminId": adminDetails}).populate("adminId")
        await Event.create( {
        name,
        description, 
        eventType, 
        date, 
        place, 
        //adminId: adminCreator 
    })
        res.redirect("/events")

    } catch (error) {
        next(error)
    }

})




module.exports = router;