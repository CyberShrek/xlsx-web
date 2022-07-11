package me.illyc.xlsx_web.config
import me.illyc.xlsx_web.Application
import org.springframework.boot.builder.SpringApplicationBuilder
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer

// This silly config allows packaging the app into .war instead of .jar
class FuckWar : SpringBootServletInitializer() {
	override fun configure(application: SpringApplicationBuilder): SpringApplicationBuilder {
		return application.sources(Application::class.java)
	}
}
