package me.illyc.xlsx_web.controller

import me.illyc.xlsx_web.service.WorksheetsService
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.GetMapping
import javax.servlet.http.HttpServletResponse

@Controller
class WorksheetsController (private val service : WorksheetsService) {

    // Returns the actual xlxs-catalog template
    @GetMapping
    fun getCatalog(model: Model): String {
        model.addAttribute("workbook", service.workbook)
        model.addAttribute("converter", service.converter)
        return "worksheets.html"
    }

    // Returns a stream allowing the client to download the xlxs-catalog file
    @GetMapping("/file")
    fun downloadCatalog(response: HttpServletResponse) {
        response.setHeader("Content-disposition", "attachment; filename=Catalog.xlsx")
        response.outputStream.use { stream -> service.workbook.write(stream) }
    }

    // Returns OK(200) if the server permits edition
    @GetMapping("/editor")
    fun getPermissionToEdit(response: HttpServletResponse){
        response.status = 200
    }
}