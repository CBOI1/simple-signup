const express = require('express');
const { matchedData, validationResult, body } = require('express-validator');
const passport = require('passport');
const path = require('path');
const db = require(path.join(__dirname, '..', 'db.js'));
const router = express.Router();
const validate = require(path.join(__dirname, '..', 'utility'));
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { format } = require('date-fns');


function capitalize(word) {
    const temp = word.trim();
    return temp.charAt(0).toUpperCase() + temp.substring(1).toLowerCase();
}

function processPosts(posts) {
    const result = []
    for (const post of posts) {
        const title = post.title.trim().split(" ").filter((word) => word !== "").map(capitalize).join(" ");
        const fullname = capitalize(post.first) + " " + capitalize(post.last);
        const date = format(new Date(post.ts), 'MMMM dd, yyyy');
        const text = post.text;
        result.push({fullname, title, date, text});
    }
    return result
}

router.get('/', async (req, res) => {
    const posts = await db.getMessages()
    res.
    render
    ( 
        'index', 
        {
            isAuthenticated: req.isAuthenticated.bind(req), 
            posts: processPosts(posts),
            isMember: () => req.user && req.user.membership
        }
    );
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
        await db.addPost(req.user, req.body.title, req.body.text);
        res.redirect('/');
    }
);

router.post('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

router.get('/become-member', async (req, res) => {
    res.render('member');
});

router.post('/become-member', async (req, res) => {
    if (req.user && req.body.password === process.env.MEMBER_PASSWORD) {
        await db.becomeMember(req.user.username);
        return res.redirect('/');
    } else {
        res.redirect('/become-member');
    }
})


/*
router.get('become-member', (req, res) => {
});
*/

//register and configure strategy
passport.use(new LocalStrategy(async (username, password, done) => {
    //check if username exists in db
    try {
        const user = await db.getUser(username)
        if (!user) {
            return done(null, false, {message: "Invalid email"});
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
    done(null, user.username);
})

passport.deserializeUser(async (username, done) => {
    const user = await db.getUser(username);
    return done(null, user);
})




module.exports = router;