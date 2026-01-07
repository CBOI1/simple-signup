const express = require('express');
const { matchedData, validationResult, body } = require('express-validator');
const path = require('path');
const db = require(path.join(__dirname, '..', 'db.js'));
const router = express.Router();
const loginValidator = require(path.join(__dirname, '..', 'utility')).loginValidator;


router.get('/', (req, res) => {
    res.send('<p>Hello</p>');
});

router.get('/register', (req, res) => {
    res.render('register');
})

router.post('/register', loginValidator(), async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.send(result.array());
    }
    await db.addUser(matchedData(req));
    res.redirect('/'); //CHANGE WHEN SESSIONS ARE IMPLEMENTED
});

module.exports = router;