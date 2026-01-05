
package com.example.coursereg.repository;

import com.example.coursereg.entity.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    /**
     * Check if an enrollment already exists for the given student and course
     * @param studentId The ID of the student
     * @param courseId The ID of the course
     * @return true if an enrollment exists, false otherwise
     */
    boolean existsByStudentIdAndCourseId(Long studentId, Long courseId);
}
