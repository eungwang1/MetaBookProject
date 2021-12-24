//--------------- userId 얻기 --------------------
export async function getUserId() {
    try {
        const res = await axios.get("/api/user");
        // console.log(res);
        if (res.data.ok) {
            console.log(res);
            return res.data.userId;
        }
        return null;
    } catch (err) {
        alert("오류");
    }
}

//--------------- 로그아웃 변환 & 액션 --------------------
export function generateLogout(user) {
    if (user) {
        const loginBtn = document.querySelector(".default-menu a");
        loginBtn.textContent = "로그아웃";
        loginBtn.href = "#";
        loginBtn.addEventListener("click", async () => {
            const res = await axios.get("/api/user/logout");
            if (res.status === 200) {
                alert("로그아웃 되었습니다.");
                window.location.href = "/index.html";
            }
        });
    }
}

//--------------- 리다이렉션 --------------------
export function preventAccess(user) {
    if (!user) {
        alert("로그인이 필요합니다.");
        // 로컬에서는 실행 X
        // 서버에서는 실행 O
        window.location.href = "/index.html";
    }
}

export function preventAction(user) {
    const commentUpload = document.querySelector("#commentUpload");
    const comment_text = document.querySelector(".comment_text");
    if (!user) {
        commentUpload.classList.add("not_allow");
        commentUpload.disabled = true;
        commentUpload.style.cursor = "not-allowed";
        comment_text.disabled = true;
        comment_text.style.cursor = "not-allowed";
        comment_text.placeholder = "로그인 후 이용해주세요";
    }
}
