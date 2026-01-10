const express = require('express');
const { matchedData, validationResult, body } = require('express-validator');
const passport = require('passport');
const { Strategy } = require('passport-local');
const path = require('path');
const db = require(path.join(__dirname, '..', 'db.js'));
const router = express.Router();
const validate = require(path.join(__dirname, '..', 'utility'));
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

router.get('/', (req, res) => {
    res.render('index', {isAuthenticated: req.isAuthenticated.bind(req)});
});

router.get('/register', (req, res) => {
    res.render('register');
})

router.post('/register', validate.register() , async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.send(result.array());
    }
    await db.addUser(matchedData(req));
    res.redirect('/login'); 
});

router.get('/login', (req, res) => {
    res.render('login');
});

//authenticate user when logging in
router.post(
    '/login', 
    validate.login(),
    passport.authenticate('local', {failureRedirect: '/login', successRedirect: '/'})
);


router.get('/create', (req, res) => {
    res.render('create', {isAuthenticated: req.isAuthenticated.bind(req)});
});

router.post('/create', 
    validate.createMessage(),
    async (req, res) => {
        await db.addPost(req.user.username, req.body.title, req.body.text);
        res.redirect('/');
    }
);

//register and configure strategy
passport.use(new LocalStrategy(async (username, password, done) => {
    //check if username exists in db
    try {
        const user = await db.getUser(username)
        if (!user) {
            done(null, false, {message: "Invalid email"});
        }
        const validPassword = await bcrypt.compare(password, user.hash);
        if (!validPassword) {
            return done(null, false, {message: "Incorrect password."})
        }
        return done(null, user)
    } catch(err) {
        done(err);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user);
})

passport.deserializeUser((user, done) => {
    done(null, user);
})




module.exports = router;