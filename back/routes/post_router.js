const express = require("express");
const router = express.Router();
const { Post } = require("../models/index");
const multer = require("multer");

//create
router.post("/", async function (req, res) {
    req.body.author = req.user.id;
    const post = new Post(req.body);
    try {
        const result = await post.save();
        res.json({ ok: true, message: "생성 완료!" });
    } catch (err) {
        res.json({ ok: false, message: "생성 실패" });
    }
});

//search
router.get("/:title", async function (req, res) {
    try {
        const post = await Post.find({ title: req.params.title });
        if (post.length == 0)
            return res.status(404).json({
                error: "해당 제목을 가진 글이 존재하지 않습니다.",
                ok: false,
            });
        res.json({ ok: true, post });
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
            return res.json({ ok: false, message: "수정 실패1" });
        }
        if (req.body.userId !== post.author._id) {
            return res.json({ ok: false, message: "수정 실패2" });
        }
        //$set =>정보가 없는걸 빈칸으로 하지않고 바뀐 내용만 저장하는것!
        const result = await Post.updateOne(
            { _id: req.params.postId },
            { $set: req.body }
        );
        res.json({ ok: true, message: "수정 완료" });
    } catch (err) {
        console.log(err);
        res.json({ ok: false, message: "수정 실패3" });
    }
});

//delete
router.delete("/:postId", async function (req, res) {
    try {
        const post = await Post.deleteOne({ _id: req.params.id });
        res.json({ ok: true, message: "삭제 완료" });
    } catch (err) {
        res.json({ ok: false, message: "삭제 실패" });
    }
});

//like
router.put("/:id/like", async (req, res) => {
    console.log("1");
    try {
        console.log("2");
        const post = await Post.findById(req.params.id);
        console.log(post);

        if (!post.likes.includes(req.body.userId)) {
            await post.uadateOne({ $push: { likes: req.body.userId } });
            res.status(200).json("The post has been liked");
        } else {
            await post.updateOne({ $pull: { likes: req.body.userId } });
            res.status(200).json("The post has been disliked");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
