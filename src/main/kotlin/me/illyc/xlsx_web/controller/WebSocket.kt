package me.illyc.xlsx_web.controller

import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.context.annotation.Bean
import org.springframework.stereotype.Controller
import org.springframework.web.socket.server.standard.ServerEndpointExporter
import javax.websocket.OnClose
import javax.websocket.OnOpen
import javax.websocket.Session
import javax.websocket.server.ServerEndpoint

@Controller
@ServerEndpoint("/spreader")
open class WebSocket {

    @Bean
    open fun conf() = ServerEndpointExporter()

    companion object {
        private val sessions = HashSet<Session>()
    }

    @OnOpen  fun addSession(ses: Session)    = sessions.add(ses)
    @OnClose fun removeSession(ses: Session) = sessions.remove(ses)

    fun spreadObject(obj: Any) {
        val json = ObjectMapper().writeValueAsString(obj)
        sessions.forEach { it.basicRemote.sendText(json) }
    }
}