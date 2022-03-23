const mongoose = require("mongoose"); // Erase if already required
const Schema = mongoose.Schema


// Declare the Schema of the Mongo model
const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true });

//Export the model
module.exports = mongoose.model("users", UserSchema);