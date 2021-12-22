module.exports = (req, res, next) => {
    // 로그인이 안되어있다면 메인화면으로
    if (!req.user) {
        res.redirect("/");
        return;
    }

    // 로그인이 되어있다면 다음 미들웨어로
    next();
};
