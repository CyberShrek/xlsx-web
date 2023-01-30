package me.illyc.xlsx_web.entities

import org.apache.poi.ss.usermodel.HorizontalAlignment

data class CellPatch(
    val text:  String?     = null,
    val style: StylePatch? = null,
)

data class StylePatch(
    val background: String?              = null,
    val fontSize:   Short?               = null,
    val align:      HorizontalAlignment? = null,
    val bold:       Boolean?             = null,
    val italic:     Boolean?             = null,
    val underlined: Boolean?             = null
)
