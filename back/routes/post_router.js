const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

//create
router.post("/", async function (req, res) {
    const post = new Post(req.body);
    try {
        const result = await post.save();
        res.json({ ok: true, message: "생성 완료!" });
    } catch (err) {
        res.json({ ok: false, message: "생성 실패" });
    }
});

//list

//view

//search
router.get("/:title", async function (req, res) {
    try {
        const post = await Post.find({ title: req.params.title });
        if (post.length == 0)
            return res.status(404).json({
                error: "해당 제목을 가진 글이 존재하지 않습니다.",
            });
        res.json(post);
    } catch (err) {
        res.json({ ok: false, message: "검색 실패" });
    }
});

//update
router.put("/:postId", async function (req, res) {
    try {
        const post = await Post.findOne({ _id: req.params.postId }).populate(
            "author"
        );
        if (!post) {
            return res.json({ ok: false, message: "수정 실패" });
        }
        if (req.body.userId !== post.author._id) {
            return res.json({ ok: false, message: "수정 실패" });
        }
        //$set =>정보가 없는걸 빈칸으로 하지않고 바뀐 내용만 저장하는것!
        const result = await Post.updateOne(
            { _id: req.params.postId },
            { $set: req.body }
        );
        res.json({ ok: true, message: "수정 완료" });
    } catch (err) {
        res.json({ ok: false, message: "수정 실패" });
    }
});

//delete
router.delete("/:id", async function (req, res) {
    try {
        const post = await Post.deleteOne({ _id: req.params.id });
        res.json({ ok: true, message: "삭제 완료" });
    } catch (err) {
        res.json({ ok: false, message: "삭제 실패" });
    }
});

module.exports = router;
