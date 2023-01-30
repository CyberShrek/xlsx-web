package me.illyc.xlsx_web.service

import org.apache.poi.ss.usermodel.CellType
import org.apache.poi.xssf.usermodel.DefaultIndexedColorMap
import org.apache.poi.xssf.usermodel.XSSFCell
import org.apache.poi.xssf.usermodel.XSSFCellStyle
import org.apache.poi.xssf.usermodel.XSSFColor

// Converts POI entity's values and styles. And backwards
object converter {
    // Takes XSSFCellStyle object and return it as a CSS string
    fun XSSFCellStyleToCSS(style: XSSFCellStyle) = StringBuilder().append(
        "background:" +
                if (style.fillForegroundColorColor != null)
                    "#" + style.fillForegroundColorColor.argbHex.substring(2)
                else "#FFFFFF", ";",
        "text-align:" + style.alignment, ";",
        "font-weight:" + if (style.font.bold) "bold" else "normal", ";",
        "font-style:" + if (style.font.italic) "italic" else "normal", ";",
        "text-decoration:" + if (style.font.underline > 0) "underline" else "none", ";",
        "font-size:" + style.font.fontHeightInPoints.toString() + "pt"
    )
    .toString()

    fun cssColorToXSSFColor(cssColor:String): XSSFColor{
        val rgb: List<Byte> = cssColor
            .replace("[^\\d,]".toRegex(), "")
            .split(",")
            .map { t -> t.toInt().toByte() }

        return XSSFColor(byteArrayOf(rgb[0], rgb[1], rgb[2]), DefaultIndexedColorMap())
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