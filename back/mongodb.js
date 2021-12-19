const mongoose = require("mongoose");
mongoose.connect(
    "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    }
);

const connection = mongoose.connection;
connection.on("error", console.error);
connection.once("open", () => {
    console.log("Connected to mongod server");
});
