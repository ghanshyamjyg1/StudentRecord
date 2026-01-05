package com.example.coursereg.service;

import com.example.coursereg.entity.*;
import com.example.coursereg.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@Transactional
public class EnrollmentService {
    private static final Logger logger = LoggerFactory.getLogger(EnrollmentService.class);
    private final EnrollmentRepository repo;
    private final StudentRepository studentRepo;
    private final CourseRepository courseRepo;

    public EnrollmentService(EnrollmentRepository repo, StudentRepository studentRepo, CourseRepository courseRepo) {
        this.repo = repo;
        this.studentRepo = studentRepo;
        this.courseRepo = courseRepo;
        logger.debug("EnrollmentService initialized with required repositories");
    }

    public Enrollment enroll(Long studentId, Long courseId) {
        logger.info("Attempting to enroll student ID: {} in course ID: {}", studentId, courseId);

        try {
            Student student = studentRepo.findById(studentId)
                    .orElseThrow(() -> {
                        String errorMsg = String.format("Student not found with ID: %d", studentId);
                        logger.error(errorMsg);
                        return new NoSuchElementException(errorMsg);
                    });

            Course course = courseRepo.findById(courseId)
                    .orElseThrow(() -> {
                        String errorMsg = String.format("Course not found with ID: %d", courseId);
                        logger.error(errorMsg);
                        return new NoSuchElementException(errorMsg);
                    });

            Enrollment enrollment = new Enrollment();
            enrollment.setStudent(student);
            enrollment.setCourse(course);

            Enrollment savedEnrollment = repo.save(enrollment);
            logger.info("Successfully enrolled student ID: {} in course ID: {}", studentId, courseId);

            return savedEnrollment;
        } catch (Exception e) {
            String errorMsg = String.format("Failed to enroll student ID: %d in course ID: %d - %s",
                    studentId, courseId, e.getMessage());
            logger.error(errorMsg, e);
            throw e;
        }
    }

    public List<Enrollment> findAll() {
        logger.debug("Fetching all enrollments");
        try {
            List<Enrollment> enrollments = repo.findAll();
            logger.debug("Found {} enrollments", enrollments.size());
            return enrollments;
        } catch (Exception e) {
            logger.error("Error fetching enrollments: {}", e.getMessage(), e);
            throw e;
        }
    }
    /**
     * Deletes an enrollment by its ID.
     * @param id The ID of the enrollment to delete
     * @throws NoSuchElementException if no enrollment is found with the given ID
     */
    public void delete(Long id) {
        logger.info("Attempting to delete enrollment with ID: {}", id);

        try {
            if (!repo.existsById(id)) {
                logger.warn("No enrollment found with ID: {}", id);
                throw new NoSuchElementException("Enrollment not found with ID: " + id);
            }

            repo.deleteById(id);
            logger.info("Successfully deleted enrollment with ID: {}", id);

        } catch (Exception e) {
            logger.error("Error deleting enrollment with ID: {}. Error: {}", id, e.getMessage(), e);
            throw e; // Re-throw to be handled by the controller
        }
    }
}