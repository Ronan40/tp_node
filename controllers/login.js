import User from "../models/User.js";
import bcrypt from "bcryptjs";


const login = async (req, res, next) => {
  try {
    req.session.auth = false;
    const user = await User.findOne({ username: req.body.name });
    
    if (!user) throw new Error("User not found");

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect) {
      throw new Error("Wrong password or username !");
    } else {
      req.session.auth = true;
    }
    if (req.session.auth) {
      res.redirect("/dashboard");

      return;
    }
  } catch (error) {
    res.render("login.ejs", { error: error.message });
    next()
  }
};

export default login;
