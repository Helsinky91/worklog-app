const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");

//GET "/auth/registrer" => render a page with a registration form
router.get("/signup", (req, res, next) => {
    res.render("auth/signup.hbs")
})

//POST "/auth/signup" => recive form data and create profile in DB. Redirect to login page
router.post("/signup", async (req, res, next) => {
    //recieved information
    const { email, password } = req.body
    // Backend validations
    if ( email === "" || password === "") {
        res.render("auth/signup.hbs", {
            errorMessage: "Please, fill all the fields"
        })
        return;
    }
    //validate the password security level
    const passwordRegex = /^(?=.*\d)(?=.*[a-z]).{6,}$/gm;
    if (passwordRegex.test(password) === false) {
        res.render("auth/signup.hbs", {
          errorMessage:
            "The password must have 6 caracters containing one number",
        });
        return;
    }
    try { 
        const userEmail = await User.findOne({email})
        if (userEmail !== null) {
            res.render("auth/signup.hbs", {
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
 //redirect to login page 
 res.redirect("/auth/login");

    } catch(err) {
        next(err)
    }
    
})


//GET "auth/login" => render login form view
router.get("/login", (req, res, next) => {
    res.render("auth/login.hbs")
})

//POST "auth/login" => recieve user credencials and validate
router.post("/login", async (req, res, next) => {
    //recieved information
    const {email, password} = req.body

    // Backend validations
    if ( email === "" || password === "") {
    res.render("auth/login.hbs", {
        errorMessage: "Please, fill all the fields"
        })
        return;
    }
    
    try{
        //verificates if email exists
        const foundUser = await User.findOne({email})
        if (foundUser === null) {
            res.render("auth/login.hbs", {
                errorMessage: "Wrong credentials",
              });
            return
        }
        //verificates if password is correct
        const isPasswordValid = await bcrypt.compare(password, foundUser.password) 
        if (isPasswordValid === false) {
            res.render("auth/login.hbs", {
                errorMessage: "Wrong credentials"
            })
            return
        }

        //active session of the user
        req.session.activeUser = foundUser
    
        //to make sure 
        req.session.save(() => {
            //4. redireccionar private view
            res.redirect("/profile");
        })

    } catch(err) {
        next(err)
    }

})

//GET "/auth/logout" => cierra la sessión (la destruye)
router.get("/logout", (req, res, next) => {
    req.session.destroy(() => {
        //res.render("index.hbs", {logoutMessag: "You've been logged out"} )
        res.redirect("/");
     //! crear mensaje "you'be been logged out"
    }) 

}) 






module.exports = router;