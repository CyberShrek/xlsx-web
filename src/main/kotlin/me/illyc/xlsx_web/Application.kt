package me.illyc.xlsx_web

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
open class Application

// A simple web application that allows users to read, edit and export .xlsx files
// (think of this as a primitive implementation of Excel)
fun main() {
    runApplication<Application>()
    print("Running")
}