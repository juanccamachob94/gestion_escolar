var createError = require('http-errors');
var express = require('express');
const expressFormData = require('express-form-data');
var path = require('path');
var logger = require('morgan');
const secrets = require('./config/secrets');
const mongoose = require('mongoose');
const databases = require('./config/databases');
const expressSession = require('express-session');
var cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const project_features = require('./config/project_features');
const connectFlash = require('connect-flash');
const expressMessages = require('express-messages');
const passport = require('passport');
const passport_serialize = require('./middlewares/passport_serialize');
const passportOAuth = require('./middlewares/passportOAuth');

const connectMongo = require('connect-mongo')(expressSession);

const index = require('./routes');
const user = require('./routes/user');
const access = require('./routes/access');

//DB connection
mongoose.connect(databases.mongoDB.getUrlMongoDB(),{useCreateIndex: true,useNewUrlParser:true});
mongoose.connection.once('open',() => console.log('Database connection is OK'));
mongoose.connection.on('error',err => console.log('Database connection failed: ' + err));

var app = express();

let cookie = {expires: new Date(253402300000000)};
if(process.env.NODE_ENV == 'development') cookie = {maxAge: 1000 * 60 * 30};

app.use(expressSession({
 store: new connectMongo({url: databases.mongoDB.getUrlMongoDB(),collection: 'sessions'}),
 secret: secrets.session,
 resave: true,
 saveUninitialized: true,
 cookie
}));

app.use(expressFormData.parse({keepExtensions:true}));

app.use(connectFlash());
app.use(function (req, res, next) {
  res.locals.messages = expressMessages(req,res);
  next();
});


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride('_method'));

app.use(cookieParser(secrets.cookie));

passport_serialize(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, project_features.staticFolder.root)));

app.use('/', index);
app.use('/user', user);
app.use('/access',access);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

passport.use(passportOAuth.facebookStrategy());
passport.use(passportOAuth.googleStrategy());
passport.use(passportOAuth.localStrategy());

module.exports = app;
