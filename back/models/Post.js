const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    author: {
        // User_id
        type: String,
        require: true,
    },
    title: {
        type: String,
        require: true,
    },
    content: {
        type: String,
        require: true,
    },
    metaUrl: {
        type: String,
        require: true,
    },
    thumbnailUrl: {
        type: String,
        require: true,
    },
    likes: {
        type: Array,
        // require: true,
    },
    comments: {
        type: String,
        require: true,
    },
    tags: {
        type: Array,
        // require: true,
    },
});

const Post = mongoose.model("Post", postSchema);

module.exports = { Post };
