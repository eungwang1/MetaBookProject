const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
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

const Comment = mongoose.model("Comment", commentSchema);

module.exports = { Comment };
