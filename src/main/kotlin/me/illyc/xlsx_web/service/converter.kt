package me.illyc.xlsx_web.service

import org.apache.poi.ss.usermodel.BorderStyle
import org.apache.poi.ss.usermodel.CellType
import org.apache.poi.ss.usermodel.HorizontalAlignment
import org.apache.poi.xssf.usermodel.XSSFCell
import org.apache.poi.xssf.usermodel.XSSFCellStyle

// Converts POI entity's values and styles. And backwards
object converter
{
    // Takes XSSFCellStyle object and return it as a CSS string
    fun XSSFCellStyleToCSS(style: XSSFCellStyle) = StringBuilder().append(
        "background:" +
                if (style.fillForegroundColorColor != null)
                    "#" + style.fillForegroundColorColor.argbHex.substring(2)
                else "#FFFFFF", ";",
        "text-align:" +
                when (style.alignment) {
                    HorizontalAlignment.LEFT -> "start"
                    HorizontalAlignment.RIGHT -> "end"
                    else -> "center" }, ";",
        "font-weight:" + if (style.font.bold) "bold" else "normal", ";",
        "font-style:" + if (style.font.italic) "italic" else "normal", ";",
        "text-decoration:" + if (style.font.underline > 0) "underline" else "none", ";",
        "font-size:" + style.font.fontHeightInPoints.toString() + "pt")
        .toString()

    // Takes simple style value and patch it to the XSSFCellStyle
    fun patchStyleToXSSFCell(styleName: String, value: String, cell: XSSFCell) {
        val cellStyle = cell.row.sheet.workbook.createCellStyle()
        cellStyle.cloneStyleFrom(cell.cellStyle)

        when(styleName){
            "textAlign" -> when(value){
                "left" -> cellStyle.alignment = HorizontalAlignment.LEFT
                "right" -> cellStyle.alignment = HorizontalAlignment.RIGHT
                "center" -> cellStyle.alignment = HorizontalAlignment.CENTER
            }
        }

        // Assigning thin borders by default
        cellStyle.borderTop = BorderStyle.THIN
        cellStyle.borderBottom = BorderStyle.THIN
        cellStyle.borderLeft = BorderStyle.THIN
        cellStyle.borderRight = BorderStyle.THIN
        //        cellStyle.setFont(font)

        cell.cellStyle = cellStyle
    }

    // "Simple value" is the original value devoid of specific rudiments not used in the browser
    fun getSimpleCellValue(cell: XSSFCell) = when (cell.cellType) {
        CellType.NUMERIC -> {
            val value = cell.numericCellValue
            // Replacing of the rudiment ".0" ending
            if (value % 1 == 0.0)
                value.toInt().toString()
            else
                value.toString()
        }
        else -> cell.stringCellValue
    }

    // Same as the getSimpleCellValue() but vise versa
    fun setSimpleCellValue(value: String, cell: XSSFCell?) {
        if (cell == null) return
        if (value.matches(Regex("([-]?[0-9]+[.,][0-9]+)|([-]?[0-9]+)"))) // if value is number
            cell.setCellValue(value.toDouble())
        else
            cell.setCellValue(value)
    }
}