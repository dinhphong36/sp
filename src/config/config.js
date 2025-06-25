const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
async function connectDB() {
   try {
        await mongoose.connect("mongodb://localhost:27017/mit_vietnam",{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB");
   } catch (error) {
        console.log("Failed to connect to MongoDB");
    
   }
}

module.exports = {
    connectDB
};
