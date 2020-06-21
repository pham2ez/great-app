const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const history = require('connect-history-api-fallback');

const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');
const restaurantRouter = require('./routes/restaurants');
const usersRouter = require('./routes/users');
const greatingRouter = require('./routes/greatings');
const inviteRouter = require('./routes/invite');
const notificationsRouter = require('./routes/notifications');

const app = express();

app.use(history());

app.use(logger('dev'));
app.use(session({secret: "test", resave: true, saveUninitialized: true}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/dist')));

app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/api/restaurants', restaurantRouter);
app.use('/api/users', usersRouter);
app.use('/api/greatings', greatingRouter);
app.use('/api/invite', inviteRouter);
app.use('/api/notifications/', notificationsRouter);
//app.use(function (req, res, next) {
//    res.status(404).send("Sorry this url could not be found.")
//})

module.exports = app;
