package me.illyc.xlsx_web.controller

import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.databind.ObjectMapper
import me.illyc.xlsx_web.entities.Order
import org.springframework.context.annotation.Bean
import org.springframework.stereotype.Component
import org.springframework.web.socket.server.standard.ServerEndpointExporter
import javax.websocket.OnClose
import javax.websocket.OnOpen
import javax.websocket.Session
import javax.websocket.server.ServerEndpoint

@Component
@ServerEndpoint("/spreader")
open class WebSocket {

    @Bean
    open fun conf() = ServerEndpointExporter()

    companion object {
        private val sessions = HashSet<Session>()
        private val mapper = ObjectMapper()
    }

    init {
        mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL)
    }

    @OnOpen
    fun addSession(ses: Session) = sessions.add(ses)
    @OnClose
    fun removeSession(ses: Session) = sessions.remove(ses)

    fun spreadOrder(order: Order) {
        val json = mapper.writeValueAsString(order)
        sessions.forEach { it.basicRemote.sendText(json) }
    }
}