package me.illyc.xlsx_web.service

import org.apache.poi.xssf.usermodel.XSSFWorkbook
import org.springframework.stereotype.Service


@Service
class XlsxService {

    private val catalogName = "catalog.xlsx"

    var workbook = XSSFWorkbook(catalogName)
        private set



}