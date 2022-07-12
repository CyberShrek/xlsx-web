package me.illyc.xlsx_web.controller

import me.illyc.xlsx_web.service.XlsxService
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.GetMapping
import javax.annotation.PostConstruct

@Controller
class XlsxController (private val service : XlsxService) {

    // Returns actual xlxs-catalog template
    @GetMapping
    fun getCatalog (model: Model) : String {
        model.addAttribute("workbook", service.workbook)
        return "xlsx-sheets"
    }

    @PostConstruct
    private fun shit() {

    }
}