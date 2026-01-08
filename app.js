const pg = require('pg');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const express = require('express');
require('dotenv').config();
const router = require(path.join(__dirname, 'routes'));


const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//parser
app.use(express.urlencoded({extended: true}));
//adding session management and session authentication
app.use(session({secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(router);
app.listen(3000);


