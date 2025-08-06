package com.example.taskmanager.controller;

import com.example.taskmanager.model.User;
import com.example.taskmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

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
                return ResponseEntity.ok(response);
            }
        }

        Map<String, String> error = new HashMap<>();
        error.put("message", "Invalid email or password");
        return ResponseEntity.badRequest().body(error);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> signupRequest) {
        Map<String, String> response = new HashMap<>();

        String email = signupRequest.get("email");
        String studentId = signupRequest.get("studentId");

        if (userRepository.existsByEmail(email)) {
            response.put("message", "Email is already in use!");
            return ResponseEntity.badRequest().body(response);
        }

        if (userRepository.existsByStudentId(studentId)) {
            response.put("message", "Student ID is already in use!");
            return ResponseEntity.badRequest().body(response);
        }

        User user = new User();
        user.setName(signupRequest.get("name"));
        user.setEmail(email);
        user.setPassword(signupRequest.get("password"));
        user.setStudentId(studentId);
        user.setRole(User.Role.STUDENT);
        user.setStatus(User.Status.PENDING);

        userRepository.save(user);

        response.put("message", "User registered successfully! Please wait for admin approval.");
        return ResponseEntity.ok(response);
    }
}
