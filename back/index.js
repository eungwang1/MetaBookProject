const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const morgan = require("morgan");
const passport = require("passport");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

// middlewares
const loginRequired = require("./middlewares/login-required");

const app = express();

require("./passport")();
require("dotenv").config();

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

app.use(
    session({
        secret: "10Team",
        resave: false,
        saveUninitialized: true,
    })
);

app.use(passport.session());
app.use(passport.initialize());

const _storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});

const upload = multer({ storage: _storage });

app.use("/api/images", express.static(path.join(__dirname, "/uploads")));

const user_router = require("./routes/user_router");
const post_router = require("./routes/post_router");
const com_router = require("./routes/com_router");
const page_router = require("./routes/page_router");

//라우터를 모으자!
app.use("/api/user", user_router);
app.use("/api/post", loginRequired, post_router);
app.use("/api/page", page_router);
app.use("/api/comment", loginRequired, com_router);

app.post("/api/upload", upload.single("userfile"), function (req, res) {
    try {
        res.json({ ok: true, thumbnailUrl: req.file.filename });
    } catch (err) {
        res.json({ ok: false });
    }
});

app.listen(process.env.port, () => {
    console.log("Server is working : PORT - ", process.env.port);
});

mongoose
    .connect(process.env.mongodbURL)
    .then(() => {
        console.log("MongoDB connected...");
    })
    .catch((err) => console.log(err));
