package com.example.coursereg.service;

import com.example.coursereg.entity.Student;
import com.example.coursereg.exception.CannotDeleteException;
import com.example.coursereg.repository.StudentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {
    private static final Logger logger = LoggerFactory.getLogger(StudentService.class);
    private final StudentRepository repo;

    public StudentService(StudentRepository repo) {
        this.repo = repo;
        logger.debug("StudentService initialized with StudentRepository");
    }

    public Student save(Student student) {
        logger.info("Saving student: {}", student.getName());
        try {
            Student savedStudent = repo.save(student);
            logger.debug("Successfully saved student with ID: {}", savedStudent.getId());
            return savedStudent;
        } catch (Exception e) {
            logger.error("Error saving student: {}", e.getMessage(), e);
            throw e;
        }
    }

    public List<Student> findAll() {
        logger.debug("Fetching all students");
        try {
            List<Student> students = repo.findAll();
            logger.debug("Found {} students", students.size());
            return students;
        } catch (Exception e) {
            logger.error("Error fetching students: {}", e.getMessage(), e);
            throw e;
        }
    }

    public void delete(Long id) {
        logger.info("Attempting to delete student with ID: {}", id);
        try {
            repo.deleteById(id);
            logger.info("Successfully deleted student with ID: {}", id);
        } catch (DataIntegrityViolationException ex) {
            String errorMsg = String.format("Cannot delete student with ID: %d. It is already enrolled in courses.", id);
            logger.warn(errorMsg);
            throw new CannotDeleteException(errorMsg);
        } catch (Exception e) {
            String errorMsg = String.format("Error deleting student with ID: %d - %s", id, e.getMessage());
            logger.error(errorMsg, e);
            throw e;
        }
    }
}