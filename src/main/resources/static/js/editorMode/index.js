import {editorPad} from "./editorPad.js"
import "./web.js"
import {httpClient} from "../web/httpClient.js"


editorPad.addSheet.addEventListener("click", ()=>{
    httpClient.createSheet("shit")
})