package com.example.taskmanager.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private LocalDate dueDate;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Status status = Status.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Priority priority = Priority.MEDIUM;

    private String category;

    @Column(columnDefinition = "TEXT")
    private String response;

    private String grade;

    @Column(columnDefinition = "TEXT")
    private String feedback;

    private Long studentId;

    private Long supervisorId;

    // File attachment fields
    private String attachmentFileName;
    private String attachmentFilePath;
    private String attachmentFileType;
    private Long attachmentFileSize;

    // Student response file attachment fields
    private String responseFileName;
    private String responseFilePath;
    private String responseFileType;
    private Long responseFileSize;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum Status {
        PENDING, IN_PROGRESS, COMPLETED, OVERDUE
    }

    public enum Priority {
        LOW, MEDIUM, HIGH, URGENT
    }

    // Constructors
    public Task() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getResponse() { return response; }
    public void setResponse(String response) { this.response = response; }

    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }

    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public Long getSupervisorId() { return supervisorId; }
    public void setSupervisorId(Long supervisorId) { this.supervisorId = supervisorId; }

    // File attachment getters and setters
    public String getAttachmentFileName() { return attachmentFileName; }
    public void setAttachmentFileName(String attachmentFileName) { this.attachmentFileName = attachmentFileName; }

    public String getAttachmentFilePath() { return attachmentFilePath; }
    public void setAttachmentFilePath(String attachmentFilePath) { this.attachmentFilePath = attachmentFilePath; }

    public String getAttachmentFileType() { return attachmentFileType; }
    public void setAttachmentFileType(String attachmentFileType) { this.attachmentFileType = attachmentFileType; }

    public Long getAttachmentFileSize() { return attachmentFileSize; }
    public void setAttachmentFileSize(Long attachmentFileSize) { this.attachmentFileSize = attachmentFileSize; }

    // Student response file getters and setters
    public String getResponseFileName() { return responseFileName; }
    public void setResponseFileName(String responseFileName) { this.responseFileName = responseFileName; }

    public String getResponseFilePath() { return responseFilePath; }
    public void setResponseFilePath(String responseFilePath) { this.responseFilePath = responseFilePath; }

    public String getResponseFileType() { return responseFileType; }
    public void setResponseFileType(String responseFileType) { this.responseFileType = responseFileType; }

    public Long getResponseFileSize() { return responseFileSize; }
    public void setResponseFileSize(Long responseFileSize) { this.responseFileSize = responseFileSize; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
