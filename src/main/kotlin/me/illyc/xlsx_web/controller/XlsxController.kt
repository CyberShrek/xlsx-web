package me.illyc.xlsx_web.controller

import me.illyc.xlsx_web.service.XlsxService
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.GetMapping
import javax.servlet.http.HttpServletResponse

@Controller
class XlsxController (private val service : XlsxService) {

    // Returns the actual xlxs-catalog template
    @GetMapping
    fun getCatalog(model: Model) : String {
        model.addAttribute("workbook", service.workbook)
        model.addAttribute("converter", service.converter)
        return "xlsx-sheets"
    }

    // Returns a stream allowing the client to download the xlxs-catalog file
    @GetMapping("/download")
    fun downloadCatalog(response: HttpServletResponse) {
        response.characterEncoding = "UTF-8"
        response.setHeader("Content-disposition", "attachment; filename=Catalog.xlsx")
        response.contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        response.outputStream.use { stream -> service.workbook.write(stream) }
    }
}