const { body } = require("express-validator")
const db = require('./../db.js');
const { error } = require("console");
const MIN_PASSWORD_LEN = 8;
module.exports.register = () =>  {
    return [
    body('first').trim().notEmpty().escape(), 
    body('last').trim().notEmpty().escape(), 
    body('email').trim().isEmail().escape().toLowerCase()
    .custom(async value => {
        if (!await db.available(value)) {
            throw new Error('Email already in use.');
        }
        return true;
    }),
    body('password').notEmpty().custom(
        (password, { req } ) => {
            //verify password and confirmation match
            if (password !== req.body.confirmation) {
                throw new Error('Passwords do not match.');
            }
            return true;
        }
    )
    ];
};

module.exports.login = () => {
    return [
        body('username').trim().isEmail().toLowerCase(),
        body('password').notEmpty().isLength({min: MIN_PASSWORD_LEN})
        .withMessage(`Password must be at least ${MIN_PASSWORD_LEN} characters long.`)
    ]
};

module.exports.createMessage = () => {
    return [
        body('title').trim().notEmpty().toLowerCase(),
        body('text').trim().notEmpty()
    ]
};