package me.illyc.xlsx_web.entity

interface Location

data class SheetLocation(val sheetName: String) : Location

data class RowLocation(val sheetName: String,
                       val rowIndex: Int): Location

data class ColumnLocation(val sheetName: String,
                          val cellIndex: Int): Location

data class CellLocation(val sheetName: String,
                        val rowIndex: Int,
                        val cellIndex: Int): Location