import Qr from "./Qr.vue";
import { createApp,} from "vue";


const MOUNT_EL_ID = "root";

let mountEl = document.createElement("div");
mountEl.setAttribute("id", MOUNT_EL_ID);
document.body.appendChild(mountEl);
createApp(Qr).mount(MOUNT_EL_ID);