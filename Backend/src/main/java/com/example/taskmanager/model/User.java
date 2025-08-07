package com.example.taskmanager.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.PENDING;

    // Student-specific fields
    @Column(name = "student_id")
    private String studentId;

    private String phone;
    private String university;
    private String major;
    
    @Column(name = "academic_year")
    private String academicYear;

    // Application files
    @Column(name = "cv_file_path")
    private String cvFilePath;
    
    @Column(name = "cv_file_name")
    private String cvFileName;
    
    @Column(name = "motivation_file_path")
    private String motivationFilePath;
    
    @Column(name = "motivation_file_name")
    private String motivationFileName;

    // Document completion files
    @Column(name = "transcript_file_path")
    private String transcriptFilePath;
    
    @Column(name = "transcript_file_name")
    private String transcriptFileName;
    
    @Column(name = "recommendation_file_path")
    private String recommendationFilePath;
    
    @Column(name = "recommendation_file_name")
    private String recommendationFileName;
    
    @Column(name = "portfolio_file_path")
    private String portfolioFilePath;
    
    @Column(name = "portfolio_file_name")
    private String portfolioFileName;

    @Column(name = "documents_completed")
    private Boolean documentsCompleted = false;

    // Supervisor-specific fields
    private String department;

    // Assignment relationship
    @Column(name = "supervisor_id")
    private Long supervisorId;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum Role {
        STUDENT, ENCADREUR, ADMIN
    }

    public enum Status {
        PENDING, APPROVED, REJECTED, DOCUMENTS_PENDING, READY_FOR_ASSIGNMENT
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Constructors
    public User() {}

    public User(String name, String email, String password, Role role) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getUniversity() { return university; }
    public void setUniversity(String university) { this.university = university; }

    public String getMajor() { return major; }
    public void setMajor(String major) { this.major = major; }

    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }

    public String getCvFilePath() { return cvFilePath; }
    public void setCvFilePath(String cvFilePath) { this.cvFilePath = cvFilePath; }

    public String getCvFileName() { return cvFileName; }
    public void setCvFileName(String cvFileName) { this.cvFileName = cvFileName; }

    public String getMotivationFilePath() { return motivationFilePath; }
    public void setMotivationFilePath(String motivationFilePath) { this.motivationFilePath = motivationFilePath; }

    public String getMotivationFileName() { return motivationFileName; }
    public void setMotivationFileName(String motivationFileName) { this.motivationFileName = motivationFileName; }

    public String getTranscriptFilePath() { return transcriptFilePath; }
    public void setTranscriptFilePath(String transcriptFilePath) { this.transcriptFilePath = transcriptFilePath; }

    public String getTranscriptFileName() { return transcriptFileName; }
    public void setTranscriptFileName(String transcriptFileName) { this.transcriptFileName = transcriptFileName; }

    public String getRecommendationFilePath() { return recommendationFilePath; }
    public void setRecommendationFilePath(String recommendationFilePath) { this.recommendationFilePath = recommendationFilePath; }

    public String getRecommendationFileName() { return recommendationFileName; }
    public void setRecommendationFileName(String recommendationFileName) { this.recommendationFileName = recommendationFileName; }

    public String getPortfolioFilePath() { return portfolioFilePath; }
    public void setPortfolioFilePath(String portfolioFilePath) { this.portfolioFilePath = portfolioFilePath; }

    public String getPortfolioFileName() { return portfolioFileName; }
    public void setPortfolioFileName(String portfolioFileName) { this.portfolioFileName = portfolioFileName; }

    public Boolean getDocumentsCompleted() { return documentsCompleted; }
    public void setDocumentsCompleted(Boolean documentsCompleted) { this.documentsCompleted = documentsCompleted; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public Long getSupervisorId() { return supervisorId; }
    public void setSupervisorId(Long supervisorId) { this.supervisorId = supervisorId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
