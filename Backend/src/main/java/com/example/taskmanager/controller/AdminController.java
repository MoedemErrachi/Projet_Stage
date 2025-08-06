package com.example.taskmanager.controller;

import com.example.taskmanager.model.User;
import com.example.taskmanager.repository.UserRepository;
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
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaskRepository taskRepository;

    @GetMapping("/dashboard-stats")
    public ResponseEntity<?> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalStudents", userRepository.countApprovedStudents());
        stats.put("totalSupervisors", userRepository.countSupervisors());
        stats.put("pendingApprovals", userRepository.countPendingStudents());
        stats.put("completedTasks", taskRepository.countCompletedTasks());
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/pending-students")
    public ResponseEntity<List<User>> getPendingStudents() {
        List<User> pendingStudents = userRepository.findByRoleAndStatus(User.Role.STUDENT, User.Status.PENDING);
        return ResponseEntity.ok(pendingStudents);
    }

    @GetMapping("/approved-students")
    public ResponseEntity<List<User>> getApprovedStudents() {
        List<User> approvedStudents = userRepository.findByRoleAndStatus(User.Role.STUDENT, User.Status.APPROVED);
        return ResponseEntity.ok(approvedStudents);
    }

    @PostMapping("/approve-student/{id}")
    public ResponseEntity<?> approveStudent(@PathVariable Long id) {
        Optional<User> userOpt = userRepository.findById(id);
        Map<String, String> response = new HashMap<>();
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setStatus(User.Status.APPROVED);
            userRepository.save(user);
            response.put("message", "Student approved successfully");
            return ResponseEntity.ok(response);
        }
        
        response.put("message", "Student not found");
        return ResponseEntity.badRequest().body(response);
    }

    @PostMapping("/reject-student/{id}")
    public ResponseEntity<?> rejectStudent(@PathVariable Long id) {
        Optional<User> userOpt = userRepository.findById(id);
        Map<String, String> response = new HashMap<>();
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setStatus(User.Status.REJECTED);
            userRepository.save(user);
            response.put("message", "Student rejected successfully");
            return ResponseEntity.ok(response);
        }
        
        response.put("message", "Student not found");
        return ResponseEntity.badRequest().body(response);
    }

    @GetMapping("/supervisors")
    public ResponseEntity<List<User>> getSupervisors() {
        List<User> supervisors = userRepository.findByRole(User.Role.ENCADREUR);
        return ResponseEntity.ok(supervisors);
    }

    @PostMapping("/add-supervisor")
    public ResponseEntity<?> addSupervisor(@RequestBody Map<String, String> supervisorData) {
        Map<String, String> response = new HashMap<>();

        if (userRepository.existsByEmail(supervisorData.get("email"))) {
            response.put("message", "Email is already in use!");
            return ResponseEntity.badRequest().body(response);
        }

        User supervisor = new User();
        supervisor.setName(supervisorData.get("name"));
        supervisor.setEmail(supervisorData.get("email"));
        supervisor.setPassword("password123");
        supervisor.setRole(User.Role.ENCADREUR);
        supervisor.setDepartment(supervisorData.get("department"));
        supervisor.setStatus(User.Status.APPROVED);

        userRepository.save(supervisor);
        response.put("message", "Supervisor added successfully");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/update-supervisor/{id}")
    public ResponseEntity<?> updateSupervisor(@PathVariable Long id, @RequestBody Map<String, String> supervisorData) {
        Optional<User> userOpt = userRepository.findById(id);
        Map<String, String> response = new HashMap<>();
        
        if (userOpt.isPresent()) {
            User supervisor = userOpt.get();
            supervisor.setName(supervisorData.get("name"));
            supervisor.setEmail(supervisorData.get("email"));
            supervisor.setDepartment(supervisorData.get("department"));
            userRepository.save(supervisor);
            response.put("message", "Supervisor updated successfully");
            return ResponseEntity.ok(response);
        }
        
        response.put("message", "Supervisor not found");
        return ResponseEntity.badRequest().body(response);
    }

    @DeleteMapping("/delete-supervisor/{id}")
    public ResponseEntity<?> deleteSupervisor(@PathVariable Long id) {
        Optional<User> userOpt = userRepository.findById(id);
        Map<String, String> response = new HashMap<>();
        
        if (userOpt.isPresent()) {
            userRepository.deleteById(id);
            response.put("message", "Supervisor deleted successfully");
            return ResponseEntity.ok(response);
        }
        
        response.put("message", "Supervisor not found");
        return ResponseEntity.badRequest().body(response);
    }

    // NEW: Assign student to supervisor
    @PostMapping("/assign-student")
    public ResponseEntity<?> assignStudentToSupervisor(@RequestBody Map<String, Long> assignmentData) {
        Map<String, String> response = new HashMap<>();
        
        Long studentId = assignmentData.get("studentId");
        Long supervisorId = assignmentData.get("supervisorId");
        
        Optional<User> studentOpt = userRepository.findById(studentId);
        Optional<User> supervisorOpt = userRepository.findById(supervisorId);
        
        if (studentOpt.isPresent() && supervisorOpt.isPresent()) {
            User student = studentOpt.get();
            student.setSupervisorId(supervisorId);
            userRepository.save(student);
            response.put("message", "Student assigned to supervisor successfully");
            return ResponseEntity.ok(response);
        }
        
        response.put("message", "Student or supervisor not found");
        return ResponseEntity.badRequest().body(response);
    }

    // NEW: Get students with their supervisor assignments
    @GetMapping("/student-assignments")
    public ResponseEntity<?> getStudentAssignments() {
        List<User> students = userRepository.findByRoleAndStatus(User.Role.STUDENT, User.Status.APPROVED);
        List<User> supervisors = userRepository.findByRole(User.Role.ENCADREUR);
        
        Map<String, Object> response = new HashMap<>();
        response.put("students", students);
        response.put("supervisors", supervisors);
        
        return ResponseEntity.ok(response);
    }
}
