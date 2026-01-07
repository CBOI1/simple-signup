const pg = require('pg');
const passport = require('passport');
const session = require('expres-session');
const express = require('express');
require('dotenv').config();
const router = require('/routes');


const app = express();

app.set('view engine', 'ejs');
app.set('views', '/views');

//parser
app.use(express.urlencoded({extended: true}));
//adding session support and authentication
app.use(session({secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(router);
app.listen(3000);


