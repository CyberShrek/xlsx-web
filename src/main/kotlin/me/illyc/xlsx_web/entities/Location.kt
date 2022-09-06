package me.illyc.xlsx_web.entities

import org.hibernate.validator.constraints.Length
import org.hibernate.validator.constraints.Range

abstract class Location

private const val maxSheetNameLength = 31
private const val maxRowsAmount = 1048576
private const val maxColumnsAmount = 16384

data class SheetLocation(@field:Length(max = maxSheetNameLength)
                         val sheetName: String
                         ): Location()

data class RowLocation(@field:Length(max = maxSheetNameLength)
                       val sheetName: String,
                       @field:Range(min = 0, max = maxRowsAmount.toLong())
                       val rowIndex: Int
                       ): Location()

data class ColumnLocation(@field:Length(max = maxSheetNameLength)
                          val sheetName: String,
                          @field:Range(min = 0, max = maxColumnsAmount.toLong())
                          val cellIndex: Int
                          ): Location()

data class CellLocation(@field:Length(max = maxSheetNameLength)
                        val sheetName: String,
                        @field:Range(min = 0, max = maxRowsAmount.toLong())
                        val rowIndex: Int,
                        @field:Range(min = 0, max = maxColumnsAmount.toLong())
                        val cellIndex: Int
                        ): Location()