package me.illyc.xlsx_web.service

import me.illyc.xlsx_web.controller.WebSocket
import me.illyc.xlsx_web.entities.*
import org.apache.poi.openxml4j.util.ZipSecureFile
import org.apache.poi.ss.usermodel.BorderStyle
import org.apache.poi.ss.usermodel.FillPatternType
import org.apache.poi.ss.usermodel.Row
import org.apache.poi.xssf.usermodel.XSSFCell
import org.apache.poi.xssf.usermodel.XSSFCellStyle
import org.apache.poi.xssf.usermodel.XSSFFont
import org.apache.poi.xssf.usermodel.XSSFWorkbook
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.web.bind.annotation.ResponseStatus
import java.io.File
import java.io.FileInputStream
import java.io.FileNotFoundException
import java.io.FileOutputStream

@Service
class WorkbookService(private val spreader: WebSocket) {

    private var fileLocation = "/opt/manual/catalog/"

    private val catalogName get() = fileLocation + "software-catalog.xlsx"
    private val bufferName  get() = fileLocation + "software-catalog-buffer.xlsx"

    // Apache poi workbook object
    companion object

    var workbook: XSSFWorkbook

    init {
        // Zero InflateRatio to avoid the Zip bomb detected! exception
        ZipSecureFile.setMinInflateRatio(0.0)

        try {
            FileInputStream(catalogName)
        } catch (exception: FileNotFoundException) {
            fileLocation = ""
        }

        // The buffer file is the actual file
        if (File(bufferName).exists())
            XSSFWorkbook(bufferName).write(FileOutputStream(catalogName))

        workbook = XSSFWorkbook(catalogName)
    }

    // Takes orders and execute them coherently.
    // Must be synchronized for properly catalog file writing sequence
    @Synchronized
    fun bearOrder(order: Order) {
        when (order) {
            is CreateSheetOrder  -> createSheet(order.location)
            is DeleteSheetOrder  -> deleteSheet(order.location)
            is RenameSheetOrder  -> renameSheet(order.location, order.newName)
            is CreateRowOrder    -> createRow(order.location)
            is DeleteRowOrder    -> deleteRow(order.location)
            is CreateColumnOrder -> createColumn(order.location)
            is DeleteColumnOrder -> deleteColumn(order.location)
            is PatchCellOrder    -> patchCell(order.location, order.patch)
        }
        // Writing changes to the buffer to safely rewrite the origin catalog file
        workbook.write(FileOutputStream(bufferName))
        spreader.spreadOrder(order)
    }

    private fun createSheet(loc: SheetLocation) {
        assertThatSheetDoesNotExist(loc.sheetName)
        standardizeStyle(workbook.createSheet(loc.sheetName).createRow(0).createCell(0).cellStyle)
    }

    private fun deleteSheet(loc: SheetLocation) {
        assertThatSheetExists(loc.sheetName)
        workbook.removeSheetAt(workbook.getSheetIndex(loc.sheetName))
    }

    private fun renameSheet(loc: SheetLocation, newName: String) {
        assertThatSheetExists(loc.sheetName)
        assertThatSheetDoesNotExist(newName)
        workbook.setSheetName(workbook.getSheetIndex(loc.sheetName), newName)
    }

    private fun createRow(loc: RowLocation) {
        val sheet = workbook.getSheet(loc.sheetName)
        val newRowIndex = loc.rowIndex + 1

        // Shifting rows to make room for a new row
        if (newRowIndex <= sheet.lastRowNum)
            sheet.shiftRows(newRowIndex, sheet.lastRowNum, 1)

        val newRow = sheet.createRow(newRowIndex)
        // Filling the new row with new cells
        for (i in 0 until sheet.getRow(0).lastCellNum) {
            standardizeStyle(newRow.createCell(i).cellStyle)
        }
    }

    private fun deleteRow(loc: RowLocation) {
        val sheet = workbook.getSheet(loc.sheetName)
        sheet.removeRow(sheet.getRow(loc.rowIndex))

        // Shifting other rows up to fill the room
        if (loc.rowIndex < sheet.lastRowNum) {
            sheet.shiftRows(loc.rowIndex + 1, sheet.lastRowNum, -1)
        }
    }

    private fun createColumn(loc: ColumnLocation) {
        val newColumnId = loc.cellIndex + 1
        for (row in workbook.getSheet(loc.sheetName)) {

            // Shifting cells to make room for a new cell
            if (loc.cellIndex <= row.lastCellNum)
                shiftCellsInRow(row, newColumnId, 1)

            standardizeStyle((row.createCell(newColumnId) as XSSFCell).cellStyle)
        }
    }

    private fun deleteColumn(loc: ColumnLocation) {
        for (row in workbook.getSheet(loc.sheetName)) {
            row.removeCell(row.getCell(loc.cellIndex))

            // Shifting other cells left to fill the room
            if (loc.cellIndex < row.lastCellNum) {
                shiftCellsInRow(row, loc.cellIndex + 1, -1)
                row.removeCell(row.getCell(row.lastCellNum.toInt() - 1))
            }
        }
    }

    private fun patchCell(loc: CellLocation, patch: CellPatch){
        val cell = workbook.getSheet(loc.sheetName).getRow(loc.rowIndex).getCell(loc.cellIndex)

        if(patch.text  != null) cell.setCellValue(patch.text)
        if(patch.style != null) cell.cellStyle = createPatchedStyle(patch.style, cell.cellStyle)
    }

    private fun createPatchedStyle(patch: StylePatch, oldStyle: XSSFCellStyle): XSSFCellStyle{
        val newStyle = workbook.createCellStyle()
        newStyle.cloneStyleFrom(oldStyle)
        standardizeStyle(newStyle)

        if(patch.align      != null) newStyle.alignment           = patch.align
        if(patch.background != null) {
            newStyle.fillPattern = FillPatternType.SOLID_FOREGROUND
            newStyle.setFillForegroundColor(converter.cssColorToXSSFColor(patch.background))
        }
        newStyle.setFont(createPatchedFont(patch, newStyle.font))

        return newStyle
    }

    private fun createPatchedFont(patch: StylePatch, oldFont: XSSFFont): XSSFFont{
        val newFont = workbook.createFont()
        copyFont(oldFont, newFont)

        if(patch.fontSize   != null) newFont.fontHeightInPoints = patch.fontSize
        if(patch.bold       != null) newFont.bold               = patch.bold
        if(patch.italic     != null) newFont.italic             = patch.italic
        if(patch.underlined != null) newFont.underline          = if(patch.underlined) 1 else 0
        return newFont
    }

    private fun copyFont(from: XSSFFont, to: XSSFFont){
        to.fontHeightInPoints = from.fontHeightInPoints
        to.bold               = from.bold
        to.italic             = from.italic
        to.underline          = from.underline
    }

    private fun standardizeStyle(style: XSSFCellStyle): XSSFCellStyle{
        style.borderTop    = BorderStyle.THIN
        style.borderBottom = BorderStyle.THIN
        style.borderLeft   = BorderStyle.THIN
        style.borderRight  = BorderStyle.THIN
        style.wrapText     = true
//        style.fillPattern  = FillPatternType.SOLID_FOREGROUND
        return style
    }

    // Like Sheet.shiftRows() but for cells in a row
    private fun shiftCellsInRow(row: Row, from: Int, step: Int) {
        // Plows a cell in a row by id, creating it in a new location according to the step length
        fun plow(i: Int) {
            val cell = row.getCell(i)
            val newCell = row.createCell(i + step)
            converter.setSimpleCellValue(converter.getSimpleCellValue((cell as XSSFCell)), newCell as XSSFCell)
            newCell.setCellStyle(cell.cellStyle)
        }
        if (step > 0) for (i in row.lastCellNum - 1 downTo from)
            plow(i)
        else for (i in from until row.lastCellNum)
            plow(i)
    }

    private fun assertThatSheetExists(sheetName: String) {
        if (workbook.getSheet(sheetName) == null) error("Sheet \"${sheetName}\" does not exist!")
    }

    private fun assertThatSheetDoesNotExist(sheetName: String) {
        if (workbook.getSheet(sheetName) != null) error("Sheet \"${sheetName}\" already exists!")
    }

    private fun error(text: String): Nothing = throw WorkbookException(text)
}

@ResponseStatus(value = HttpStatus.UNPROCESSABLE_ENTITY)
class WorkbookException(override val message: String?) : RuntimeException()

