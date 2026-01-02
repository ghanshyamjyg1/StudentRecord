
package com.example.coursereg.controller;

import com.example.coursereg.entity.Student;
import com.example.coursereg.service.StudentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
/**
 * REST Controller for handling student-related HTTP requests.
 * Provides endpoints for managing student records including registration, retrieval, and deletion.
 * All endpoints are prefixed with "/api/students".
 */

@RestController
@RequestMapping("/api/students")
@CrossOrigin
public class StudentController {

    private final StudentService service;

    public StudentController(StudentService service) {
        this.service = service;
    }

    @PostMapping
    public Student register(@RequestBody Student student) {
        return service.save(student);
    }

    @GetMapping
    public List<Student> all() {
        return service.findAll();
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

}
