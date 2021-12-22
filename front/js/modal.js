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

function commentHtml(author) {
    const comment_text = document.querySelector(".comment_text");
    const comment = comment_text.value;
    console.log(comment);
    return `<div class="comment-detail">
                    <div class="comment-nickname">${author}</div>
                    <div class="comment-text">${comment}</div>
                    <button data-name="comment_delete" class="comment_delete">x</button>
                </div>`;
}

function commentPost(author) {
    const commentUpload = document.querySelector("#commentUpload");
    const comment_text = document.querySelector(".comment_text");
    const comment = comment_text.value;
    commentUpload.addEventListener("click", () => {
        if (comment_text.value.length > 1) {
            $(".comment_box").append(commentHtml("은광"));
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

function deleteComment() {
    const deleteBtn = document.querySelector(".comment_delete");
    const comment = deleteBtn.parentNode;
    console.log(comment);
}

function modalHtml() {
    return `<div class="modal">
            <div class="dimmed"></div>

                <article class="contents">
            <header class="top">
                <div class="user_container">
                    <div class="profile_img">
                        <img src="./asset/img/thumb.jpeg" alt="프로필이미지" />
                    </div>
                    <div class="user_name">
                        <div class="nick_name m_text">MetaBook</div>
                    </div>
                    <div class="gather_link">
                        <button type="submit" class="write-submit">입장하기</button>
                    </div>
                    <div class="modal_exit"><button onclick="closeModal()" class="modal_exit_button" type="submit">x</button></div>
                </div>
            </header>

            <div class="img_section">
                <div class="trans_inner">
                    <div><img src="./asset/img/thumb02.jpg" alt="visual01" /></div>
                </div>
            </div>

            <div class="bottom_icons">
                <div class="left_icons">
                    <div class="heart_btn">
                        <div class="sprite_heart_icon_outline" name="39" data-name="heartbeat"></div>
                    </div>
                    <div class="sprite_bubble_icon"></div>
                </div>
            </div>
            <div class="likes m_text">
                좋아요
                <span id="like-count-39">999</span>
                개
            </div>
            <div class = 'scroll_container' id= 'style-1'>  
                <h3 class="maintitle">Title</h2>
                <div class="maintext">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati et ex labore ipsam dolores
                    autem doloremque consequatur. Aliquid sed, placeat soluta suscipit voluptatem sunt iusto quos
                    laboriosam, tenetur aperiam atque.
                </div>
            </div>
                <div class = "comment_box">
                </div>
            <div class="comment_field" id="add-comment-post37">
                <input type="text" placeholder="comment" class="comment_text" />
                <div id="commentUpload" class="upload_btn m_text" data-name="comment">댓글등록</div>
            </div>
        </article>
        </div>`;
}

function modal() {
    $("body").append(modalHtml());
    heartToggle();
    commentPost("은광");
    deleteComment();
}
function closeModal() {
    document.querySelector(".modal").remove();
}

figure.forEach((el) =>
    el.addEventListener("click", () => {
        modal();
    })
);
