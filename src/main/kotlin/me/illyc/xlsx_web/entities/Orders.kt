package me.illyc.xlsx_web.entities

abstract class Order(open val order: String)

data class CreateSheetOrder(val location: SheetLocation) : Order("create sheet")
data class DeleteSheetOrder(val location: SheetLocation) : Order("delete sheet")
data class RenameSheetOrder(val location: SheetLocation, val newName: String) : Order("rename sheet")

data class CreateRowOrder(val location: RowLocation) : Order("create row")
data class DeleteRowOrder(val location: RowLocation) : Order("delete row")

data class CreateColumnOrder(val location: ColumnLocation) : Order("create column")
data class DeleteColumnOrder(val location: ColumnLocation) : Order("delete column")

data class PatchCellOrder(val location: CellLocation, val patch: CellPatch) : Order("patch cell")