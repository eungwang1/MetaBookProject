const mongoose = require("mongoose");
const PostSchema = require("./schemas/Post");
const UserSchema = require("./schemas/User");
// const CommentSchema = require("./schemas/Comment");

exports.Post = mongoose.model("Post", PostSchema);
exports.User = mongoose.model("User", UserSchema);
// exports.Comment = mongoose.model("Comment", CommentSchema);
