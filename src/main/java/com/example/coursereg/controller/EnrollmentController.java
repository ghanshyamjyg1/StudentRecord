
package com.example.coursereg.controller;

import com.example.coursereg.entity.Enrollment;
import com.example.coursereg.service.EnrollmentService;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for handling enrollment-related HTTP requests.
 * Provides endpoints for managing student enrollments in courses.
 * All endpoints are prefixed with "/api/enrollments".
 */

@RestController
@RequestMapping("/api/enrollments")
@CrossOrigin
public class EnrollmentController {

    private final EnrollmentService service;

    public EnrollmentController(EnrollmentService service) {
        this.service = service;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Enrollment enroll(@RequestParam Long studentId, @RequestParam Long courseId) {
        return service.enroll(studentId, courseId);
    }

    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @GetMapping
    public List<Enrollment> all() {
        return service.findAll();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }


}
