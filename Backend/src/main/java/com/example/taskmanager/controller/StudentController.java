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

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @GetMapping("/tasks/{studentId}")
    public ResponseEntity<List<Task>> getStudentTasks(@PathVariable Long studentId) {
        try {
            List<Task> tasks = taskRepository.findByStudentId(studentId);
            return ResponseEntity.ok(tasks);
        } catch (Exception e) {
            System.err.println("Error fetching tasks: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/tasks/{taskId}/response")
    public ResponseEntity<?> updateTaskResponse(
            @PathVariable Long taskId,
            @RequestParam("response") String response,
            @RequestParam(value = "file", required = false) MultipartFile file) {
        
        Optional<Task> taskOpt = taskRepository.findById(taskId);
        Map<String, String> responseMap = new HashMap<>();
        
        if (taskOpt.isPresent()) {
            Task task = taskOpt.get();
            task.setResponse(response);
            
            // Handle file upload if present
            if (file != null && !file.isEmpty()) {
                try {
                    String storedFileName = fileStorageService.storeFile(file, "response");
                    task.setResponseFileName(file.getOriginalFilename());
                    task.setResponseFilePath(storedFileName);
                    task.setResponseFileType(file.getContentType());
                    task.setResponseFileSize(file.getSize());
                    
                    System.out.println("Response file uploaded: " + file.getOriginalFilename() + " -> " + storedFileName);
                } catch (Exception e) {
                    e.printStackTrace();
                    responseMap.put("message", "Error uploading file: " + e.getMessage());
                    return ResponseEntity.badRequest().body(responseMap);
                }
            }
            
            if (task.getStatus() == Task.Status.PENDING) {
                task.setStatus(Task.Status.IN_PROGRESS);
            }
            taskRepository.save(task);
            responseMap.put("message", "Task response updated successfully");
            return ResponseEntity.ok(responseMap);
        }
        
        responseMap.put("message", "Task not found");
        return ResponseEntity.badRequest().body(responseMap);
    }

    @PutMapping("/tasks/{taskId}/complete")
    public ResponseEntity<?> completeTask(
            @PathVariable Long taskId,
            @RequestParam("response") String response,
            @RequestParam(value = "file", required = false) MultipartFile file) {
        
        Optional<Task> taskOpt = taskRepository.findById(taskId);
        Map<String, String> responseMap = new HashMap<>();
        
        if (taskOpt.isPresent()) {
            Task task = taskOpt.get();
            task.setResponse(response);
            task.setStatus(Task.Status.COMPLETED);
            
            // Handle file upload if present
            if (file != null && !file.isEmpty()) {
                try {
                    String storedFileName = fileStorageService.storeFile(file, "response");
                    task.setResponseFileName(file.getOriginalFilename());
                    task.setResponseFilePath(storedFileName);
                    task.setResponseFileType(file.getContentType());
                    task.setResponseFileSize(file.getSize());
                    
                    System.out.println("Completion file uploaded: " + file.getOriginalFilename() + " -> " + storedFileName);
                } catch (Exception e) {
                    e.printStackTrace();
                    responseMap.put("message", "Error uploading file: " + e.getMessage());
                    return ResponseEntity.badRequest().body(responseMap);
                }
            }
            
            taskRepository.save(task);
            responseMap.put("message", "Task marked as completed");
            return ResponseEntity.ok(responseMap);
        }
        
        responseMap.put("message", "Task not found");
        return ResponseEntity.badRequest().body(responseMap);
    }

    @GetMapping("/dashboard-stats/{studentId}")
    public ResponseEntity<?> getDashboardStats(@PathVariable Long studentId) {
        try {
            Map<String, Object> stats = new HashMap<>();
            stats.put("activeTasks", taskRepository.countByStudentIdAndStatus(studentId, Task.Status.PENDING) + 
                                   taskRepository.countByStudentIdAndStatus(studentId, Task.Status.IN_PROGRESS));
            stats.put("completedTasks", taskRepository.countByStudentIdAndStatus(studentId, Task.Status.COMPLETED));
            stats.put("totalTasks", taskRepository.countByStudentId(studentId));
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            System.err.println("Error getting dashboard stats: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error getting dashboard stats");
        }
    }

    @PostMapping("/submit-documents/{studentId}")
    public ResponseEntity<?> submitDocuments(
            @PathVariable Long studentId,
            @RequestParam(value = "transcriptFile", required = false) MultipartFile transcriptFile,
            @RequestParam(value = "recommendationFile", required = false) MultipartFile recommendationFile,
            @RequestParam(value = "portfolioFile", required = false) MultipartFile portfolioFile) {
  
        Optional<User> userOpt = userRepository.findById(studentId);
        Map<String, String> response = new HashMap<>();
  
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            
            // Check if student is in the correct status for document submission
            if (user.getStatus() != User.Status.DOCUMENTS_PENDING) {
                response.put("message", "Student is not in the correct status for document submission");
                return ResponseEntity.badRequest().body(response);
            }
            
            try {
                // Store transcript file
                if (transcriptFile != null && !transcriptFile.isEmpty()) {
                    String transcriptStoredFileName = fileStorageService.storeFile(transcriptFile, "documents");
                    user.setTranscriptFileName(transcriptFile.getOriginalFilename());
                    user.setTranscriptFilePath(transcriptStoredFileName);
                }

                // Store recommendation file
                if (recommendationFile != null && !recommendationFile.isEmpty()) {
                    String recommendationStoredFileName = fileStorageService.storeFile(recommendationFile, "documents");
                    user.setRecommendationFileName(recommendationFile.getOriginalFilename());
                    user.setRecommendationFilePath(recommendationStoredFileName);
                }

                // Store portfolio file (optional)
                if (portfolioFile != null && !portfolioFile.isEmpty()) {
                    String portfolioStoredFileName = fileStorageService.storeFile(portfolioFile, "documents");
                    user.setPortfolioFileName(portfolioFile.getOriginalFilename());
                    user.setPortfolioFilePath(portfolioStoredFileName);
                }

                // Update status to ready for assignment
                user.setDocumentsCompleted(true);
                user.setStatus(User.Status.READY_FOR_ASSIGNMENT);
                userRepository.save(user);

                response.put("message", "Documents submitted successfully");
                return ResponseEntity.ok(response);
            } catch (Exception e) {
                e.printStackTrace();
                response.put("message", "Error storing documents: " + e.getMessage());
                return ResponseEntity.badRequest().body(response);
            }
        }
        
        response.put("message", "Student not found");
        return ResponseEntity.badRequest().body(response);
    }
}
