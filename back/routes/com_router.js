const express = require("express");
const router = express.Router();
const { Post, User } = require("../models");

router.post("/:postId", async (req, res) => {
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
        res.json({ ok: true, message: "댓글 성공", postId, author });
    } catch (err) {
        res.json({ ok: false, message: "댓글 실패", err });
    }
});

router.get("/:postId", async (req, res) => {
    const { postId } = req.params;
    const post = await Post.findOne({ postId });

    await User.populate(post.comments, { path: "author", select: "name" });
    res.json(post.comments);
});

module.exports = router;
