const express = require("express");
const router = express.Router();
const { Post } = require("../models/index");
const multer = require("multer");

//view
router.get("/:num", async function (req, res) {
    const page = Number(req.params.num || 1);
    // 기본값 1
    const perPage = 16;
    try {
        const [total, posts, top3Post] = await Promise.all([
            Post.countDocuments({}),
            Post.find({})
                .sort({ createdAt: -1 })
                .skip(perPage * (page - 1))
                .limit(perPage)
                .populate("author", "name"),
            Post.find({}).sort({ likeCount: -1 }).limit(3).populate("author"),
        ]);
        // total, posts 를 Promise.all 을 사용해 동시에 호출하기

        const totalPage = Math.ceil(total / perPage);

        res.json({
            ok: true,
            message: "페이지 불러오기 성공!",
            posts,
            page,
            perPage,
            totalPage,
            top3Post,
        });
    } catch (err) {
        res.json({ ok: false, message: "페이지 불러오기 실패", err });
    }
});

//detail
router.get("/detail/:postId", async (req, res) => {
    const postId = req.params.postId;
    try {
        const post = await Post.findOne({ _id: postId }).populate(
            "author",
            "name"
        );

        if (!post)
            return res.status(404).json({
                error: "해당 글이 존재하지 않습니다.",
                ok: false,
            });
        res.json({ ok: true, post });
    } catch (err) {
        res.json({ ok: false, message: "실패", err });
    }
});

module.exports = router;
