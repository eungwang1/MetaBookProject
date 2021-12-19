const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
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

const User = mongoose.model("User", userSchema);

module.exports = { User };
