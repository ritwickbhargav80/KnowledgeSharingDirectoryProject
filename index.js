const express = require("express");
const passport = require('passport');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const ejs = require('ejs');
require('./config/passport')(passport);

const app = express();

const cors = require('cors');
require('dotenv').config();
require('./config/dbconnection');
app.use(cors());
//app.engine('html',require('ejs').renderFile);
//app.set('view engine','html');
app.set('view engine', 'ejs');
app.use(express.urlencoded({
    extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));


app.use(cookieParser());
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/resources', require('./routes/resources'));
app.use('/contests', require('./routes/contests'));
app.use('/blogs', require('./routes/blogs'));
app.use('/admin', require('./routes/admin'));


app.listen(process.env.PORT, (err) => {
    if (err) {
        console.log("Error in running server");
        return;
    }
    console.log(`Server is up and running on PORT ${process.env.PORT}`);
});