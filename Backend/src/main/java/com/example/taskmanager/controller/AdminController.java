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
        try {
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalStudents", userRepository.countApprovedStudents());
            stats.put("totalSupervisors", userRepository.countSupervisors());
            stats.put("pendingApprovals", userRepository.countPendingStudents());
            stats.put("completedTasks", taskRepository.countCompletedTasks());
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            System.err.println("Error getting dashboard stats: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error getting dashboard stats");
        }
    }

    @GetMapping("/pending-students")
    public ResponseEntity<List<User>> getPendingStudents() {
        try {
            List<User> pendingStudents = userRepository.findByRoleAndStatus(User.Role.STUDENT, User.Status.PENDING);
            return ResponseEntity.ok(pendingStudents);
        } catch (Exception e) {
            System.err.println("Error getting pending students: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/approved-students")
    public ResponseEntity<List<User>> getApprovedStudents() {
        try {
            List<User> approvedStudents = userRepository.findByRoleAndStatus(User.Role.STUDENT, User.Status.APPROVED);
            return ResponseEntity.ok(approvedStudents);
        } catch (Exception e) {
            System.err.println("Error getting approved students: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/documents-incomplete-students")
    public ResponseEntity<List<User>> getDocumentsIncompleteStudents() {
        try {
            List<User> documentsIncompleteStudents = userRepository.findByRoleAndStatus(User.Role.STUDENT, User.Status.DOCUMENTS_PENDING);
            return ResponseEntity.ok(documentsIncompleteStudents);
        } catch (Exception e) {
            System.err.println("Error getting documents incomplete students: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/ready-students")
    public ResponseEntity<List<User>> getReadyStudents() {
        try {
            List<User> readyStudents = userRepository.findByRoleAndStatus(User.Role.STUDENT, User.Status.READY_FOR_ASSIGNMENT);
            return ResponseEntity.ok(readyStudents);
        } catch (Exception e) {
            System.err.println("Error getting ready students: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/approve-student/{studentId}")
    public ResponseEntity<?> approveStudent(@PathVariable Long studentId) {
        try {
            Optional<User> userOpt = userRepository.findById(studentId);
            Map<String, String> response = new HashMap<>();
            
            if (userOpt.isPresent()) {
                User student = userOpt.get();
                student.setStatus(User.Status.DOCUMENTS_PENDING);
                userRepository.save(student);
                response.put("message", "Student approved successfully");
                return ResponseEntity.ok(response);
            } else {
                response.put("message", "Student not found");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            System.err.println("Error approving student: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error approving student: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @PostMapping("/reject-student/{studentId}")
    public ResponseEntity<?> rejectStudent(@PathVariable Long studentId) {
        try {
            Optional<User> userOpt = userRepository.findById(studentId);
            Map<String, String> response = new HashMap<>();
            
            if (userOpt.isPresent()) {
                User student = userOpt.get();
                student.setStatus(User.Status.REJECTED);
                userRepository.save(student);
                response.put("message", "Student rejected successfully");
                return ResponseEntity.ok(response);
            } else {
                response.put("message", "Student not found");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            System.err.println("Error rejecting student: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error rejecting student: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("/supervisors")
    public ResponseEntity<List<User>> getSupervisors() {
        try {
            List<User> supervisors = userRepository.findByRole(User.Role.ENCADREUR);
            return ResponseEntity.ok(supervisors);
        } catch (Exception e) {
            System.err.println("Error getting supervisors: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/add-supervisor")
    public ResponseEntity<?> addSupervisor(@RequestBody User supervisor) {
        try {
            supervisor.setRole(User.Role.ENCADREUR);
            supervisor.setStatus(User.Status.APPROVED);
            User savedSupervisor = userRepository.save(supervisor);
            return ResponseEntity.ok(savedSupervisor);
        } catch (Exception e) {
            System.err.println("Error adding supervisor: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error adding supervisor: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
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

    @DeleteMapping("/delete-supervisor/{supervisorId}")
    public ResponseEntity<?> deleteSupervisor(@PathVariable Long supervisorId) {
        try {
            Optional<User> userOpt = userRepository.findById(supervisorId);
            Map<String, String> response = new HashMap<>();
            
            if (userOpt.isPresent()) {
                userRepository.deleteById(supervisorId);
                response.put("message", "Supervisor deleted successfully");
                return ResponseEntity.ok(response);
            } else {
                response.put("message", "Supervisor not found");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            System.err.println("Error deleting supervisor: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error deleting supervisor: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("/student-assignments")
    public ResponseEntity<List<User>> getStudentAssignments() {
        try {
            List<User> readyStudents = userRepository.findByRoleAndStatus(User.Role.STUDENT, User.Status.READY_FOR_ASSIGNMENT);
            List<User> assignedStudents = userRepository.findByRoleAndStatus(User.Role.STUDENT, User.Status.APPROVED);
            readyStudents.addAll(assignedStudents);
            return ResponseEntity.ok(readyStudents);
        } catch (Exception e) {
            System.err.println("Error getting student assignments: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/assign-student")
    public ResponseEntity<?> assignStudentToSupervisor(@RequestBody Map<String, Long> assignmentData) {
        try {
            Long studentId = assignmentData.get("studentId");
            Long supervisorId = assignmentData.get("supervisorId");
            
            Optional<User> studentOpt = userRepository.findById(studentId);
            Optional<User> supervisorOpt = userRepository.findById(supervisorId);
            
            Map<String, String> response = new HashMap<>();
            
            if (studentOpt.isPresent() && supervisorOpt.isPresent()) {
                User student = studentOpt.get();
                student.setSupervisorId(supervisorId);
                student.setStatus(User.Status.APPROVED); // Change status to APPROVED after assignment
                userRepository.save(student);
                
                response.put("message", "Student assigned to supervisor successfully");
                return ResponseEntity.ok(response);
            } else {
                response.put("message", "Student or supervisor not found");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            System.err.println("Error assigning student: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error assigning student: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}
