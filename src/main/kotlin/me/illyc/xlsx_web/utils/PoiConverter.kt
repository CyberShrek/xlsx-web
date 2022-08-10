package me.illyc.xlsx_web.utils

import com.fasterxml.jackson.databind.JsonNode
import org.apache.poi.ss.usermodel.*
import org.apache.poi.xssf.usermodel.XSSFCell
import org.apache.poi.xssf.usermodel.XSSFCellStyle
import org.apache.poi.xssf.usermodel.XSSFColor
import java.awt.Color

// This class converts POI entity's values and styles. And backwards
class PoiConverter {

    fun XSSFCellStyleToCSS(style: XSSFCellStyle): String {
        return StringBuilder().append(
            "background:" +
                if (style.fillForegroundColorColor != null)
                    "#" + style.fillForegroundColorColor.argbHex.substring(2)
                else "#FFFFFF", ";",
            "text-align:" +
                when (style.alignmentEnum) {
                    HorizontalAlignment.LEFT -> "start"
                    HorizontalAlignment.RIGHT -> "end"
                    else -> "center" }, ";",
            "font-weight:" + if (style.font.bold) "bold" else "normal", ";",
            "font-style:" + if (style.font.italic) "italic" else "normal", ";",
            "text-decoration:" + if (style.font.underline > 0) "underline" else "none", ";",
            "font-size:" + style.font.fontHeightInPoints.toString() + "pt").toString()
    }

    // Перезапись css-стилей из json-полей в ячейку XSSF
    fun setCSStoXSSFCell(css: JsonNode, cell: XSSFCell) {
        val workbook = cell.row.sheet.workbook
        val style = workbook.createCellStyle()
        val font = workbook.createFont()
        val originFont = style.font
        style.cloneStyleFrom(cell.cellStyle) // У XSSFFont такого метода нет, поэтому нужен originFont
        if (css.has("background")) {
            val rgb = css["background"].asText().replace("[^\\d,]".toRegex(), "").split(",").toTypedArray()
            val color = XSSFColor(
                Color(rgb[0].toInt(), rgb[1].toInt(), rgb[2].toInt())
            )
            style.setFillPattern(FillPatternType.SOLID_FOREGROUND)
            style.setFillForegroundColor(color)
        }
        if (css.has("text-align")) {
            val textAlign = css["text-align"].asText()
            style.setAlignment(
                if (textAlign == "start") HorizontalAlignment.LEFT else if (textAlign == "end") HorizontalAlignment.RIGHT else HorizontalAlignment.CENTER
            )
        }
        style.setVerticalAlignment(VerticalAlignment.CENTER)
        style.wrapText = true
        if (css.has("font-weight")) font.bold = css["font-weight"].asText() == "bold" else font.bold = style.font.bold
        if (css.has("font-style")) font.italic = css["font-style"].asText() == "italic" else font.italic =
            originFont.italic
        if (css.has("text-decoration")) font.underline =
            (if (css["text-decoration"].asText() == "underline") 1 else 0).toByte() else font.underline =
            originFont.underline
        if (css.has("font-size")) font.fontHeightInPoints =
            css["font-size"].asText().replace("pt", "").toShort() else font.fontHeightInPoints =
            originFont.fontHeightInPoints

        // Установка границ всем ячейкам
        style.setBorderTop(BorderStyle.THIN)
        style.setBorderBottom(BorderStyle.THIN)
        style.setBorderLeft(BorderStyle.THIN)
        style.setBorderRight(BorderStyle.THIN)
        style.setFont(font)
        cell.cellStyle = style
    }

    // "Simple value" is the original value devoid of specific rudiments not used on the client
    fun getSimpleCellValue(cell: XSSFCell): String? {
        return when (cell.cellTypeEnum) {
            CellType.NUMERIC -> {
                val value = cell.numericCellValue
                // Replacing of the rudiment ".0" ending
                if (value % 1 == 0.0) value.toInt().toString()
                else value.toString()
            }
            else -> cell.stringCellValue
        }
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
