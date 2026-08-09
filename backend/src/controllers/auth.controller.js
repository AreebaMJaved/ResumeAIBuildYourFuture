const userModel = require("../models/users.model");
const blackListModel = require("../models/tokenBlackList.model");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


/**
 * @route GET /api/auth/google/callback
 * @description issue JWT after successful Google login
 * @access public
 */
async function googleCallbackController(req, res) {
  const token = jwt.sign(
    { id: req.user._id, username: req.user.username },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,       // production mein true karna (HTTPS)
    sameSite: "Lax",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.redirect("http://localhost:5173/home");
}

/**
 * @name registerUserController
 * @description register a new user
 * @access public
 */
async function registerUserController(req, res) {
  try {
    const { username, email, password } = req.body;

    // validation
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Required field is empty",
      });
    }

    // check existing user
    const isUserAlreadyExists = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (isUserAlreadyExists) {
      return res.status(400).json({
        message: "User already exists with this username or email!",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await userModel.create({
      email,
      username,
      password: hashedPassword,
    });

    // generate token
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("token", token);

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

/**
 * @name loginUserController
 * @description only registered users can login
 * @access public
 */
async function loginUserController(req, res) {
  try {
    const { email, password } = req.body;

    // find user
    const user = await userModel.findOne({ email });

    if (!user) {
      console.log("❌ No user found for email:", email);
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }
  
    // compare password
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );
    console.log("🔑 Password valid?", isPasswordValid); 

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }
    
    // generate token
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );

   
res.cookie("token", token, {
  httpOnly: true,        // prevents JS from reading it (XSS protection)
  secure: false,         // set true in production (HTTPS only)
  sameSite: "Lax",       // allows cookie to be sent cross-origin with GET
  maxAge: 24 * 60 * 60 * 1000  // 1 day in ms (matches your JWT expiry)
});

    return res.status(200).json({
      message: "User logged in successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
  if (user.authProvider === "google") {
  return res.status(400).json({
    message: "This account uses Google Sign-In. Please continue with Google.",
  });
}
}

/**
 * @name logoutUserController
 * @description logout user
 * @access private
 */
async function logoutUserController(req, res) {
  try {
    const token = req.cookies.token;

    if (token) {
      await blackListModel.create({ token });
    }

    res.clearCookie("token");

    return res.status(200).json({
      message: "User logout successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

/**
 * @route GET /api/auth/get-me
 * @description get current logged in user
 * @access private
 */
async function getMeController(req, res) {
  try {
    const user = await userModel.findById(req.user.id);

    return res.status(200).json({
      message: "User details fetched successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

module.exports = {
  registerUserController,
  loginUserController,
  logoutUserController,
  getMeController,
  googleCallbackController
};