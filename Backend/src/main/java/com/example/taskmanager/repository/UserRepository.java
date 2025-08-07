package com.example.taskmanager.repository;

import com.example.taskmanager.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);
    Boolean existsByStudentId(String studentId);
    List<User> findByRole(User.Role role);
    List<User> findByRoleAndStatus(User.Role role, User.Status status);
    List<User> findBySupervisorId(Long supervisorId);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = 'STUDENT' AND u.status = 'APPROVED'")
    Long countApprovedStudents();
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = 'ENCADREUR'")
    Long countSupervisors();
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = 'STUDENT' AND u.status = 'PENDING'")
    Long countPendingStudents();
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = 'STUDENT' AND u.status = 'DOCUMENTS_PENDING'")
    Long countDocumentsIncompleteStudents();
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = 'STUDENT' AND u.status = 'READY_FOR_ASSIGNMENT'")
    Long countReadyStudents();
}
