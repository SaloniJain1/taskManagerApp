package com.taskmanager.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entity representing a Task in the system.
 * Uses manual ID assignment.
 */
@Entity
@Table(name = "tasks")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Task {
    /** Unique manually assigned identifier. */
    @Id
    private Long id;

    /** Brief title of the task. */
    private String title;

    /** Detailed description of the task. */
    private String description;

    /** Completion status indicator. */
    private boolean completed;

    /** Scheduled date and time for the task. */
    private LocalDateTime dueDate;
}
