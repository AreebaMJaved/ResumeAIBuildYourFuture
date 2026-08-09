require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");

// 👇 THIS LINE IS CRITICAL
require("./src/config/passport");

const PORT = 5000;

connectDB();

app.listen(PORT, () => {
  console.log("server is running on port 5000");
});
