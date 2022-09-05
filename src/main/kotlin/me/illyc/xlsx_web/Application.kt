package me.illyc.xlsx_web

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
open class Application

// A simple web application that allows users to read, edit and export .xlsx files
// (primitive implementation of Excel)
fun main() {
    runApplication<Application>()
    println("Running")
}