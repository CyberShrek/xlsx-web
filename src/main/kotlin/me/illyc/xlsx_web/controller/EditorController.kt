package me.illyc.xlsx_web.controller

import me.illyc.xlsx_web.service.EditorService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.*

@Controller
@RequestMapping("/editor")
class EditorController(private val service: EditorService) {

    // Returns 401 if the client is not allowed to edit the document
    @GetMapping
    fun requestPermission() = ResponseEntity<Nothing>(HttpStatus.NO_CONTENT)

    // SHEETS LEVEL
    @PostMapping("/sheets/{sheetName}")
    fun createSheet(@PathVariable location: Map<String, String>) = executeOrder("createSheet", location)
    @DeleteMapping("/sheets/{sheetName}")
    fun deleteSheet(@PathVariable location: Map<String, String>) = executeOrder("deleteSheet", location)
    @PatchMapping("/sheets/{sheetName}")
    fun renameSheet(@PathVariable location: Map<String, String>,
                    @RequestParam patch: Map<String, String>) = executeOrder("renameSheet", location, patch)

    // ROWS-COLUMNS LEVEL
    @PostMapping("/sheets/{sheetName}/rows/{rowIndex}")
    fun createRow(@PathVariable location: Map<String, String>) = executeOrder("createRow", location)
    @DeleteMapping("/sheets/{sheetName}/rows/{rowIndex}")
    fun deleteRow(@PathVariable location: Map<String, String>) = executeOrder("deleteRow", location)

    @PostMapping("/sheets/{sheetName}/columns/{cellIndex}")
    fun createColumn(@PathVariable location: Map<String, String>) = executeOrder("createColumn", location)
    @DeleteMapping("/sheets/{sheetName}/columns/{cellIndex}")
    fun deleteColumn(@PathVariable location: Map<String, String>) = executeOrder("deleteColumn", location)

    // CELLS LEVEL
    @PatchMapping("/sheets/{sheetName}/{rowIndex}/{cellIndex}")
    fun patchCell(@PathVariable location: Map<String, String>,
                  @RequestParam patch: Map<String, String>) = executeOrder("patchCell", location, patch)

    // Assembles an order for editing and transfer it to the service,
    // then returns ResponseEntity corresponding to the result of the service process
    private fun executeOrder(type: String, vararg maps: Map<String, String>): ResponseEntity<String> {

        val sheetName = maps[0]["sheetName"]
        val rowIndex = maps[0]["rowIndex"]
        val cellIndex = maps[0]["cellIndex"]
        val patch = if (maps.size >= 2) maps[1] else null

        return if (when (type) {
                "createSheet"  -> service.createSheet(sheetName!!)
                "deleteSheet"  -> service.deleteSheet(sheetName!!)
                "renameSheet"  -> service.renameSheet(sheetName!!, patch!!["newName"]!!)
                "createRow"    -> service.createRow(sheetName!!, rowIndex!!)
                "deleteRow"    -> service.deleteRow(sheetName!!, rowIndex!!)
                "createColumn" -> service.createColumn(sheetName!!, cellIndex!!)
                "deleteColumn" -> service.deleteColumn(sheetName!!, cellIndex!!)
                "patchCell"    -> service.patchCell(sheetName!!, rowIndex!!, cellIndex!!, patch!!)
                else -> false
            })
            ResponseEntity<String>(HttpStatus.OK)
        else
            ResponseEntity<String>(HttpStatus.INTERNAL_SERVER_ERROR)
    }
}
