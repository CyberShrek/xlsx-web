package me.illyc.xlsx_web.controller

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.*

@Suppress("MVCPathVariableInspection")
@Controller
@RequestMapping("/editor")
class EditorController(private val webSocket: WebSocket) {

    // Returns 401 if the client is not allowed to edit the document
    @GetMapping
    fun requestPermission() = ResponseEntity<Nothing>(HttpStatus.NO_CONTENT)

    @PostMapping("/sheets/{sheetName}")
    fun createSheet(@PathVariable location: Map<String, String>) = dispatchCommand("createSheet", location)
    @DeleteMapping("/sheets/{sheetName}")
    fun deleteSheet(@PathVariable location: Map<String, String>) = dispatchCommand("deleteSheet", location)

    @PostMapping("/sheets/{sheetName}/rows/{rowIndex}")
    fun createRow(@PathVariable location: Map<String, String>) = dispatchCommand("createRow", location)
    @DeleteMapping("/sheets/{sheetName}/rows/{rowIndex}")
    fun deleteRow(@PathVariable location: Map<String, String>) = dispatchCommand("deleteRow", location)

    @PostMapping("/sheets/{sheetName}/columns/{cellIndex}")
    fun createColumn(@PathVariable location: Map<String, String>) = dispatchCommand("createColumn", location)
    @DeleteMapping("/sheets/{sheetName}/columns/{cellIndex}")
    fun deleteColumn(@PathVariable location: Map<String, String>) = dispatchCommand("deleteColumn", location)

    @PatchMapping("/sheets/{sheetName}/{rowIndex}/{cellIndex}")
    fun patchCell(@PathVariable location: Map<String, String>, @RequestParam patch: String) = dispatchCommand(
        "patchCell", location)

    private fun dispatchCommand(command: String, location: Map<String, String>): ResponseEntity<String>{

        webSocket.spreadObject(object {
            val command = command
            val location = location
        })

        return ResponseEntity(HttpStatus.OK)
    }
}