package com.example.taskmanager.repository;

import com.example.taskmanager.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByStudentId(Long studentId);
    List<Task> findBySupervisorId(Long supervisorId);
    List<Task> findByStudentIdAndStatus(Long studentId, Task.Status status);
    List<Task> findBySupervisorIdAndStatus(Long supervisorId, Task.Status status);
    
    @Query("SELECT COUNT(t) FROM Task t WHERE t.status = 'COMPLETED'")
    Long countCompletedTasks();
    
    @Query("SELECT COUNT(t) FROM Task t WHERE t.studentId = ?1")
    Long countByStudentId(Long studentId);
    
    @Query("SELECT COUNT(t) FROM Task t WHERE t.studentId = ?1 AND t.status = ?2")
    Long countByStudentIdAndStatus(Long studentId, Task.Status status);
    
    @Query("SELECT COUNT(t) FROM Task t WHERE t.supervisorId = ?1")
    Long countBySupervisorId(Long supervisorId);
    
    @Query("SELECT COUNT(t) FROM Task t WHERE t.supervisorId = ?1 AND t.status = ?2")
    Long countBySupervisorIdAndStatus(Long supervisorId, Task.Status status);
}
