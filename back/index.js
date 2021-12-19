const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const multer = require("multer");
const fs = require("fs");
const app = express();
const port = 3000;
const schema = mongoose.Schema;

// app.set("view engine", "ejs");

require("dotenv").config();
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASS:", process.env.DB_PASS);

app.use(morgan("dev"));
// app.use("/", require("./routes/image"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const User = require("./models/User");
const router = require("./routes/user_router")(app, User);

app.get("/", (req, res) => {
    res.send("<b>Hello World! ❤</b><br>졸리다");
});

// app.get("/upload", (req, res) => {
//     res.render("upload");
// });

app.listen(port, () => {
    var dir = "./uploadedFiles";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    console.log("Server is working : PORT - ", port);
});

mongoose
    .connect(process.env.mongodbURL)
    .then(() => {
        console.log("MongoDB connected...");
    })
    .catch((err) => console.log(err));
