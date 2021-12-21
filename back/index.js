const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const multer = require("multer");
const fs = require("fs");

const _storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});
const upload = multer({ storage: _storage });
const path = require("path");

const app = express();
const port = 3000;
const schema = mongoose.Schema;

require("dotenv").config();

app.use(morgan("dev"));

const user_router = require("./routes/user_router");
const post_router = require("./routes/post_router");

app.use("/images", express.static(path.join(__dirname, "/uploads")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/upload", upload.single("userfile"), function (req, res) {
    try {
        res.json({ ok: true, thumbnailUrl: req.file.filename });
    } catch (err) {
        res.json({ ok: false });
    }
});
//라우터를 모으자!
app.use("/user", user_router);
app.use("/post", post_router);

app.listen(port, () => {
    console.log("Server is working : PORT - ", port);
});

mongoose
    .connect(process.env.mongodbURL)
    .then(() => {
        console.log("MongoDB connected...");
    })
    .catch((err) => console.log(err));
