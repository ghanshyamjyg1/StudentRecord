
package com.example.coursereg.controller;

import com.example.coursereg.entity.Enrollment;
import com.example.coursereg.service.EnrollmentService;
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

    @PostMapping
    public Enrollment enroll(@RequestParam Long studentId, @RequestParam Long courseId) {
        return service.enroll(studentId, courseId);
    }

    @GetMapping
    public List<Enrollment> all() {
        return service.findAll();
    }
}
