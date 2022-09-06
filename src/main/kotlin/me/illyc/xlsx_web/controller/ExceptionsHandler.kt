package me.illyc.xlsx_web.controller

import me.illyc.xlsx_web.service.WorkbookException
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler

@ControllerAdvice
class ExceptionsHandler: ResponseEntityExceptionHandler() {

    @ExceptionHandler(WorkbookException::class)
    fun handle(exc: WorkbookException) = ResponseEntity(exc.message, HttpStatus.UNPROCESSABLE_ENTITY)
}