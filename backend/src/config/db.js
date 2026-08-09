const mongoose=require("mongoose")

async function connectDB(){
   console.log("connectDB called!")
    try{
       await mongoose.connect(process.env.MONGO_URI) 
       console.log("Database is connected.")
    }
    catch(err){
       console.log("error coming from fetching the db",err)
    }
       
}
module.exports=connectDB;