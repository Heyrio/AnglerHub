const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const passport = require('passport');

//Login Page
router.get('/login',(req, res)=>{
    res.render('login');
});

//Register Page
router.get('/register',(req, res)=>{
    res.render('register');
});


//Register Handling
router.post('/register', (req, res)=>{
    const {name, email, password, password2} = req.body;
    let errors = [];

    //check required fields

    if(!name || !email || !password || !password2){
        errors.push({msg: 'Please fill out all fields'})
    }

    if(password !== password2){
        errors.push({msg: 'password do not match'})
    }

    if(password.length < 6){
        errors.push({msg: 'Password should be atleast 6 character'})
    }

    if(errors.length > 0){
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    }else {
        // validation passed
        User.findOne({ email: email})
        .then((user)=>{
            if(user){
                //User exists
                errors.push({msg: 'Email already exists'})
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            }else {
                const newUser = new User({
                    name,
                    email,
                    password
                });

                // Hash password
                bcrypt.genSalt(10, (error, salt)=> 
                bcrypt.hash(newUser.password, salt, (error, hash)=>{
                    if(error) throw error;
                    // set password to hashed
                    newUser.password = hash;
                    // Save User
                    newUser.save()
                    .then(user=>{
                        res.redirect('/users/login')
                    })
                    .catch(err => console.log(err))

                }))
               
            }
        });
    }
});

//login handle

router.post('/login', (req, res, next)=>{
    passport.authenticate('local', {
        successRedirect: '/home',
        failureRedirect: '/users/login'
    })(req, res, next);
});


//Logout handle

router.get('/logout', (req, res)=>{
    req.logout();
    res.redirect('/users/login');
});

module.exports = router;