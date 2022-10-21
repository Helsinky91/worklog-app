const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");

//GET "/auth/registrer" => render a page with a registration form
router.get("/registrer", (req, res, next) => {
    res.render("auth/singup.hbs")
})

//POST "/auth/signup" => recive form data and create profile in DB. Redirect to login page
router.post("/signup", async (req, res, next) => {
    //recieved information
    const { email, password } = req.body
    // Backend validations
    if ( email === "" || password === "") {
        res.render("auth/singup.hbs", {
            errorMessage: "Please, fill all the fields"
        })
        return;
    }
    //validate the password security level
    const passwordRegex = /^(?=.*\d)(?=.*[a-z]).{6,}$/gm;
    if (passwordRegex.test(password) === false) {
        res.render("auth/singup.hbs", {
          errorMessage:
            "The password must have 6 caracters containing one number",
        });
        return;
    }
    try { 
        const userEmail = await User.findOne({email})
        if (userEmail !== null) {
            res.render("auth/singup.hbs", {
                errorMessage: "This email is already registered",
              });
              //! bonus: RECUPERA TU CONTRASEÑA?
              return;
        }
        //Secured password
        const salt = await bcrypt.genSalt(12); 
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = {
            email: email,
            password: hashPassword, //guardamos la contraseña que hemos cifrado en el punto 2
          };
          await User.create(newUser)
    } catch(err) {
        next(err)
    }

    







})







module.exports = router;