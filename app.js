const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const multer = require("multer");
const multipart = multer().none();
require("dotenv").config();


// require routing and services
const indexRoute = require("./routes/index.routes");
const signupRoute = require("./routes/signup.routes");
const loginRoute = require("./routes/login.routes");
const companyRoute = require("./routes/company.routes");
const userRoute = require("./routes/user.routes");
const profileRoute = require("./routes/profile.routes");
const tokenServices = require("./services/token.services");
const authController = require("./controller/auth.controller");




const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(multipart);
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// middleware route
app.use("/", indexRoute);
app.use("/api/signup", signupRoute);
app.use("/api/login", loginRoute);


// implimenting api sequerity
app.use((req, res, next) => {
  const token = tokenServices.verifyToken(req);
  if (token.isVerified) {
    next();
  } else {
    res.status(401);
    res.clearCookie("authToken");
    res.redirect("/");
  }
})



// implimenting middleware for checking user already login or not
const appLogger = () => {
  return async (req, res, next) => {

    const isLogged = await authController.checkUserLog(req, res);
    if (isLogged) {
      next();
    } else {
      res.clearCookie("authToken");
      res.redirect("/")
    }

  }
}


app.use("/api/private/company", companyRoute);
app.use("/api/private/user", userRoute);
app.use("/profile", appLogger(), profileRoute);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});



// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;