package com.example.coursereg.service;

import com.example.coursereg.entity.Course;
import com.example.coursereg.exception.CannotDeleteException;
import com.example.coursereg.repository.CourseRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {
    private static final Logger logger = LoggerFactory.getLogger(CourseService.class);
    private final CourseRepository repo;

    public CourseService(CourseRepository repo) {
        this.repo = repo;
        logger.debug("CourseService initialized");
    }

    public Course save(Course course) {
        logger.info("Saving course: {}", course.getTitle());
        try {
            Course savedCourse = repo.save(course);
            logger.debug("Successfully saved course with ID: {}", savedCourse.getId());
            return savedCourse;
        } catch (Exception e) {
            logger.error("Error saving course: {}", e.getMessage(), e);
            throw e;
        }
    }

    public List<Course> findAll() {
        logger.debug("Fetching all courses");
        return repo.findAll();
    }

    public void delete(Long id) {
        logger.info("Attempting to delete course with ID: {}", id);
        try {
            repo.deleteById(id);
            logger.info("Successfully deleted course with ID: {}", id);
        } catch (DataIntegrityViolationException ex) {
            String errorMsg = "Cannot delete course with ID: " + id + ". It is already enrolled by students.";
            logger.warn(errorMsg);
            throw new CannotDeleteException(errorMsg);
        } catch (Exception e) {
            logger.error("Error deleting course with ID: {} - {}", id, e.getMessage(), e);
            throw e;
        }
    }
}