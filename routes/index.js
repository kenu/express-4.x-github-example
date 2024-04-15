import express from "express";
import connectEnsureLogin from "connect-ensure-login";
import passport from "passport";

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});
const router = express.Router();
// Initialize Passport and restore authentication state, if any, from the
// session.
router.use(passport.initialize());
router.use(passport.session());


router.get("/", function (req, res) {
  res.render("home", { user: req.user });
});

router.get("/login", function (req, res) {
  res.render("login");
});

router.get("/login/github", passport.authenticate("github"));

router.get(
  "/login/github/return",
  passport.authenticate("github", { failureRedirect: "/login" }),
  function (_req, res) {
    res.redirect("/");
  }
);

router.get("/profile", connectEnsureLogin.ensureLoggedIn(), function (req, res) {
  res.render("profile", { user: req.user });
});

router.get("/logout", function (req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

export default router;
