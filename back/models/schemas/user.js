const { Schema } = require("mongoose");

const UserSchema = new Schema(
    {
        email: {
            type: String,
            unique: true,
            trim: true,
        },
        name: {
            type: String,
            unique: true,
            required: true,
            max: 12,
            min: 4,
        },
        password: {
            type: String,
            required: true,
        },
        introduce: {
            type: String,
        },
        metaUrl: {
            type: String,
        },
        metaThumbUrl: {
            type: String,
        },
        profileImg: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = UserSchema;
