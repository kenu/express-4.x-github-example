import "dotenv/config";
import express from "express";
import passport from "passport";
import GitHub from "passport-github2";
import path from "path";
const __dirname = path.resolve();

passport.use(
  new GitHub.Strategy(
    {
      clientID: process.env["GITHUB_CLIENT_ID"],
      clientSecret: process.env["GITHUB_CLIENT_SECRET"],
      callbackURL: "/login/github/return",
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log("accessToken", accessToken);
      return cb(null, profile);
    }
  )
);

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

import indexRouter from "./routes/index.js";
app.use(indexRouter);

const port = process.env["PORT"] || 3000;
app.listen(port, () => {
  console.log("Server listening on port " + port);
});
