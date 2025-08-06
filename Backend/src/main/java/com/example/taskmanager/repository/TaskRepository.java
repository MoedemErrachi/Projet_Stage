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
    
    Long countByStudentId(Long studentId);
    Long countByStudentIdAndStatus(Long studentId, Task.Status status);
    Long countBySupervisorId(Long supervisorId);
    Long countBySupervisorIdAndStatus(Long supervisorId, Task.Status status);
}
