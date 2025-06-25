const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseDelete = require("mongoose-delete");

const CartSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    name: { type: String },
    image: { type: String },
    price: { type: String },
    quantity: { type: Number, required: true },
    info: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

CartSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: true });

module.exports = mongoose.model("Cart", CartSchema);
