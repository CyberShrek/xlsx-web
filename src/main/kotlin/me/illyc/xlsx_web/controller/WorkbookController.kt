package me.illyc.xlsx_web.controller

import me.illyc.xlsx_web.entities.*
import me.illyc.xlsx_web.service.WorkbookService
import me.illyc.xlsx_web.service.converter
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.*
import javax.servlet.http.HttpServletResponse

@Controller
@ResponseStatus(value = HttpStatus.OK)
class WorkbookController(private val service: WorkbookService)
{
    // Returns the actual xlxs-catalog template
    @GetMapping
    fun getCatalog(model: Model): String {
        model.addAttribute("workbook", service.workbook)
        model.addAttribute("converter", converter)
        return "sheets.html"
    }

    // Allows to download the xlxs-catalog file
    @GetMapping("/file")
    fun downloadCatalog(response: HttpServletResponse) {
        response.setHeader("Content-disposition", "attachment; filename=Catalog.xlsx")
        response.outputStream.use { stream -> service.workbook.write(stream) }
    }

    // Returns 401 if the client is not allowed to edit the document
    @GetMapping("/workbook")
    @ResponseStatus(value = HttpStatus.NO_CONTENT)
    fun requestPermission() {}

    // SHEETS
    @PostMapping("/workbook/sheets/{sheetName}")
    fun createSheet(loc: SheetLocation) = service.executeOrder(CreateSheetOrder(loc))
    @DeleteMapping("/workbook/sheets/{sheetName}")
    fun deleteSheet(loc: SheetLocation) = service.executeOrder(DeleteSheetOrder(loc))
    @PatchMapping("/workbook/sheets/{sheetName}")
    fun renameSheet(@RequestBody newName: String,
                    loc: SheetLocation) = service.executeOrder(RenameSheetOrder(loc, newName))

    // ROWS & COLUMNS
    @PostMapping("/workbook/sheets/{sheetName}/rows/{rowIndex}")
    fun createRow(loc: RowLocation) = service.executeOrder(CreateRowOrder(loc))
    @DeleteMapping("/workbook/sheets/{sheetName}/rows/{rowIndex}")
    fun deleteRow(loc: RowLocation) = service.executeOrder(DeleteRowOrder(loc))

    @PostMapping("/workbook/sheets/{sheetName}/columns/{cellIndex}")
    fun createColumn(loc: ColumnLocation) = service.executeOrder(CreateColumnOrder(loc))
    @DeleteMapping("/workbook/sheets/{sheetName}/columns/{cellIndex}")
    fun deleteColumn(loc: ColumnLocation) = service.executeOrder(DeleteColumnOrder(loc))

    // CELLS
    @PatchMapping("/workbook/sheets/{sheetName}/rows/{rowIndex}/cells/{cellIndex}")
    fun patchText(@RequestBody text: String,
                  loc: CellLocation) = service.executeOrder(PatchTextOrder(loc, text.removeSurrounding("\"")))

    @PatchMapping("/workbook/styles/{styleName}")
    fun patchStyle(@PathVariable styleName: String,
                   @RequestParam value: String,
                   @RequestBody locs: Set<CellLocation>) = service.executeOrder(PatchStyleOrder(locs, styleName, value))
}
