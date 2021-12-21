const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    author: {
        // ref: 'User'
        type: String,
        require: true,
    },
    content: {
        type: String,
        require: true,
    },
});

module.exports = mongoose.model("Comment", commentSchema);
