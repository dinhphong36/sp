const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseDelete = require("mongoose-delete");

const mitSchema = new Schema({
    name: {type: String, },
    image: {type: String, },
    price: {type: String, },
    info: {type: String, },
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
    
})
mitSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: true });
module.exports = mongoose.model("mit", mitSchema);