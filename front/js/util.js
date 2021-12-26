//--------------- userId 얻기 --------------------
export async function getUserId() {
    try {
        const res = await axios.get("/api/user");
        if (res.data.ok) {
            return res.data.userId;
        }
        return null;
    } catch (err) {
        // alert("유저 불러오기 오류");
        return null;
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
    const location = window.location.href.split("/");
    if (!user && location[location.length - 1] === "write.html") {
        alert("로그인이 필요합니다.");
        // 로컬에서는 실행 X
        // 서버에서는 실행 O
        window.location.href = "/index.html";
    } else if (user && location[location.length - 1] === "login.html") {
        alert("이미 로그인 하였습니다.");
        window.location.href = "/index.html";
    }
}
