const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        require: true,
    },
    email: {
        type: String,
        unique: true,
        require: true,
    },
    introduce: {
        type: String,
        require: true,
    },
    metaUrl: {
        type: String,
        require: true,
    },
    metaThumbUrl: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    profileImg: {
        type: String,
        require: true,
    },
});

module.exports = mongoose.model("User", userSchema);
