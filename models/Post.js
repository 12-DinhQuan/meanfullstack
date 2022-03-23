const mongoose = require("mongoose"); // Erase if already required
const Schema = mongoose.Schema

// Declare the Schema of the Mongo model
var PostSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true
    },
    url: {
        type: String,
    },
    status: {
        type: String,
        enum: ['TO LEARN', 'LEARNING', 'LEARNED']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
}, { timestamps: true });

//Export the model
module.exports = mongoose.model("posts", PostSchema);