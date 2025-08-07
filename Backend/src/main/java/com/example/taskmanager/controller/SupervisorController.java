package com.example.taskmanager.controller;

import com.example.taskmanager.model.Task;
import com.example.taskmanager.model.User;
import com.example.taskmanager.repository.TaskRepository;
import com.example.taskmanager.repository.UserRepository;
import com.example.taskmanager.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/supervisor")
public class SupervisorController {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @GetMapping("/tasks/{supervisorId}")
    public ResponseEntity<List<Task>> getSupervisorTasks(@PathVariable Long supervisorId) {
        List<Task> tasks = taskRepository.findBySupervisorId(supervisorId);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/students/{supervisorId}")
    public ResponseEntity<List<User>> getSupervisorStudents(@PathVariable Long supervisorId) {
        List<User> students = userRepository.findBySupervisorId(supervisorId);
        return ResponseEntity.ok(students);
    }

    @PostMapping("/tasks")
    public ResponseEntity<?> createTask(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("dueDate") String dueDate,
            @RequestParam("studentId") Long studentId,
            @RequestParam("supervisorId") Long supervisorId,
            @RequestParam("priority") String priority,
            @RequestParam("category") String category,
            @RequestParam(value = "file", required = false) MultipartFile file) {
        
        Map<String, String> response = new HashMap<>();
        
        try {
            Task task = new Task();
            task.setTitle(title);
            task.setDescription(description);
            task.setDueDate(LocalDate.parse(dueDate));
            task.setStudentId(studentId);
            task.setSupervisorId(supervisorId);
            task.setPriority(Task.Priority.valueOf(priority.toUpperCase()));
            task.setCategory(category);
            task.setStatus(Task.Status.PENDING);
            
            // Handle file upload if present
            if (file != null && !file.isEmpty()) {
                try {
                    String storedFileName = fileStorageService.storeFile(file, "task");
                    task.setAttachmentFileName(file.getOriginalFilename());
                    task.setAttachmentFilePath(storedFileName); // Store the safe filename
                    task.setAttachmentFileType(file.getContentType());
                    task.setAttachmentFileSize(file.getSize());
                    
                    System.out.println("Task file uploaded: " + file.getOriginalFilename() + " -> " + storedFileName);
                } catch (Exception e) {
                    e.printStackTrace();
                    response.put("message", "Error uploading file: " + e.getMessage());
                    return ResponseEntity.badRequest().body(response);
                }
            }
            
            taskRepository.save(task);
            response.put("message", "Task created successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            response.put("message", "Error creating task: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PutMapping("/tasks/{taskId}/grade")
    public ResponseEntity<?> gradeTask(@PathVariable Long taskId, @RequestBody Map<String, String> gradeData) {
        Optional<Task> taskOpt = taskRepository.findById(taskId);
        Map<String, String> response = new HashMap<>();
        
        if (taskOpt.isPresent()) {
            Task task = taskOpt.get();
            task.setGrade(gradeData.get("grade"));
            task.setFeedback(gradeData.get("feedback"));
            taskRepository.save(task);
            response.put("message", "Task graded successfully");
            return ResponseEntity.ok(response);
        }
        
        response.put("message", "Task not found");
        return ResponseEntity.badRequest().body(response);
    }

    @GetMapping("/dashboard-stats/{supervisorId}")
    public ResponseEntity<?> getDashboardStats(@PathVariable Long supervisorId) {
        Map<String, Object> stats = new HashMap<>();
        
        // Get students assigned to this supervisor
        List<User> assignedStudents = userRepository.findBySupervisorId(supervisorId);
        
        stats.put("totalStudents", assignedStudents.size());
        stats.put("totalTasks", taskRepository.countBySupervisorId(supervisorId));
        stats.put("pendingTasks", taskRepository.countBySupervisorIdAndStatus(supervisorId, Task.Status.PENDING));
        stats.put("completedTasks", taskRepository.countBySupervisorIdAndStatus(supervisorId, Task.Status.COMPLETED));
        
        return ResponseEntity.ok(stats);
    }
}
