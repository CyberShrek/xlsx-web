package me.illyc.xlsx_web.service

import me.illyc.xlsx_web.utils.PoiConverter
import org.apache.poi.xssf.usermodel.XSSFWorkbook
import org.springframework.stereotype.Service


@Service
class XlsxService {

    private val catalogName = "catalog.xlsx"

    var converter = PoiConverter()
    var workbook = XSSFWorkbook(catalogName)
        private set

}