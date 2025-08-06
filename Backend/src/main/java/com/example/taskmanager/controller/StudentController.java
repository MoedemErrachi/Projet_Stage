package com.example.taskmanager.controller;

import com.example.taskmanager.model.Task;
import com.example.taskmanager.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/student")
public class StudentController {

    @Autowired
    private TaskRepository taskRepository;

    @GetMapping("/tasks/{studentId}")
    public ResponseEntity<List<Task>> getStudentTasks(@PathVariable Long studentId) {
        List<Task> tasks = taskRepository.findByStudentId(studentId);
        return ResponseEntity.ok(tasks);
    }

    @PutMapping("/tasks/{taskId}/response")
    public ResponseEntity<?> updateTaskResponse(@PathVariable Long taskId, @RequestBody Map<String, String> request) {
        Optional<Task> taskOpt = taskRepository.findById(taskId);
        Map<String, String> response = new HashMap<>();
        
        if (taskOpt.isPresent()) {
            Task task = taskOpt.get();
            task.setResponse(request.get("response"));
            if (task.getStatus() == Task.Status.PENDING) {
                task.setStatus(Task.Status.IN_PROGRESS);
            }
            taskRepository.save(task);
            response.put("message", "Task response updated successfully");
            return ResponseEntity.ok(response);
        }
        
        response.put("message", "Task not found");
        return ResponseEntity.badRequest().body(response);
    }

    @PutMapping("/tasks/{taskId}/complete")
    public ResponseEntity<?> completeTask(@PathVariable Long taskId) {
        Optional<Task> taskOpt = taskRepository.findById(taskId);
        Map<String, String> response = new HashMap<>();
        
        if (taskOpt.isPresent()) {
            Task task = taskOpt.get();
            task.setStatus(Task.Status.COMPLETED);
            taskRepository.save(task);
            response.put("message", "Task marked as completed");
            return ResponseEntity.ok(response);
        }
        
        response.put("message", "Task not found");
        return ResponseEntity.badRequest().body(response);
    }

    @GetMapping("/dashboard-stats/{studentId}")
    public ResponseEntity<?> getDashboardStats(@PathVariable Long studentId) {
        Map<String, Object> stats = new HashMap<>();
        stats.put("activeTasks", taskRepository.countByStudentIdAndStatus(studentId, Task.Status.PENDING) + 
                                 taskRepository.countByStudentIdAndStatus(studentId, Task.Status.IN_PROGRESS));
        stats.put("completedTasks", taskRepository.countByStudentIdAndStatus(studentId, Task.Status.COMPLETED));
        stats.put("totalTasks", taskRepository.countByStudentId(studentId));
        return ResponseEntity.ok(stats);
    }
}
