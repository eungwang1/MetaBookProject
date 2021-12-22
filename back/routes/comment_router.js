const express = require("express");
const router = express.Router();
const { Post, User } = require("../models/index");

router.get(
    "/:postid/comments", async function(req, res){
        const { _id } = req.params;
        try{
            const post = await Post.findOne({ _id });
            // post.comments 의 작성자 populate 하기
            await User.populate(post.comments, { path: "author" });
            // json 으로 응답 보내기
            res.json(post.comments,{ok: true, message:"댓글 찾기 성공!"});
        }catch(err){
            res.json({ ok: false, message: "댓글 찾기 실패" });
        }

    })
);

router.post(
    "/posts/:shortId/comments",
    asyncHandler(async (req, res) => {
        const { shortId } = req.params;
        const { content } = req.body;
        const author = await User.findOne({ shortId: req.user.shortId });

        // $push operator 사용하여 댓글 추가하기
        await Post.updateOne(
            {
                shortId,
            },
            {
                $push: { comments: { content, author } },
            }
        );

        res.json({ result: "success" });
    })
);

module.exports = router;
