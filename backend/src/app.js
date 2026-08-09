const express = require("express");
const session = require("express-session");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// REQUIRE ROUTES
const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");
const app = express();


/* ---------------- MIDDLEWARES ---------------- */

// CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// BODY PARSER
app.use(express.json());
app.use(cookieParser());

/* ---------------- SESSION (MUST BE BEFORE PASSPORT) ---------------- */
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);

/* ---------------- PASSPORT ---------------- */
app.use(passport.initialize());
app.use(passport.session());

/* ---------------- ROUTES ---------------- */
app.use("/api/auth", authRouter);
app.use("/api/interview",interviewRouter)

module.exports = app;
