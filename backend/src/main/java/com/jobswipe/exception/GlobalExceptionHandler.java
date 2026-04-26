package com.jobswipe.exception;

import com.jobswipe.dto.MessageResponse;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
  @ExceptionHandler(ApiException.class)
  public ResponseEntity<MessageResponse> handleApiException(ApiException exception) {
    return ResponseEntity.status(exception.getStatus()).body(new MessageResponse(exception.getMessage()));
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<MessageResponse> handleValidation(MethodArgumentNotValidException exception) {
    String message = exception.getBindingResult()
        .getFieldErrors()
        .stream()
        .map(this::formatFieldError)
        .collect(Collectors.joining(" "));

    return ResponseEntity.badRequest().body(new MessageResponse(message.isBlank() ? "Invalid input." : message));
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<MessageResponse> handleUnexpected(Exception exception) {
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new MessageResponse("Something went wrong."));
  }

  private String formatFieldError(FieldError error) {
    return error.getField() + ": " + error.getDefaultMessage() + ".";
  }
}
