package me.illyc.xlsx_web.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.socket.server.standard.ServerEndpointExporter

@Configuration
open class WebSocket {
    @Bean
    open fun configurer() = ServerEndpointExporter()
}