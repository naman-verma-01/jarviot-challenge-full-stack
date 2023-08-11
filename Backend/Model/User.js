const { mongoose } = require("mongoose")


const userSchema = new mongoose.Schema({
    gId: String,
    name: String,
    profilePicture: String,
    tokens: String
}, { timestamp: true }

);


const User = mongoose.model('userGDrive', userSchema);
module.exports = User