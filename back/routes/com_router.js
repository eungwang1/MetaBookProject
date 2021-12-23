const express = require("express");
const router = express.Router();
const { Post, User } = require("../models");

// middlewares
const loginRequired = require("../middlewares/login-required");

router.post("/:postId", loginRequired, async (req, res) => {
    const { postId } = req.params;
    const { content } = req.body;
    const author = req.user.id;

    try {
        await Post.updateOne(
            {
                _id: postId,
            },
            {
                $push: { comments: { content, author } },
            }
        );
        res.json({ ok: true, message: "댓글 추가 성공", postId, author });
    } catch (err) {
        res.json({ ok: false, message: "댓글 추가 실패", err });
    }
});

router.get("/:postId", async (req, res) => {
    const { postId } = req.params;
    const post = await Post.findOne({ _id: postId });
    try {
        await User.populate(post.comments, { path: "author", select: "name" });
        res.json(post.comments);
    } catch (err) {
        res.json({ ok: false, message: "댓글 읽기 실패", err });
    }
});

module.exports = router;
