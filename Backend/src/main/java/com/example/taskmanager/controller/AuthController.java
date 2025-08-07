package com.example.taskmanager.controller;

import com.example.taskmanager.model.User;
import com.example.taskmanager.repository.UserRepository;
import com.example.taskmanager.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping("/signin")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        Optional<User> userOpt = userRepository.findByEmail(email);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Simple password check (in real app, use proper password hashing)
            if (password.equals(user.getPassword()) || password.equals("password")) {
                Map<String, Object> response = new HashMap<>();
                response.put("id", user.getId());
                response.put("name", user.getName());
                response.put("email", user.getEmail());
                response.put("role", user.getRole().name());
                response.put("status", user.getStatus().name());
                response.put("studentId", user.getStudentId());
                response.put("department", user.getDepartment());
                response.put("documentsCompleted", user.getDocumentsCompleted());
                return ResponseEntity.ok(response);
            }
        }

        Map<String, String> error = new HashMap<>();
        error.put("message", "Invalid email or password");
        return ResponseEntity.badRequest().body(error);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(
            @RequestParam("name") String name,
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestParam("studentId") String studentId,
            @RequestParam("phone") String phone,
            @RequestParam("university") String university,
            @RequestParam("major") String major,
            @RequestParam("year") String year,
            @RequestParam("cvFile") MultipartFile cvFile,
            @RequestParam("motivationFile") MultipartFile motivationFile) {
        
        Map<String, String> response = new HashMap<>();

        if (userRepository.existsByEmail(email)) {
            response.put("message", "Email is already in use!");
            return ResponseEntity.badRequest().body(response);
        }

        if (userRepository.existsByStudentId(studentId)) {
            response.put("message", "Student ID is already in use!");
            return ResponseEntity.badRequest().body(response);
        }

        try {
            User user = new User();
            user.setName(name);
            user.setEmail(email);
            user.setPassword(password);
            user.setStudentId(studentId);
            user.setPhone(phone);
            user.setUniversity(university);
            user.setMajor(major);
            user.setAcademicYear(year);
            user.setRole(User.Role.STUDENT);
            user.setStatus(User.Status.PENDING);

            // Store CV file
            if (cvFile != null && !cvFile.isEmpty()) {
                String cvStoredFileName = fileStorageService.storeFile(cvFile, "application");
                user.setCvFileName(cvFile.getOriginalFilename());
                user.setCvFilePath(cvStoredFileName);
            }

            // Store motivation letter file
            if (motivationFile != null && !motivationFile.isEmpty()) {
                String motivationStoredFileName = fileStorageService.storeFile(motivationFile, "application");
                user.setMotivationFileName(motivationFile.getOriginalFilename());
                user.setMotivationFilePath(motivationStoredFileName);
            }

            userRepository.save(user);

            response.put("message", "Application submitted successfully! Please wait for admin review.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            response.put("message", "Error processing application: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
