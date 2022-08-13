package me.illyc.xlsx_web.controller

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import javax.websocket.OnClose
import javax.websocket.OnOpen
import javax.websocket.Session
import javax.websocket.server.ServerEndpoint

@Controller
@RequestMapping("/editor")
@ServerEndpoint("/editor")
class EditorController {

    // Web-socket sessions
    private val sessions = HashSet<Session>()
    @OnOpen  fun addSession(ses: Session) = sessions.add(ses)
    @OnClose fun removeSession(ses: Session) = sessions.remove(ses)
    // Sends the message to all sessions
    fun spreadMessage(msg: String) = sessions.forEach{ it.basicRemote.sendText(msg) }

    // Returns NO_CONTENT(204) if the client is allowed to edit the document
    @GetMapping("permission")
    fun requestPermission() = ResponseEntity<Nothing>(HttpStatus.NO_CONTENT)

}