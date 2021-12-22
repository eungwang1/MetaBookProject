const express = require("express");
const router = express.Router();
const hashPassword = require("../utils/hash-password");
const { User } = require("../models");
const passport = require("passport");

router.get("/", (req, res) => {
    if (req.user) {
        console.log(req.user);
        return res.json({});
    }
    console.log("로그인되어 있지 않습니다.");
    return res.json({});
});

router.post("/login", passport.authenticate("local"), (req, res, next) => {
    res.json({ ok: true });
});

router.post("/join", (req, res) => {
    const user = new User(req.body);
    user.password = hashPassword(user.password);
    user.save((err, userInfo) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true,
        });
    });
});

router.get("/logout", (req, res, next) => {
    req.logout();
    res.json({});
});

module.exports = router;
