
package com.example.coursereg.controller;

import com.example.coursereg.entity.Course;
import com.example.coursereg.service.CourseService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
/**
 * REST Controller for handling course-related HTTP requests.
 * Provides endpoints for managing courses including creating, retrieving, and deleting courses.
 * All endpoints are prefixed with "/api/courses".
 */

@RestController
@RequestMapping("/api/courses")
@CrossOrigin
public class CourseController {

    private final CourseService service;
    /**
     * Constructs a new CourseController with the given CourseService.
     *
     * @param service The CourseService to be used for business logic operations
     */

    public CourseController(CourseService service) {
        this.service = service;
    }

    /**
     * Creates a new course.
     *
     * @param course The course object to be created, provided in the request body
     * @return The created course with generated ID
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Course add(@RequestBody Course course) {
        return service.save(course);
    }

    /**
     * Retrieves all courses.
     *
     * @return A list of all courses
     */
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @GetMapping
    public List<Course> all() {
        return service.findAll();
    }

    /**
     * Deletes a course by its ID.
     *
     * @param id The ID of the course to be deleted
     */
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

}
