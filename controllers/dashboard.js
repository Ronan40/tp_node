export default (req, res) => {
  res.render("dashboard.ejs", { name: req.body.name });
};
