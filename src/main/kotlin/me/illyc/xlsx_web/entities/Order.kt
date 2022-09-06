package me.illyc.xlsx_web.entities

abstract class Order(val order: String)

data class CreateSheetOrder(val location: SheetLocation): Order("createSheet")
data class DeleteSheetOrder(val location: SheetLocation): Order("deleteSheet")
data class RenameSheetOrder(val location: SheetLocation,
                            val newName: String): Order("renameSheet")

data class CreateRowOrder(val location: RowLocation): Order("createRow")
data class DeleteRowOrder(val location: RowLocation): Order("deleteRow")

data class CreateColumnOrder(val location: ColumnLocation): Order("createColumn")
data class DeleteColumnOrder(val location: ColumnLocation): Order("deleteColumn")

data class PatchTextOrder(val location: CellLocation,
                          val text: String): Order("patchText")

data class PatchStyleOrder(val locations: Set<CellLocation>,
                           val style: String,
                           val value: String): Order("patchStyle")