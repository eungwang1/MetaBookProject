// --------------------nodes---------------------------
const inputFile = document.querySelector("#upload-file");
const filename = document.querySelector("#write-form .display_box span");
const thumb_img = document.querySelector(".display_box .display_thumb");
const postSubmitForm = document.querySelector("#write-form");
const $title = postSubmitForm.querySelector("#post_title");
const $content = postSubmitForm.querySelector("#post_content");
const $link = postSubmitForm.querySelector("#post_link");
const postId = window.location.href.split("?")[1];

const dummy = {
    title: "제목",
    content: "내용입니다",
    metaUrl: "hello",
    thumbnailUrl: "http://localhost:5500/front/asset/img/logo.png",
};

//------- 수정 화면 렌더 ----------
window.addEventListener("DOMContentLoaded", () => {
    if (postId) {
        // console.log(window.location.href.split("?")[1]);
        getPostContent(postId);
    }
});

async function getPostContent(postId) {
    try {
        // const post = await axios.get(`/${postId}`);
        const post = dummy;
        $title.value = post.title;
        $content.value = post.content;
        $link.value = post.metaUrl;
        thumb_img.src = post.thumbnailUrl;
        thumb_img.classList.add("show");
        filename.textContent = "";
    } catch (err) {
        alert(err);
    }
}

//-------파일 업로드 커스텀---------

let cur_file;
inputFile.addEventListener("change", (e) => {
    cur_file = e.target.files[0];
    showFile(cur_file);
});

function showFile(file) {
    // console.log(URL.createObjectURL(file));
    thumb_img.classList.add("show");
    thumb_img.src = URL.createObjectURL(file);
    filename.textContent = file.name;
}

//--------------- submit 이벤트 --------------------

postSubmitForm.addEventListener("submit", (e) => {
    e.preventDefault();
    requestUploadPost(cur_file, postId ? postId : null);
});

async function requestUploadPost(file, postId) {
    const regex =
        /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    const textData = {
        title: $title.value,
        content: $content.value,
        metaUrl: $link.value,
    };
    // title 채우기 경고
    if (textData.title === "") return alert("제목을 입력해주세요");
    // Url 유효성 검사, 해당 url gather 포함 여부 검사
    if (
        $link.value &&
        (!textData.metaUrl.includes("gather") || !regex.test(textData.metaUrl))
    )
        return alert("올바른 url을 입력해 주세요");
    if (file) {
        const data = new FormData();
        data.append("file", file);
        data.append("name", file.name);
        try {
            // await axios.post("/", data);
        } catch (err) {
            return alert("사진 업로드 중 오류가 발생했습니다.");
        }
    }
    try {
        console.log(textData);
        if (postId) {
            const res = await axios.put("/", textData);
        } else {
            const res = await axios.post("/", textData);
        }
        // if (res.data.ok) {
        //     window.location.href = "";
        // }
        // window.location.href = "http://localhost:5500/front/index.html";
    } catch (err) {
        return alert("포스트 업로드 중 오류가 발생했습니다.");
    }
}
