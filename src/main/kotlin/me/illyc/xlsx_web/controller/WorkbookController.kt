package me.illyc.xlsx_web.controller

import me.illyc.xlsx_web.entities.*
import me.illyc.xlsx_web.service.WorkbookService
import me.illyc.xlsx_web.service.converter
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.*
import java.net.URLEncoder
import javax.servlet.http.HttpServletResponse
import javax.validation.Valid

@Controller
@ResponseStatus(value = HttpStatus.OK)
class WorkbookController(private val service: WorkbookService) {
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
        val fileName = URLEncoder.encode("Реестр ПО", "UTF-8").replace('+', ' ') + ".xlsx"
        response.setHeader("Content-disposition", "attachment; filename=$fileName")
        response.outputStream.use { stream -> service.workbook.write(stream) }
    }

    // Returns 401 if the client is not allowed to edit the document
    @GetMapping("/workbook")
    @ResponseStatus(value = HttpStatus.NO_CONTENT)
    fun requestPermission() {
    }

    // SHEETS
    @PostMapping("/workbook/sheets/{sheetName}")
    fun createSheet(
        @Valid loc: SheetLocation) = service.bearOrder(CreateSheetOrder(loc))

    @DeleteMapping("/workbook/sheets/{sheetName}")
    fun deleteSheet(
        @Valid loc: SheetLocation) = service.bearOrder(DeleteSheetOrder(loc))

    @PatchMapping("/workbook/sheets/{sheetName}")
    fun renameSheet(
        @RequestBody newName: String,
        @Valid loc: SheetLocation) = service.bearOrder(RenameSheetOrder(loc, newName))

    // ROWS & COLUMNS
    @PostMapping("/workbook/sheets/{sheetName}/rows/{rowIndex}")
    fun createRow(
        @Valid loc: RowLocation) = service.bearOrder(CreateRowOrder(loc))

    @DeleteMapping("/workbook/sheets/{sheetName}/rows/{rowIndex}")
    fun deleteRow(
        @Valid loc: RowLocation) = service.bearOrder(DeleteRowOrder(loc))

    @PostMapping("/workbook/sheets/{sheetName}/columns/{cellIndex}")
    fun createColumn(
        @Valid loc: ColumnLocation) = service.bearOrder(CreateColumnOrder(loc))

    @DeleteMapping("/workbook/sheets/{sheetName}/columns/{cellIndex}")
    fun deleteColumn(
        @Valid loc: ColumnLocation) = service.bearOrder(DeleteColumnOrder(loc))

    // CELLS
    @PatchMapping("/workbook/sheets/{sheetName}/rows/{rowIndex}/cells/{cellIndex}")
    fun patchCell(
        @Valid loc: CellLocation,
        @RequestBody patch: CellPatch) = service.bearOrder(PatchCellOrder(loc, patch))
}
