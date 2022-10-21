const express = require("express");
const router = express.Router();
const User = require("../models/User.model");



//GET "/profile" => render user or admin profile
router.get("/", async (req, res, next) => {
    try {
        const userDetails = await User.findById(req.session.activeUser._id)
        res.render("profile/profile.hbs", {userDetails})
    } catch(err) {
        next(err)
    }
    

})



module.exports = router;