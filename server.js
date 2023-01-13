import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import mongoose from "mongoose";

import routes from "./routes/routes.js";

// ==========
// App initialization
// ==========

dotenv.config();
const HOSTNAME = process.env.HOSTNAME;
const PORT = process.env.PORT;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("MongoDB connected!");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

// ==========
// App middlewares
// ==========
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname + "/views/"));

app.use(
  session({
    name: "simple",
    secret: "simple",
    resave: false,
    saveUninitialized: true,
  })
);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Sommething went wrong";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

// envoyer les données dans req.body
// format "application/x-www-form-urlencoded"
app.use(express.urlencoded({ extended: true }));

// si les données étaient envoyées en "application/json", on aurait plutôt utilisé :
app.use(express.json());

// ==========
// App routers
// ==========

app.use("/", routes);

// ==========
// App start
// ==========

app.listen(PORT, () => {
  connect();
  console.log(`App listening at http://${HOSTNAME}:${PORT}`);
});
