const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseDelete = require("mongoose-delete");

const UserSchema = new Schema({
    username: {type: String, },
    password: {type: String, },
    email: {type: String, },
    sdt: {type: String, },
    role: { 
        type: String, 
        
    },
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
   
    

    
})
UserSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: true });
module.exports = mongoose.model("User", UserSchema);