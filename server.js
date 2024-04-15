import "dotenv/config";
import express from "express";
import passport from "passport";
import { Strategy } from "passport-github2";
import path from "path";
const __dirname = path.resolve();

// Configure the GitHub strategy for use by Passport.
//
// OAuth 2.0-based strategies require a `verify` function which receives the
// credential (`accessToken`) for accessing the GitHub API on the user's
// behalf, along with the user's profile.  The function must invoke `cb`
// with a user object, which will be set at `req.user` in route handlers after
// authentication.
passport.use(
  new Strategy(
    {
      clientID: process.env["GITHUB_CLIENT_ID"],
      clientSecret: process.env["GITHUB_CLIENT_SECRET"],
      callbackURL: "/login/github/return",
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log("accessToken", accessToken);
      // In this example, the user's GitHub profile is supplied as the user
      // record.  In a production-quality application, the GitHub profile should
      // be associated with a user record in the application's database, which
      // allows for account linking and authentication with other identity
      // providers.
      return cb(null, profile);
    }
  )
);

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete GitHub profile is serialized
// and deserialized.
passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

// Create a new Express application.
const app = express();

// Configure view engine to render EJS templates.
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
import morgan from "morgan";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import expressSession from "express-session";
app.use(morgan("combined"));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  expressSession({
    secret: "github cat",
    resave: true,
    saveUninitialized: true,
  })
);

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// Define routes.
app.get("/", function (req, res) {
  res.render("home", { user: req.user });
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/login/github", passport.authenticate("github"));

app.get(
  "/login/github/return",
  passport.authenticate("github", { failureRedirect: "/login" }),
  function (_req, res) {
    res.redirect("/");
  }
);

import connectEnsureLogin from "connect-ensure-login";
app.get("/profile", connectEnsureLogin.ensureLoggedIn(), function (req, res) {
  res.render("profile", { user: req.user });
});

app.get("/logout", function (req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.listen(process.env["PORT"] || 3000);
