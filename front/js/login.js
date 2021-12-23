// ---------------import -------------------------
import { getUserId, generateLogout, preventAccess } from "./util.js";

let userId = null;
window.addEventListener("DOMContentLoaded", async () => {
    userId = await getUserId();
    generateLogout(userId);
    preventAccess(!userId);
});

// signin
const signin_email = document.forms["signin"].querySelector('[name="email"]');
const signin_password = document.forms["signin"].querySelector('[name = "password"]');
const serverUrl = "http://elice-kdt-sw-1st-vm10.koreacentral.cloudapp.azure.com";
// signup
const signup_email = document.forms["signup"].querySelector('[name="email"]');
const signup_email_check = document.forms["signup"].querySelector("#error-email-check");
const signup_password = document.forms["signup"].querySelector('[name = "password"]');
const signup_password_error = document.forms["signup"].querySelector("#error-password");
const signup_password_check = document.forms["signup"].querySelector("#error-password-check");
const signup_nickname = document.forms["signup"].querySelector('[name="nickname"]');
const signup_passwordConfirm = document.querySelector('[name="password_confirm"]');

// toglepassword
const $togglePass = document.querySelector("#togglePass");
const $togglePass_Sign = document.querySelector("#togglePass_Sign");
const $togglePass_Sign_Check = document.querySelector("#togglePass_Sign_Check");

// const login_form = document.querySelector(".login-form");
// console.log($(".login-form").css("min-height"));

// password 가림
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

function Signup_passwordToggle(e) {
    let x = e.target.previousElementSibling.previousElementSibling;
    if (x.type === "password") {
        x.type = "text";
        e.target.src = "../asset/img/login/eye.png";
    } else {
        x.type = "password";
        e.target.src = "../asset/img/login/eyeslash.png";
    }
}

// 로그인 유효성검사
function SignInCheck() {
    if (!signin_email.value) {
        swal({
            title: "로그인 실패",
            text: "이메일을 입력해 주세요.",
            icon: "warning",
        });
        return false;
    }
    if (!signin_password.value) {
        swal({
            title: "로그인 실패",
            text: "비밀번호를 입력해 주세요.",
            icon: "warning",
        });
        return false;
    }
    return true;
}

// 회원가입 유효성검사
function SignUpCheck() {
    if (!signup_nickname.value) {
        swal({
            title: "회원가입 실패",
            text: "닉네임을 입력해주세요.",
            icon: "warning",
        });
        return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(signup_email.value)) {
        swal({
            title: "회원가입 실패",
            text: "이메일 형식이 올바르지 않습니다.",
            icon: "warning",
        });
        return false;
    }
    if (signup_password.value.length < 8) {
        swal({
            title: "회원가입 실패",
            text: "최소 8자리 이상의 비밀번호를 설정해 주세요.",
            icon: "warning",
        });
        return false;
    }
    if (signup_password.value != signup_passwordConfirm.value) {
        swal({
            title: "회원가입 실패",
            text: "비밀번호 확인이 일치하지 않습니다.",
            icon: "warning",
        });
        return false;
    }
    return true;
}

// 로그인정보 post
document.getElementById("user-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = signin_email.value;
    const password = signin_password.value;
    if (SignInCheck() === true) {
        try {
            await axios.post("/api/user/login", {
                email,
                password,
            });
            swal({
                title: "로그인 성공",
                text: "Welcome to the Metabook",
                icon: "success",
            });
            location.href = "/index.html";
        } catch (err) {
            swal({
                title: "로그인 실패",
                text: "이메일, 비밀번호를 확인해주세요.",
                icon: "warning",
            });
            console.log(err);
        }
    }
});

//회원가입정보 post
document.getElementById("signup-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = signup_email.value;
    const password = signup_password.value;
    const name = signup_nickname.value;
    if (SignUpCheck() === true) {
        const email = document.forms["signup"].querySelector('[name="email"]').value;
        const password = document.forms["signup"].querySelector('[name = "password"]').value;
        const name = document.forms["signup"].querySelector('[name="nickname"]').value;
        try {
            await axios.post("/api/user/join", {
                email,
                name,
                password,
            });
            swal({
                title: "회원가입 성공",
                text: "Welcome to the Metabook",
                icon: "success",
            });
            location.href = "./login.html";
        } catch (err) {
            swal({
                title: "회원가입 실패",
                text: "이미 존재하는 이메일입니다.",
                icon: "warning",
            });
            console.log(err);
        }
    }
});

signup_email.addEventListener("input", (e) => {
    signup_email_check.innerHTML = "";
    if (!/^\S+@\S+\.\S+$/.test(e.target.value)) {
        signup_email_check.innerHTML = "이메일 형식이 올바르지 않습니다.";
        signup_email_check.style.color = "red";
    }
});

signup_password.addEventListener("input", (e) => {
    signup_password_error.innerHTML = "";
    if (signup_password.value.length < 8) {
        signup_password_error.innerHTML = "최소 8자리 이상의 비밀번호를 설정해 주세요";
        signup_password_error.style.color = "red";
    }
});

signup_passwordConfirm.addEventListener("input", (e) => {
    if (signup_password.value != e.target.value) {
        signup_password_check.innerHTML = "비밀번호 확인이 일치하지 않습니다.";
        signup_password_check.style.color = "red";
    } else {
        signup_password_check.innerHTML = "";
    }
});

$togglePass.addEventListener("click", passwordToggle);
$togglePass_Sign.addEventListener("click", Signup_passwordToggle);
$togglePass_Sign_Check.addEventListener("click", Signup_passwordToggle);
