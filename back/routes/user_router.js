module.exports = function (app, User) {
    //list 아직 구현 못했어요!
    app.get("/user", (req, res) => {
        req.list();
    });

    //create
    app.post("/user_info", function (req, res) {
        const user = new User(req.body);
        // user.name = req.body.name;
        // user.email = req.body.email;
        // user.introduce = req.body.introduce;
        // user.metaUrl = req.body.metaUrl;
        // user.metaThumbUrl = req.body.metaThumbUrl;
        // user.password = req.body.password;
        // user.profileImg = req.body.profileImg;

        user.save(function (err) {
            if (err) {
                console.error(err);
                res.json({ message: "생성 실패" });
                return;
            }
            res.json({ message: "생성 완료!" });
        });
    });

    //search
    app.get("/user/:email", function (req, res) {
        User.findOne({ email: req.params.email }, function (err, user) {
            if (err) return res.status(500).json({ error: err });
            if (!user)
                return res
                    .status(404)
                    .json({ error: "해당 이메일이 존재하지 않습니다." });
            res.json(user);
        });
    });

    //update
    app.put("/user/:email", function (req, res) {
        User.findOne({ email: req.params.email }, function (err, user) {
            if (err)
                return res.status(500).json({ error: "Database Failure!" });
            if (!user)
                return res
                    .status(404)
                    .json({ error: "해당 아이디가 존재하지 않습니다." });

            user.name = req.body.name;
            user.introduce = req.body.introduce;
            user.metaUrl = req.body.metaUrl;
            user.metaThumbUrl = req.body.metaThumbUrl;
            user.password = req.body.password;
            user.profileImg = req.body.profileImg;

            user.save(function (err) {
                if (err) res.status(500).json({ error: "Failed to update!" });
                res.json({ message: "수정이 완료되었습니다!" });
            });
        });
    });

    //delete
    app.delete("/user", function (req, res) {
        User.remove({ email: req.body.email }, function (err, output) {
            if (err)
                return res.status(500).json({ error: "Database Failure!" });

            res.json({ message: "삭제 완료" });

            res.status(204).end();
        });
    });
};
