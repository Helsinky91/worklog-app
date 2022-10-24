const express = require('express');
const router = express.Router();
const {isLoggedIn, isAdmin} = require("../middlewares/auth.middleware.js")
const User = require("../models/User.model");
const Event = require("../models/Event.model");


//GET "/events" => render the page with all events
router.get("/", async (req, res, next) => {
    let adminRole = false;
    console.log(req.session.activeUser.role)
    if(req.session.activeUser.role = "admin"){
        adminRole = true;
        console.log("is admin role: ", adminRole)
    } 
    try { 
        const allEvents = await Event.find()
        res.render("events/events.hbs", {
            allEvents, adminRole
        })
        
    } catch (error) {
        next(error)
    }
})

//GET "/events/create" => render a page whit a form to create events
router.get("/create", isAdmin, async(req, res, next) => {    
   
    try {
       //! hacer lista evento dinámica??
        // const tipeOfEvent = await Event.find() //.select("eventType")
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
//! to check pq no funciona el adminId 
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

//GET "/events/:eventId/edit" => renders form to update event
router.get("/:eventId/edit", isAdmin, async (req, res, next) => {
      const {eventId} = req.params;
      
    try {
        const eventDetails = await Event.findById(eventId)
        res.render("events/events-edit.hbs", {eventDetails})
    } catch (error) {
        next(error)
    }

})

//POST "/events/:eventId/edit" => gets info from update form and update DB
router.post("/:eventId/edit", isAdmin, async (req, res, next) => { 

    const { name, description, eventType, date, place } = req.body
   const eventDetails = { name, description, eventType, date, place };
    const {eventId} = req.params;

    //console.log(eventDetails)
    
    try {
       await Event.findByIdAndUpdate(eventId, eventDetails)
        res.redirect("/events")
        
    } catch (error) {
        next(error)
    }

})

//POST "/events/:eventId/delete" => delete event
router.post("/:eventId/delete", isAdmin, async (req, res, next) => {

    const {eventId} = req.params;

    try {
    await Event.findByIdAndRemove(eventId)
        res.redirect("/events")
        
    } catch (error) {
        next(error)
    }
})




module.exports = router;