package me.illyc.xlsx_web.controller

import me.illyc.xlsx_web.entity.CellLocation
import me.illyc.xlsx_web.entity.ColumnLocation
import me.illyc.xlsx_web.entity.RowLocation
import me.illyc.xlsx_web.entity.SheetLocation
import me.illyc.xlsx_web.service.EditorService
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.*

@Controller
@RequestMapping("/editor")
@ResponseStatus(value = HttpStatus.OK)
class EditorController(private val service: EditorService) {

    // Returns 401 if the client is not allowed to edit the document
    @GetMapping
    @ResponseStatus(value = HttpStatus.NO_CONTENT) fun requestPermission() {}

    // SHEETS LEVEL

    @PostMapping("/sheets/{sheetName}")
    fun createSheet(loc: SheetLocation) = service.createSheet(loc)

    @DeleteMapping("/sheets/{sheetName}")
    fun deleteSheet(loc: SheetLocation) = service.deleteSheet(loc)

    @PatchMapping("/sheets/{sheetName}")
    fun renameSheet(loc: SheetLocation,
                    @RequestBody newName: String) = service.renameSheet(newName, loc)

    // ROWS-COLUMNS LEVEL

    @PostMapping("/sheets/{sheetName}/rows/{rowIndex}")
    fun createRow(loc: RowLocation) = service.createRow(loc)

    @DeleteMapping("/sheets/{sheetName}/rows/{rowIndex}")
    fun deleteRow(loc: RowLocation) = service.deleteRow(loc)

    @PostMapping("/sheets/{sheetName}/columns/{cellIndex}")
    fun createColumn(loc: ColumnLocation) = service.createColumn(loc)

    @DeleteMapping("/sheets/{sheetName}/columns/{cellIndex}")
    fun deleteColumn(loc: ColumnLocation) = service.deleteColumn(loc)

    // CELLS LEVEL

    @PatchMapping("/sheets/{sheetName}/rows/{rowIndex}/cells/{cellIndex}")
    fun patchText(loc: CellLocation,
                  @RequestBody text: String) = service.patchText(text.removeSurrounding("\"","\""), loc)

    @PatchMapping("/styles/{styleName}")
    fun patchStyle(@PathVariable styleName: String,
                   @RequestParam value: String,
                   @RequestBody locations: Set<CellLocation>) = service.patchStyle(styleName, value, locations)
}
