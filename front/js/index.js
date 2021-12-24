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
                    <img src= http://elice-kdt-sw-1st-vm10.koreacentral.cloudapp.azure.com/api/images/${top_post.thumbnailUrl}>
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
                    <img src= http://elice-kdt-sw-1st-vm10.koreacentral.cloudapp.azure.com/api/images/${post.thumbnailUrl}>
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
export function paginate(first, last, prev, next, totalPage, currPage) {
    $(".pages").empty();

    if (first > 5) $(".pages").append(`<li class="prev">&lt;</li>`);

    //마지막 페이지 처리
    const checked_first =
        last === totalPage && last - currPage < 4
            ? Math.floor(last / 5) * 5 + 1
            : first;

    for (let j = checked_first; j <= last; j++) {
        //page가 현재 페이지이면 파란색으로, 아니면 검정색으로 변경
        if (j === currPage)
            $(".pages").append(
                `<li class='selected'><button>${j}</button></li>`
            );
        else $(".pages").append(`<li><button>${j}</button></li>`);
    }

    if (next > 5 && next <= totalPage)
        $(".pages").append(`<li class="next"> &gt; </a></li>`);

    $(".pages li button").click(function (e) {
        e.preventDefault();
        var num = Number(e.target.textContent);
        render(num);
        paging(num);
    });

    $(".pages li.prev").click(function (e) {
        e.preventDefault();
        $(".pages").empty();
        render(prev);
        paging(prev);
    });

    $(".pages li.next").click(function (e) {
        e.preventDefault();
        $(".pages").empty();
        render(next);
        paging(next);
    });
}

//페이지 정보 불러오고 안에서 first,last,prev,next,totalPage,currPage 정해서 pagenate 함수 실행해주기
export async function paging(currPage) {
    const page_infor = await axios.get(
        `http://elice-kdt-sw-1st-vm10.koreacentral.cloudapp.azure.com/api/page/${currPage}`
    );
    const { totalPage, perPage } = page_infor.data;

    const pageCount = 5; //표시할 페이지 수
    const pageGroup = Math.ceil(currPage / pageCount);

    let last =
        pageGroup * pageCount > totalPage ? totalPage : pageGroup * pageCount; //화면에 보여질 마지막 페이지 번호
    let first = last - (pageCount - 1) <= 0 ? 1 : last - (pageCount - 1); //화면에 보여질 첫번째 페이지 번호
    const next = last + 1;
    const prev = first - 1;

    paginate(first, last, prev, next, totalPage, currPage);
}

//처음 메인페이지 접속 시 1 페이지 정보 불러오기
// window.addEventListener("DOMContentLoaded", () => {
//     render(1);
//     paging(1);
// });
