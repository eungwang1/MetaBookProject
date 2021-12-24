// ---------------import -------------------------
import { getUserId, generateLogout, preventAction } from "./util.js";

let userId = null;
window.addEventListener("DOMContentLoaded", async () => {
    userId = await getUserId();
    generateLogout(userId);
});

const figure = document.querySelectorAll("figure");

function heartToggle() {
    const heart = document.querySelector(".sprite_heart_icon_outline");
    let heart_boolean = true;
    heart.addEventListener("click", () => {
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

function commentHtml(data, commentId) {
    const comment_text = document.querySelector(".comment_text");
    const comment = comment_text.value;
    return `
    <div class="comment-detail">
        <div class="comment-nickname">${data.author.name}</div>
        <div class="comment-text">${data.content}</div>
        <button data-name="comment_delete" class="comment_delete" data-id = ${commentId}>x</button>
        </div>`;
}

function commentPost(author, objectId, commentId) {
    const commentUpload = document.querySelector("#commentUpload");
    const comment_text = document.querySelector(".comment_text");

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

            const res = await axios.get(
                `http://elice-kdt-sw-1st-vm10.koreacentral.cloudapp.azure.com/api/comment/${objectId}`
            );

            while (comment_box.hasChildNodes()) {
                comment_box.removeChild(comment_box.firstChild);
            }
            res.data.forEach((data) => {
                $(".comment_box").append(commentHtml(data, commentId));
            });
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

function modalHtml(metaUrl, title, content, thumbnailUrl, author) {
    return `<div class="modal">
            <div class="dimmed"></div>

                <article class="contents">
            <header class="top">
                <div class="user_container">
                    <div class="profile_img">
                        <img src="./asset/img/thumb.jpeg" alt="프로필이미지" />
                    </div>
                    <div class="user_name">
                        <div class="nick_name m_text">${author.name}</div>
                    </div>
                    <div class="gather_link">
                        <button type="submit" class="write-submit" onclick = "window.open('${metaUrl}')">입장하기</button>
                    </div>
                    <div class="modal_exit">
                        <div class="modal_exit_button" >x</div>
                    </div>
                </div>
            </header>

            <div class="img_section">
                <div class="trans_inner">
                    <div><img src="/api/images/${thumbnailUrl}"; /></div>
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
                            <span id="like-count-39">999</span>
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

function modal(metaUrl, title, content, thumbnailUrl, author, objectId) {
    $("#modal-select").append(modalHtml(metaUrl, title, content, thumbnailUrl, author));
    heartToggle();
    closeModal();
    commentPost(author, objectId);
    console.log(objectId);
    axios
        .get(`http://elice-kdt-sw-1st-vm10.koreacentral.cloudapp.azure.com/api/comment/${objectId}`)
        .then((res) => {
            res.data.forEach((data) => {
                console.log(objectId);
                const { _id } = data;
                const commentId = _id;
                $(".comment_box").append(commentHtml(data, commentId));
                const deleteBtn = document.querySelector(".comment_delete");
                deleteBtn.addEventListener("click", (e) => {
                    const comment_delete_data = {
                        postId: objectId,
                        commentId: commentId,
                    };
                    // console.log(comment_delete_data);
                    axios.delete(
                        `http://elice-kdt-sw-1st-vm10.koreacentral.cloudapp.azure.com/api/comment`,
                        comment_delete_data
                    );
                });
                // deleteBtn.addEventListener("click", (objectId, commentdata) => {
                //     const comment_delete_data = {
                //         postId: objectId,
                //         commentId: commentId,
                //     };
                //     console.log(objectId);
                // axios
                //     .delete(
                //         `http://elice-kdt-sw-1st-vm10.koreacentral.cloudapp.azure.com/api/comment/${objectId}`,
                //         comment_delete_data
                //     )
                //     .then((res2) => {
                //         const comment_box = document.querySelector(".comment_box");
                //         while (comment_box.hasChildNodes()) {
                //             comment_box.removeChild(comment_box.firstChild);
                //         }
                //         res.data.forEach((data) => {
                //             $(".comment_box").append(commentHtml(data, commentId));
                //         });
                //     });
                // });
            });
        });

    // deleteComment();
}

figure.forEach((el) =>
    el.addEventListener("click", async (e) => {
        const objectId = e.target.parentNode.dataset.objectid;
        const res = await axios.get(
            `http://elice-kdt-sw-1st-vm10.koreacentral.cloudapp.azure.com/api/page/detail/${objectId}`
        );
        const { author, content, title, thumbnailUrl, metaUrl, likes } = res.data.post;
        modal(metaUrl, title, content, thumbnailUrl, author, objectId);
        $("html, body").addClass("not_scroll");
        preventAction(true);
        //true : 로그인 false : 로그아웃 !
    })
);
