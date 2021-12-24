// ---------------import -------------------------
import { getUserId, generateLogout, preventAction } from "./util.js";
import { render, paginate, paging } from "./index.js";

let userId = null;

window.addEventListener("DOMContentLoaded", async () => {
    userId = await getUserId();
    generateLogout(userId);
    await render(1);
    await paging(1, userId);
    preventAction(userId);
});
