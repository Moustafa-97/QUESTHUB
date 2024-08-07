const express = require("express");
const path = require("path");
const dotenv = require("dotenv").config();
const server = require("http").createServer();
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
// import routes
const userRoutes = require("./routes/route");
// import middlewares
const { notFound, errorHandler } = require("./middleware/ErrorMiddleware");
const { connectDB } = require("./config/db.js");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, parameterLimit: 50000 }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(
  cors(
    {
      origin: "https://questhub-ten.vercel.app",
      methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
      // allowedHeaders: ["Content-Type", "Authorization"],
      exposedHeaders: ["Content-Range", "X-Content-Range"],
      preflightContinue: false,
      optionsSuccessStatus: 204,
      credentials: true,
      
    }
    // optionSuccessStatus: 200,
    // for cookies::
  )
);

app.use("/user", userRoutes);
app.get("/", (req, res) => {
  res.send("server is ready");
});
app.use(notFound);
app.use(errorHandler);

connectDB();
// mongoose.set("strictQuery", false);
app.listen(PORT, () => console.log(`started on ${PORT}`));
