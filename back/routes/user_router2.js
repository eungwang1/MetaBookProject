const express = require("express");
const router = express.Router();
const User = require("../models/User");

//create
router.post("/", async function (req, res) {
    const user = new User(req.body);
    try {
        const result = await user.save();
        res.json({ ok: true, message: "생성 완료!" });
    } catch (err) {
        res.json({ ok: false, message: "생성 실패" });
    }
});

//search
router.get("/:email", async function (req, res) {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (user.length == 0)
            return res.status(404).json({
                error: "해당 유저가 존재하지 않습니다.",
            });
        res.json(user);
    } catch (err) {
        res.json({ ok: false, message: "검색 실패" });
    }
});

//update
router.put("/:email", async function (req, res) {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (!user) {
            return res.json({ ok: false, message: "수정 실패" });
        }
        const result = await User.updateOne(
            { email: req.params.email },
            { $set: req.body }
        );
        res.json({ ok: true, message: "수정 완료" });
    } catch (err) {
        res.json({ ok: false, message: "수정 실패" });
    }
});

//delete
router.delete("/", function (req, res) {
    User.remove({ email: req.body.email }, function (err, output) {
        if (err) return res.status(500).json({ error: "Database Failure!" });

        res.json({ message: "삭제 완료" });

        res.status(204).end();
    });
});

module.exports = router;
