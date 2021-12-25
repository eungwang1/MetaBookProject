// ---------------import -------------------------
import { getUserId, generateLogout } from "./util.js";
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

            const { author, content, title, thumbnailUrl, metaUrl, likeCount, likes } = res.data.post;
            console.log(author);
            console.log(likes.includes("61c35dfce7e0d57cfd1a7cb1"));
            modal(metaUrl, title, content, thumbnailUrl, author, objectId, likeCount, likes);
            $("html, body").addClass("not_scroll");
            preventAction(userId);
            //true : 로그인 false : 로그아웃 !
        })
    );
});
