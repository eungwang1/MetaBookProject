const target_board_page = document.querySelector("#board_page");
const target_top = document.querySelector(".top");
const target_board_content = document.querySelector(".board_content");

//게시물을 화면에 그려주는 함수
export async function render(page) {
    const posts = await axios.get(
        `http://elice-kdt-sw-1st-vm10.koreacentral.cloudapp.azure.com/api/page/${page}`
    );
    //인기 게시물 그리기
    $(".top").empty();
    posts.data.top3Post.forEach((top_post) => {
        $(".top").append(
            `<div>
                <figure data-objectid=${top_post._id}>
                    <img src= "http://elice-kdt-sw-1st-vm10.koreacentral.cloudapp.azure.com/api/images/${top_post.thumbnailUrl}">
                        <figcaption>
                            <span class="title">${top_post.title}</span>
                            <span class="writer">${top_post.author.name}</span>
                        </figcaption>
                </figure>
            </div>`
        );
    });
    //일반 게시물 그리기
    $(".board_content ul").empty();
    posts.data.posts.forEach((post) => {
        $(".board_content ul").append(
            `<li>
                <figure data-objectid=${post._id}>
                    <img src= "http://elice-kdt-sw-1st-vm10.koreacentral.cloudapp.azure.com/api/images/${post.thumbnailUrl}">
                    <figcaption>
                        <span class="title">${post.title}</span>
                        <span class="writer">${post.author.name}</span>
                    </figcaption>
                </figure>
            </li>`
        );
    });
}

//화면에 보여줄 페이지 그리기
export function paginate(first, last, prev, next, totalPage, currPage, userId) {
    $(".pages").empty();

    if (first > 5) $(".pages").append(`<li class="prev">&lt;</li>`);

    //마지막 페이지 처리
    const checked_first = last === totalPage && last - currPage < 4 ? Math.floor(last / 5) * 5 + 1 : first;

    for (let j = checked_first; j <= last; j++) {
        //page가 현재 페이지이면 파란색으로, 아니면 검정색으로 변경
        if (j === currPage) $(".pages").append(`<li class='selected'><button>${j}</button></li>`);
        else $(".pages").append(`<li><button>${j}</button></li>`);
    }

    if (next > 5 && next <= totalPage) $(".pages").append(`<li class="next"> &gt; </a></li>`);

    $(".pages li button").click(function (e) {
        e.preventDefault();
        var num = Number(e.target.textContent);
        render(num);
        paging(num);
        createClickEvent(userId);
    });

    $(".pages li.prev").click(function (e) {
        e.preventDefault();
        $(".pages").empty();
        render(prev);
        paging(prev);
        createClickEvent(userId);
    });

    $(".pages li.next").click(function (e) {
        e.preventDefault();
        $(".pages").empty();
        render(next);
        paging(next);
        createClickEvent(userId);
    });
}

//페이지 정보 불러오고 안에서 first,last,prev,next,totalPage,currPage 정해서 pagenate 함수 실행해주기
export async function paging(currPage, userId) {
    const page_infor = await axios.get(
        `http://elice-kdt-sw-1st-vm10.koreacentral.cloudapp.azure.com/api/page/${currPage}`
    );
    const { totalPage, perPage } = page_infor.data;

    const pageCount = 5; //표시할 페이지 수
    const pageGroup = Math.ceil(currPage / pageCount);

    let last = pageGroup * pageCount > totalPage ? totalPage : pageGroup * pageCount; //화면에 보여질 마지막 페이지 번호
    let first = last - (pageCount - 1) <= 0 ? 1 : last - (pageCount - 1); //화면에 보여질 첫번째 페이지 번호
    const next = last + 1;
    const prev = first - 1;

    paginate(first, last, prev, next, totalPage, currPage, userId);
    createClickEvent(userId);
}

//처음 메인페이지 접속 시 1 페이지 정보 불러오기
// window.addEventListener("DOMContentLoaded", () => {
//     render(1);
//     paging(1);
// });
function createClickEvent(userId) {
    const figure = document.querySelectorAll("figure");
    figure.forEach((el) =>
        el.addEventListener("click", async (e) => {
            const objectId = e.target.parentNode.dataset.objectid;
            const res = await axios.get(
                `http://elice-kdt-sw-1st-vm10.koreacentral.cloudapp.azure.com/api/page/detail/${objectId}`
            );

            const { author, content, title, thumbnailUrl, metaUrl, likeCount, likes } = res.data.post;
            modal(metaUrl, title, content, thumbnailUrl, author, objectId, likeCount, likes, userId);
            $("html, body").addClass("not_scroll");
            //true : 로그인 false : 로그아웃 !
        })
    );
}
// 좋아요 버튼 클릭시 실행함수 -> 하트이미지 토글, 좋아요 수 변경
function heartPost(objectId, likes, userId) {
    const heart = document.querySelector(".sprite_heart_icon_outline");
    const like_text = document.getElementById("like-count-39");
    heart.addEventListener("click", async () => {
        const res = await axios.put(
            `http://elice-kdt-sw-1st-vm10.koreacentral.cloudapp.azure.com/api/post/${objectId}/like`
        );
        if (res.data.ok) {
            const likeres = await axios.get(`/api/page/detail/${objectId}`);
            // if (likeres.data.post.likes.includes(userId))
            if (heart.style.backgroundPosition === "-52px -261px") {
                heart.style.backgroundPosition = "-26px -261px";
                like_text.innerText = likeres.data.post.likeCount;
            } else {
                heart.style.backgroundPosition = "-52px -261px";
                like_text.innerText = likeres.data.post.likeCount;
            }
        }
    });
}

// 이전에 좋아요 눌렀던 사람의 경우, 좋아요 상태 유지 함수.
function heartToggle(likes, userId) {
    let heart_boolean = true;
    const heart = document.querySelector(".sprite_heart_icon_outline");
    if (likes.includes(userId)) {
        heart.style.backgroundPosition = "-26px -261px";
        heart_boolean = false;
    } else {
        heart.style.backgroundPosition = "-52px -261px";
    }
}

// 댓글 HTML
function commentHtml(data, commentId, userId) {
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
                                <button id='arrow-box'></button>
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
        .get(`http://elice-kdt-sw-1st-vm10.koreacentral.cloudapp.azure.com/api/comment/${objectId}`)
        .then((res) => {
            res.data.forEach((data, idx) => {
                const { _id } = data;
                const commentId = _id;
                $(".comment_box").append(commentHtml(data, commentId));
                // const deleteBtn = document.querySelector(".comment_delete");
                const comment_box = document.querySelector(".comment_box");
                const deleteBtn = document.getElementsByClassName("comment_delete")[idx];
                document.getElementsByClassName("comment_delete")[idx].addEventListener("click", (e) => {
                    const comment_delete_data = {
                        postId: objectId,
                        commentId: commentId,
                    };
                    axios
                        .delete(
                            `http://elice-kdt-sw-1st-vm10.koreacentral.cloudapp.azure.com/api/comment`,

                            {
                                data: comment_delete_data,
                            }
                        )
                        .then((res) => {
                            while (comment_box.hasChildNodes()) {
                                comment_box.removeChild(comment_box.firstChild);
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
        .get(`http://elice-kdt-sw-1st-vm10.koreacentral.cloudapp.azure.com/api/comment/${objectId}`)
        .then((res) => {
            res.data.forEach((data, idx) => {
                const { _id } = data;
                const commentId = _id;
                $(".comment_box").append(commentHtml(data, commentId));
                // const deleteBtn = document.querySelector(".comment_delete");
                const comment_box = document.querySelector(".comment_box");
                const deleteBtn = document.getElementsByClassName("comment_delete")[idx];
                document.getElementsByClassName("comment_delete")[idx].addEventListener("click", (e) => {
                    const comment_delete_data = {
                        postId: objectId,
                        commentId: commentId,
                    };
                    axios
                        .delete(
                            `http://elice-kdt-sw-1st-vm10.koreacentral.cloudapp.azure.com/api/comment`,

                            {
                                data: comment_delete_data,
                            }
                        )
                        .then((res) => {
                            while (comment_box.hasChildNodes()) {
                                comment_box.removeChild(comment_box.firstChild);
                            }
                            commentRender_supporter(objectId);
                        });
                    // 기존 댓글 삭제 및 다시 불러오기.
                });
            });
        });
}

// 모달창이 켜졌을 때 실행되는 함수
function modal(metaUrl, title, content, thumbnailUrl, author, objectId, likeCount, likes, userId) {
    $("#modal-select").append(modalHtml(metaUrl, title, content, thumbnailUrl, author, likeCount));
    const comment_box = document.querySelector(".comment_box");
    heartToggle(likes, userId);
    closeModal();
    commentPost(author, objectId);
    // commentRendering(comment_box, objectId, commentId);
    commentRender(objectId, userId);
    heartPost(objectId, likes, userId);
    addAmendBtn(userId, author._id, objectId);
    preventAction(userId);
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
    const menu2 = document.createElement("li");
    const amend = document.createElement("a");
    const amend2 = document.createElement("div");
    extra.classList.add("extra");

    amend.textContent = "수정하기";
    amend2.textContent = "삭제하기";
    amend2.style.color = "#000";
    amend2.style.cursor = "pointer";

    amend2.addEventListener("click", async () => {
        const res = await axios.delete(
            `http://elice-kdt-sw-1st-vm10.koreacentral.cloudapp.azure.com/api/post/${objectId}`
        );
        if (res.data.ok) {
            location.href = "http://elice-kdt-sw-1st-vm10.koreacentral.cloudapp.azure.com";
        }
    });

    amend.href = `http://elice-kdt-sw-1st-vm10.koreacentral.cloudapp.azure.com/views/write.html?${objectId}`;
    menu.appendChild(amend);
    menu2.appendChild(amend2);
    dropWrap.appendChild(menu);
    dropWrap.appendChild(menu2);
    target.appendChild(dropWrap);
    arrow.appendChild(extra);
    arrow.addEventListener("click", () => {
        arrow.classList.toggle("toggle");
    });
    arrow.addEventListener("blur", () => {
        arrow.classList.remove("toggle");
    });
}

function preventAction(user) {
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
