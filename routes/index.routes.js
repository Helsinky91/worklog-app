const express = require('express');
const router = express.Router();
const {isLoggedIn, isAdmin} = require("../middlewares/auth.middleware.js")

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});


//USE "/auth" => routas auth
const authRoutes = require("./auth.routes.js")
router.use("/auth", authRoutes)

const profileRoutes = require("./profile.routes.js")
router.use("/profile", isLoggedIn, profileRoutes)

const eventsRoutes = require("./events.routes.js")
router.use("/events", isLoggedIn, eventsRoutes)

const adminRoutes = require("./admin.routes.js")
router.use("/events", isLoggedIn, isAdmin, adminRoutes)


module.exports = router;