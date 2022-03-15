const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');

// signup form -
router.get('/register', (req, res) => {
    res.render('signup');
})


// posting the new registered  user
router.post('/register', async (req, res) => {

    if (req.body.password != req.body.confirmPassword) {
        req.flash('error', 'Passwords do not match');
        return res.redirect('/register');
    }
    try {

        const { username, email, password } = req.body;


        const user = new User({
            username: username,
            email: email
        });

        const newUser = await User.register(user, password);


        req.flash('success', 'Registeration Successful');

        res.redirect('/login');

    }

    catch (e) {
        req.flash('error', 'Same username or email already registerd');
        res.redirect('/register');
    }

});

// login page

//username
var userr = "";

router.post('/login',
    passport.authenticate('local',
        {
            failureRedirect: '/login',
            failureFlash: true
        }),

    (req, res) => {

        const { username } = req.user;
        userr = username;
        req.flash('success', `Welcome Back ${username} `);
        res.redirect('/startChat');

    });

//getting the login page
router.get('/login', (req, res) => {
        res.render('login')
})  


router.get('/startChat', (req, res) => {
    if (userr == "") {
        return res.redirect('/login');
    }
    res.render('chat', {
        user: userr
    });
});


router.get('/logout', (req, res) => {
    req.logout();
    userr = "";
    req.flash('success', 'Logout Successfully');
    res.redirect('/');
})


//rendering home
router.get('/', (req, res) => {
    res.render('home');
});

module.exports = router;