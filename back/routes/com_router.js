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
            { _id: req.params.postId },
            { $push: { comments: { content, author } } }
        );
        res.json({ ok: true, message: "댓글 추가 성공", postId, author });
    } catch (err) {
        console.log(err);
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

router.delete("/", loginRequired, async (req, res) => {
    const { postId, commentId } = req.body;
    const post = await Post.findOne({ _id: postId });
    const commentCheck = await post.comments.some(
        (com) => com._id == commentId
    );
    const author = req.user.id;

    try {
        if (commentCheck) {
            const index = post.comments.findIndex((item) => {
                return item._id == commentId;
            });
            if (author == post.comments[index].author) {
                post.comments.splice(index, 1);
                await Post.updateOne(
                    { _id: postId },
                    { comments: post.comments }
                );
                res.json({ ok: true, message: "삭제 성공" });
            } else {
                res.json({ ok: false, message: "댓글의 작성자가 아닙니다." });
            }
        } else {
            res.json({ ok: false, message: "삭제 실패" });
        }
    } catch (err) {
        res.json({ ok: false, message: "삭제 실패", err });
    }
});
module.exports = router;
