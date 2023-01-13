export default (req, res) => {
  if (req.session.auth) {
    res.redirect("/dashboard");

    return;
  }

  res.render("register.ejs",  {error: null});
};
