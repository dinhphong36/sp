const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

function mongooseToObject(mongoose) {
    return mongoose ? mongoose.toObject() : mongoose;
}

function mutipleMongoToObject(mongooses) {
    return mongooses.map(mongoose => mongoose.toObject());
}

module.exports = {
    mongooseToObject,
    mutipleMongoToObject
};