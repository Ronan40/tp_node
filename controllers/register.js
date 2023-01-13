import User from "../models/User.js";
import bcrypt from "bcryptjs";

const register = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({
      ...req.body,
      password: hash,
    });

    if (!req.body.email) {
      throw new Error("Email is required");
    }
    if (!req.body.name) {
      throw new Error("Name is required");
    }
    if (!req.body.password) {
      throw new Error("Password is required");
    }
    if (req.body.password !== req.body.Vpassword) {
      throw new Error("Password should be the same");
    }

    const user = await User.findOne({ email: req.body.email });

    if (user) {
      throw new Error("User already exist");
    } else {
      await newUser.save();

      res.redirect("/");
    }
  } catch (error) {
    res.render("register.ejs", { error: error.message });
    next();
  }
};

export default register;
