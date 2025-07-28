package com.example.taskmanager.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Subtask {
    @Id
    private String id;

    private String title;
    private boolean completed;
}