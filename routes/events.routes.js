const express = require("express");
const router = express.Router();
const { isLoggedIn, isAdmin } = require("../middlewares/auth.middleware.js");
const User = require("../models/User.model");
const Event = require("../models/Event.model");
const eventType = require("../utils/event-types");
const fileUploader = require("../config/cloudinary.config");
const { array } = require("../config/cloudinary.config");

//GET "/events" => render the page with all events
router.get("/", async (req, res, next) => {
  let adminRole = false;

  if (req.session.activeUser.role === "admin") {
    adminRole = true;
  }

  try {
    const allEvents = await Event.find();

    //! EDIT DATE FORMAT

    res.render("events/events.hbs", {
      allEvents,
      adminRole,
    });
  } catch (error) {
    next(error);
  }
});

//POST "/events/:eventId/events-favorites" => add to favourite collection in User Profile
router.post("/:eventId/events-favorites", async (req, res, next) => {
  const { eventId } = req.params;
  try {
    let userEvents = await User.findByIdAndUpdate(req.session.activeUser._id, {
      $push: { events: eventId },
    });

    //!BONUS - añadir only once usando un derivado de $push

    res.redirect("/events");
  } catch (error) {
    next(error);
  }
});

//POST "/events/:event/delete-fav" 0> recieve the data from the form and delete event
router.post("/:eventId/delete-fav", async (req, res, next) => {
  const { eventId } = req.params;

  try {
    await User.findByIdAndUpdate(req.session.activeUser._id, {
      $pull: { events: eventId },
    });
    res.redirect("/profile");
  } catch (error) {
    next(error);
  }
});

//GET "/events/create" => render a page whit a form to create events
router.get("/create", isAdmin, async (req, res, next) => {
  try {
    // const tipeOfEvent = await Event.find() //.select("eventType")
    const adminDetails = await User.findById(req.session.activeUser._id);
    res.render("events/create.hbs", { adminDetails, eventType });
  } catch (error) {
    next(error);
  }
});

//POST "/events/create" => recive the data from the form and add to the DB/ redirect
router.post("/create", isAdmin, fileUploader.single("event-image"), async (req, res, next) => {
    const { name, description, eventType, date, photo, place, hour } = req.body;
    //const formatedDate = date.toDateString()
   // console.log("formatedDate", formatedDate)
   console.log("date", date)
   const {eventId} = req.params
   /*const eventDate = await Event.find({ event: eventId }).select("date")
   const formatedEventDate = eventDate[0]?.date?.toDateString();*/
   
    try {
      await Event.create({
        name,
        description,
        eventType,
        date,
        place,
        //photo: req.file.path,
        hour,
      });
      res.redirect("/events");
    } catch (error) {
      next(error);
    }
  }
);

//GET "/events/:eventId/edit" => renders form to update event
router.get("/:eventId/edit", isAdmin, async (req, res, next) => {
  const { eventId } = req.params;

  try {
    //const formerEventType = eventType.map()
    //console.log(formerEventType)
    const eventDetails = await Event.findById(eventId);
    res.render("events/events-edit.hbs", { eventDetails, eventType });
  } catch (error) {
    next(error);
  }
});

//POST "/events/:eventId/edit" => gets info from update form and update DB
router.post(
  "/:eventId/edit",
  isAdmin,
  fileUploader.single("event-image"),
  async (req, res, next) => {
    const { name, description, eventType, date, place, hour } = req.body;
    const eventDetails = {
      name,
      description,
      eventType,
      date,
      place,
      photo: req.file?.path,
      hour,
    };
    const { eventId } = req.params;

    try {
      await Event.findByIdAndUpdate(eventId, eventDetails);
      res.redirect("/events");
    } catch (error) {
      next(error);
    }
  }
);

//POST "/events/:eventId/delete" => delete event
router.post("/:eventId/delete", isAdmin, async (req, res, next) => {
  const { eventId } = req.params;

  try {
    await Event.findByIdAndRemove(eventId);
    res.redirect("/events");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
