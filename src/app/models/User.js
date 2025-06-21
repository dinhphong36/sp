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
        enum: ['user', 'admin'], // Chỉ chấp nhận 2 giá trị: 'user' hoặc 'admin'
        default: 'user' // Mặc định là 'user' khi tạo mới
    }
   
    

    
})
UserSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: true });
module.exports = mongoose.model("User", UserSchema);