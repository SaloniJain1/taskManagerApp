package com.taskmanager.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

/**
 * Global exception handler to map backend exceptions to appropriate HTTP status
 * codes.
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handles illegal argument exceptions (e.g., ID mismatches).
     * 
     * @param ex The exception instance.
     * @return 400 Bad Request with error message.
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgument(IllegalArgumentException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    /**
     * Handles runtime exceptions and maps them based on content patterns.
     * Maps "not found" to 404 and "already exists" to 409.
     *
     * @param ex The exception instance.
     * @return Appropriate ResponseEntity with body and status.
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntime(RuntimeException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("message", ex.getMessage());

        String message = ex.getMessage().toLowerCase();
        if (message.contains("not found")) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
        if (message.contains("already exists")) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
