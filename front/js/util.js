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
                window.location.href = "../index.html";
            }
        });
    }
}

//--------------- 리다이렉션 --------------------
export function preventAction(user) {
    if (!user) {
        alert("로그인이 필요합니다.");
        window.location.href = "../index.html";
    }
}
