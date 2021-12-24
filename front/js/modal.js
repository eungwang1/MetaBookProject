// ---------------import -------------------------
import { getUserId, generateLogout, preventAction } from "./util.js";
import { render, paginate, paging } from "./index.js";

let userId = null;

window.addEventListener("DOMContentLoaded", async () => {
    userId = await getUserId();
    generateLogout(userId);
    await render(1);
    await paging(1);
    const figure = document.querySelectorAll("figure");
    figure.forEach((el) =>
        el.addEventListener("click", async (e) => {
            const objectId = e.target.parentNode.dataset.objectid;
            const res = await axios.get(
                `http://elice-kdt-sw-1st-vm10.koreacentral.cloudapp.azure.com/api/page/detail/${objectId}`
            );
            console.log(res.data);

            const {
                author,
                content,
                title,
                thumbnailUrl,
                metaUrl,
                likeCount,
                likes,
            } = res.data.post;
            console.log(likes.includes("61c35dfce7e0d57cfd1a7cb1"));
            modal(
                metaUrl,
                title,
                content,
                thumbnailUrl,
                author,
                objectId,
                likeCount,
                likes
            );
            $("html, body").addClass("not_scroll");
            preventAction(userId);
            //true : 로그인 false : 로그아웃 !
        })
    );
});

function heartPost(objectId, likes) {
    const heart = document.querySelector(".sprite_heart_icon_outline");
    const like_text = document.getElementById("like-count-39");
    console.log(like_text.innerText);
    heart.addEventListener("click", async () => {
        console.log(objectId);
        await axios.put(
            `http://elice-kdt-sw-1st-vm10.koreacentral.cloudapp.azure.com/api/post/${objectId}/like`
        );
        const res = await axios.get(
            `http://elice-kdt-sw-1st-vm10.koreacentral.cloudapp.azure.com/api/page/detail/${objectId}`
        );
        like_text.innerText = res.data.post.likeCount;
    });
}

// 좋아요 토글 함수
function heartToggle(likes) {
    let heart_boolean = true;
    const heart = document.querySelector(".sprite_heart_icon_outline");
    if (likes.includes(userId)) {
        heart.style.backgroundPosition = "-26px -261px";
        heart_boolean = false;
    }

    heart.addEventListener("click", () => {
        if (userId) return;
        if (heart_boolean == true) {
            // 빨간하트
            heart.style.backgroundPosition = "-26px -261px";
            heart_boolean = false;
            // 좋아요 +1
        } else {
            // 빈하트
            heart.style.backgroundPosition = "-52px -261px";
            heart_boolean = true;
            // 좋아요 -1
        }
    });
}

// 댓글 HTML
function commentHtml(data, commentId) {
    const comment_text = document.querySelector(".comment_text");
    const comment = comment_text.value;
    const check = data.author._id === userId;
    if (check) {
        return `
        <div class="comment-detail">
            <div class="comment-nickname">${data.author.name}</div>
            <div class="comment-text">${data.content}</div>
            <button class="comment_delete" data-id = ${commentId} >x</button>
        </div>`;
    }
    return `
        <div class="comment-detail">
            <div class="comment-nickname">${data.author.name}</div>
            <div class="comment-text">${data.content}</div>
            <button class="comment_delete" style="display: none;">x</button>
        </div>`;
}

// 모달 HTML
function modalHtml(metaUrl, title, content, thumbnailUrl, author, likeCount) {
    return `<div class="modal">
                <div class="dimmed"></div>

                <article class="contents">
                    <header class="top">
                        <div class="user_container">
                            
                            <div class="user_name">
                                <div class="nick_name">${author.name}</div>
                                <div id='arrow-box'></div>
                            </div>
                            <div class="gather_link">
                                <button class="write-submit" onclick = "window.open('${metaUrl}')">입장하기</button>
                            </div>
                            <div class="modal_exit">
                                <div class="modal_exit_button" >x</div>
                            </div>
                        </div>
                    </header>

                    <div class="img_section">
                        <div class="trans_inner">
                            <div><img src="http://elice-kdt-sw-1st-vm10.koreacentral.cloudapp.azure.com/api/images/${thumbnailUrl}"; /></div>
                        </div>
                    </div>

                    <div class = 'scroll_container' id= 'style-1'>  
                        <div class="bottom_icons">
                            <h3 class="maintitle">${title}</h3>
                            <div class="left_icons">
                                <div class="heart_btn">
                                    <div class="sprite_heart_icon_outline" name="39" data-name="heartbeat"></div>
                                </div>
                                
                                <div class="likes m_text">
                                    <span id="like-count-39">${likeCount}</span>
                                </div>
                            </div>
                        </div>
                        <div class="maintext">
                            ${content}
                        </div>
                        <div class = "comment_box">
                        </div>
                    </div>
                    <div class="comment_field" id="add-comment-post37">
                        <input type="text" placeholder="comment" class="comment_text" />
                        <button id="commentUpload" class="upload_btn m_text" data-name="comment">댓글등록</button>
                    </div>
                </article>
                
            </div>`;
}

function commentRender_supporter(objectId) {
    axios
        .get(
            `http://elice-kdt-sw-1st-vm10.koreacentral.cloudapp.azure.com/api/comment/${objectId}`
        )
        .then((res) => {
            res.data.forEach((data, idx) => {
                const { _id } = data;
                const commentId = _id;
                $(".comment_box").append(commentHtml(data, commentId));
                // const deleteBtn = document.querySelector(".comment_delete");
                const comment_box = document.querySelector(".comment_box");
                const deleteBtn =
                    document.getElementsByClassName("comment_delete")[idx];
                document
                    .getElementsByClassName("comment_delete")
                    [idx].addEventListener("click", (e) => {
                        const comment_delete_data = {
                            postId: objectId,
                            commentId: commentId,
                        };
                        console.log(comment_delete_data);
                        axios
                            .delete(
                                `http://elice-kdt-sw-1st-vm10.koreacentral.cloudapp.azure.com/api/comment`,

                                {
                                    data: comment_delete_data,
                                }
                            )
                            .then((res) => {
                                while (comment_box.hasChildNodes()) {
                                    comment_box.removeChild(
                                        comment_box.firstChild
                                    );
                                }
                                commentRender_supporter(objectId);
                            });
                    });
            });
        });
}

// 댓글삭제 이벤트 생성 함수
function commentRender(objectId) {
    axios
        .get(
            `http://elice-kdt-sw-1st-vm10.koreacentral.cloudapp.azure.com/api/comment/${objectId}`
        )
        .then((res) => {
            res.data.forEach((data, idx) => {
                const { _id } = data;
                const commentId = _id;
                $(".comment_box").append(commentHtml(data, commentId));
                // const deleteBtn = document.querySelector(".comment_delete");
                const comment_box = document.querySelector(".comment_box");
                const deleteBtn =
                    document.getElementsByClassName("comment_delete")[idx];
                document
                    .getElementsByClassName("comment_delete")
                    [idx].addEventListener("click", (e) => {
                        const comment_delete_data = {
                            postId: objectId,
                            commentId: commentId,
                        };
                        console.log(comment_delete_data);
                        axios
                            .delete(
                                `http://elice-kdt-sw-1st-vm10.koreacentral.cloudapp.azure.com/api/comment`,

                                {
                                    data: comment_delete_data,
                                }
                            )
                            .then((res) => {
                                while (comment_box.hasChildNodes()) {
                                    comment_box.removeChild(
                                        comment_box.firstChild
                                    );
                                }
                                commentRender_supporter(objectId);
                            });
                        // 기존 댓글 삭제 및 다시 불러오기.
                    });
            });
        });
}

// 모달창이 켜졌을 때 실행되는 함수
function modal(
    metaUrl,
    title,
    content,
    thumbnailUrl,
    author,
    objectId,
    likeCount,
    likes
) {
    $("#modal-select").append(
        modalHtml(metaUrl, title, content, thumbnailUrl, author, likeCount)
    );
    const comment_box = document.querySelector(".comment_box");
    heartToggle(likes);
    closeModal();
    commentPost(author, objectId);
    console.log(objectId);
    // commentRendering(comment_box, objectId, commentId);
    commentRender(objectId);
    heartPost(objectId, likes);
    addAmendBtn(userId, author._id, objectId);
}

// 모달창 닫기 이벤트 생성
function closeModal() {
    const modal_exit = document.querySelector(".modal_exit_button");
    const dimmed_exit = document.querySelector(".dimmed");
    modal_exit.addEventListener("click", () => {
        document.querySelector(".modal").remove();
        $("html, body").removeClass("not_scroll");
    });
    dimmed_exit.addEventListener("click", () => {
        document.querySelector(".modal").remove();
        $("html, body").removeClass("not_scroll");
    });
}

// 댓글 쓰기 이벤트 생성
function commentPost(author, objectId, commentId) {
    const commentUpload = document.querySelector("#commentUpload");
    const comment_text = document.querySelector(".comment_text");
    console.log(commentId);

    commentUpload.addEventListener("click", async () => {
        const comment = comment_text.value;
        const comment_box = document.querySelector(".comment_box");
        if (comment_text.value.length > 1) {
            const CommentData = {
                content: comment,
            };
            await axios.post(
                `http://elice-kdt-sw-1st-vm10.koreacentral.cloudapp.azure.com/api/comment/${objectId}`,
                CommentData
            );
            while (comment_box.hasChildNodes()) {
                comment_box.removeChild(comment_box.firstChild);
            }
            commentRender_supporter(objectId);
        } else {
            swal({
                title: "다시 입력해주세요.",
                text: "최소 2글자 이상 입력해주세요",
                icon: "warning",
            });
        }
        comment_text.value = "";
    });
}

function addAmendBtn(user, author, objectId) {
    if (author !== user) return;
    const target = document.querySelector(".user_name");
    const arrow = document.querySelector("#arrow-box");
    const extra = document.createElement("div");
    const dropWrap = document.createElement("ul");
    const menu = document.createElement("li");
    const amend = document.createElement("a");
    extra.classList.add("extra");
    amend.textContent = "수정하기";
    amend.href = `/views/write.html?${objectId}`;
    menu.appendChild(amend);
    dropWrap.appendChild(menu);
    target.appendChild(dropWrap);
    arrow.appendChild(extra);
    arrow.addEventListener("click", () => {
        arrow.classList.toggle("toggle");
    });
}
