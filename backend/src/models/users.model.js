const mongoose=require("mongoose");


const userSchema=new mongoose.Schema({
    username:{
      type: String,  
      required: true,
      unique:[true,"User already exits with this user"],
      trim: true,        
      lowercase: true,   
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [20, "Username cannot exceed 20 characters"]

    },
    email:{
      type: String,  
      required: true,
      unique:[true,"Account already exits with this email"]
    },
    password: {
       type: String,
      required: function () { return this.authProvider === "local"; },
}
    ,
    authProvider: {
  type: String,
  enum: ["local", "google"],
  default: "local",
}
})
const userModel=mongoose.model("users",userSchema);

module.exports=userModel;