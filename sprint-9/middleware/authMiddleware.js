// Middleware to check if user is logged in
function isLoggedIn(req, res, next) {
  if (req.session.userId) {
    return next();
  }
  res.redirect("/login");
}

module.exports = { isLoggedIn };
