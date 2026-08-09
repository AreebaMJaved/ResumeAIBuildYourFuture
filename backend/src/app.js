require("dotenv").config();

const express = require("express");
const session = require("express-session");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const connectDB = require("./config/db");

// REQUIRE ROUTES
const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");

const app = express();

/* ---------------- MIDDLEWARES ---------------- */

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// BODY PARSER
app.use(express.json());

// COOKIE PARSER
app.use(cookieParser());

/* ---------------- SESSION ---------------- */

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "none",
    },
  })
);

/* ---------------- PASSPORT ---------------- */

app.use(passport.initialize());
app.use(passport.session());

/* ---------------- DATABASE ---------------- */

// Make sure MongoDB is connected before handling API routes
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection failed:", error);

    res.status(500).json({
      message: "Database connection failed",
    });
  }
});

/* ---------------- ROUTES ---------------- */

app.use("/api/auth", authRouter);

app.use("/api/interview", interviewRouter);

/* ---------------- TEST ROUTE ---------------- */

app.get("/api/test", (req, res) => {
  res.json({
    message: "Backend is working!",
  });
});

module.exports = app;