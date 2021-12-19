const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
passport.use(
    "local-login",
    new LocalStrategy(
        {
            usernameField: "userId",
            passwordField: "password",
            passReqToCallback: true,
        },
        (req, userId, password, done) => {
            console.log("passport의 local-login : ", userId, password);

            if (userId != "test" || password != "12345") {
                console.log("비밀번호 불일치!");
                return done(
                    null,
                    false,
                    req.flash("loginMessage", "비밀번호 불일치!")
                );
            }

            console.log("비밀번호 일치!");
            return done(null, {
                userId: userId,
                password: password,
            });
        }
    )
);
