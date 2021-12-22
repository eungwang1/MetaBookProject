const Schema = require("mongoose");

const commentSchema = new Schema.Schema(
    {
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        content: {
            type: String,
            require: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = commentSchema;
