function passwordToggle(e) {
    let x = e.target.previousElementSibling;
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
    if (x.type !== "password") {
        e.target.src = "../asset/img/login/eye.png";
    } else {
        e.target.src = "../asset/img/login/eyeslash.png";
    }
    console.log(e.target);
    console.log(x);
}

let $togglePass = document.querySelector("#togglePass");
let $togglePass_Sign = document.querySelector("#togglePass_Sign");
let $togglePass_Sign_Check = document.querySelector("#togglePass_Sign_Check");

$togglePass.addEventListener("click", passwordToggle);
$togglePass_Sign.addEventListener("click", passwordToggle);
$togglePass_Sign_Check.addEventListener("click", passwordToggle);
