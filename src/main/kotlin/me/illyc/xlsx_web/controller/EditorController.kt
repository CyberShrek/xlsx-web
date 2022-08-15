package me.illyc.xlsx_web.controller

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.*
import javax.websocket.OnClose
import javax.websocket.OnOpen
import javax.websocket.Session
import javax.websocket.server.ServerEndpoint

@Controller
@RequestMapping("/editor")
@ServerEndpoint("/editor/spreader")
class EditorController {

    // Web-socket sessions
    private val sessions = HashSet<Session>()
    @OnOpen  fun addSession(ses: Session) = sessions.add(ses)
    @OnClose fun removeSession(ses: Session) = sessions.remove(ses)
    // Sends the message to all sessions
    fun spreadMessage(msg: String) = sessions.forEach{ it.basicRemote.sendText(msg) }

    // Returns NO_CONTENT(204) if the client is allowed to edit the document
    @GetMapping
    fun requestPermission() = ResponseEntity<Nothing>(HttpStatus.NO_CONTENT)

    @PostMapping("/sheet{name}")
    fun createSheet(@PathVariable name: String){

        spreadMessage("")
    }
    @DeleteMapping("/sheet{name}")
    fun deleteSheet(@PathVariable name: String){

        spreadMessage("")
    }

    @PostMapping("/sheet{name}/row{index}")
    fun createRow(@PathVariable name: String, @PathVariable index: String){

        spreadMessage("")
    }
    @DeleteMapping("/sheet{name}/row{index}")
    fun deleteRow(@PathVariable name: String, @PathVariable index: String){

        spreadMessage("")
    }

    @PostMapping("/sheet{name}/column{index}")
    fun createColumn(@PathVariable name: String, @PathVariable index: String){

        spreadMessage("")
    }
    @DeleteMapping("/sheet{name}/column{index}")
    fun deleteColumn(@PathVariable name: String, @PathVariable index: String){

        spreadMessage("")
    }

    @PatchMapping("/sheet{name}/row{rIndex}/cell{cIndex}")
    fun patchCell(@PathVariable name: String, @PathVariable rIndex: String, @PathVariable cIndex: String){

        spreadMessage("")
    }
}