const {Router}=require("express");
const authRouter=Router();
const authController=require("../controllers/auth.controller")
const authMiddleware=require("../middlewares/auth.middlewares")
const passport = require("passport"); 
/**
 * @route POST /api/auth/register
 * @description register a new user
 * @access public
 */
authRouter.post("/register",authController.registerUserController)

/**
 * @route POST/api/auth/Login
 * @description login user who's already registered via email and password
 * @access public
 */
authRouter.post("/login",authController.loginUserController)

/**
 * @route GET/api/auth/logout
 * @description clear token from user side cookie and add in token blacklist
 * @access public
 */
authRouter.get("/logout",authController.logoutUserController)
/**
 * @route GET/api/auth/get-me
 * @description get the current logged in user
 * @access private
 */
authRouter.get("/get-me",authMiddleware.authUser,authController.getMeController)
module.exports=authRouter;

/**
 * @route GET /api/auth/google
 * @description start google login
 * @access public
 */
authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

/**
 * @route GET /api/auth/google/callback
 * @description google redirect callback
 * @access public
 */
authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "http://localhost:5173/login",
  }),
  authController.googleCallbackController   // <- controller call, inline logic nahi
);