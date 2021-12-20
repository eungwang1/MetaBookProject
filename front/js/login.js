function passwordToggle(e) {
    let x = e.target.previousElementSibling;
    if (x.type === "password") {
        x.type = "text";
        e.target.src = "../asset/img/login/eye.png";
    } else {
        x.type = "password";
        e.target.src = "../asset/img/login/eyeslash.png";
    }
}

function SignInCheck() {
    const email =
        document.forms["signin"].querySelector('[name="email"]').value;
    if (!email) {
        alert("이메일을 입력 해 주세요");
        return false;
    }
    const password = document.forms["signin"].querySelector(
        '[name = "password"]'
    ).value;
    if (!password) {
        alert("비밀번호를 입력 해 주세요");
        return false;
    }
    return true;
}

function SignUpCheck() {
    const email =
        document.forms["signup"].querySelector('[name="email"]').value;
    const password = document.forms["signup"].querySelector(
        '[name = "password"]'
    ).value;
    const nickname =
        document.forms["signup"].querySelector('[name="nickname"]').value;
    const passwordConfirm = document.querySelector(
        '[name="password_confirm"]'
    ).value;
    if (!nickname) {
        alert("닉네임을 입력해주세요.");
        return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
        alert("이메일 형식이 올바르지 않습니다.");
        return false;
    }
    if (password.length < 8) {
        alert("최소 8자리 이상의 비밀번호를 설정 해 주세요");
        return false;
    }
    if (password != passwordConfirm) {
        alert("비밀번호 확인이 일치하지 않습니다");
        return false;
    }
    return true;
}

document.getElementById("user-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    if (SignInCheck() === true) {
        const email =
            document.forms["signin"].querySelector('[name="email"]').value;
        const password = document.forms["signin"].querySelector(
            '[name = "password"]'
        ).value;
        try {
            await axios.post("/auth", { email, password });
            alert("로그인 성공");
            location.href = "/posts";
        } catch (err) {
            alert("로그인 실패");
            console.log(err);
        }
    }
});

document.getElementById("signup-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    if (SignUpCheck() === true) {
        const email =
            document.forms["signup"].querySelector('[name="email"]').value;
        const password = document.forms["signup"].querySelector(
            '[name = "password"]'
        ).value;
        const nickname =
            document.forms["signup"].querySelector('[name="nickname"]').value;
        try {
            await axios.post("/join", { email, password, nickname });
            alert("회원가입 완료");
            location.href = "/login";
        } catch (err) {
            alert("회원가입 실패");
            console.log(err);
        }
    }
});

let $togglePass = document.querySelector("#togglePass");
let $togglePass_Sign = document.querySelector("#togglePass_Sign");
let $togglePass_Sign_Check = document.querySelector("#togglePass_Sign_Check");

$togglePass.addEventListener("click", passwordToggle);
$togglePass_Sign.addEventListener("click", passwordToggle);
$togglePass_Sign_Check.addEventListener("click", passwordToggle);
