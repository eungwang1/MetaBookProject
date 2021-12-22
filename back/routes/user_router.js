const express = require("express");
const router = express.Router();
const hashPassword = require("../utils/hash-password");
const { User } = require("../models");
const passport = require("passport");

router.get("/", (req, res) => {
    if (req.user) {
        console.log(req.user);
        return res.json({ ok: true, userId: req.user.id });
    }
    return res.json({ ok: false });
});

router.post("/login", passport.authenticate("local"), (req, res, next) => {
    res.json({ ok: true, userId: req.user.id });
});

router.post("/join", (req, res) => {
    const user = new User(req.body);
    user.password = hashPassword(user.password);
    user.save((err, userInfo) => {
        if (err) return res.json({ ok: false, err });
        return res.json({ ok: true });
    });
});

router.get("/logout", (req, res, next) => {
    req.logout();
    res.json({ message: "logout" });
});

module.exports = router;
