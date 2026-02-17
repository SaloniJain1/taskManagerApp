package com.taskmanager.service;

import com.taskmanager.dto.TaskRequestDTO;
import com.taskmanager.dto.TaskResponseDTO;
import com.taskmanager.model.Task;
import com.taskmanager.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Service layer for Task operations.
 * Handles business logic, entity conversion, and repository interaction.
 */
@Service
@RequiredArgsConstructor
public class TaskService {
    private final TaskRepository taskRepository;

    /**
     * Retrieves all tasks with optional completion filtering and pagination.
     *
     * @param completed Optional Boolean to filter by completion status.
     * @param pageable  Pagination and sorting information.
     * @return A page of task response DTOs.
     */
    public Page<TaskResponseDTO> getAllTasks(Boolean completed, Pageable pageable) {
        Page<Task> taskPage;
        if (completed != null) {
            taskPage = taskRepository.findByCompleted(completed, pageable);
        } else {
            taskPage = taskRepository.findAll(pageable);
        }
        return taskPage.map(this::convertToResponseDTO);
    }

    /**
     * Retrieves a task by ID.
     *
     * @param id Unique identifier of the task.
     * @return Task details as a response DTO.
     * @throws RuntimeException if task is not found.
     */
    public TaskResponseDTO getTaskById(Long id) {
        return taskRepository.findById(id)
                .map(this::convertToResponseDTO)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));
    }

    /**
     * Creates a new task. Validates that the ID is provided and unique.
     *
     * @param request DTO containing task details and the manual ID.
     * @return The created task as a response DTO.
     * @throws IllegalArgumentException if ID is null.
     * @throws RuntimeException         if ID already exists.
     */
    @Transactional
    public TaskResponseDTO createTask(TaskRequestDTO request) {
        if (request.getId() == null) {
            throw new IllegalArgumentException("Task ID is mandatory.");
        }
        if (taskRepository.existsById(request.getId())) {
            throw new RuntimeException("A task already exists with this ID: " + request.getId());
        }
        Task task = convertToEntity(request);
        Task savedTask = taskRepository.save(task);
        return convertToResponseDTO(savedTask);
    }

    /**
     * Updates an existing task.
     *
     * @param id      ID of the task to update.
     * @param request DTO containing updated fields.
     * @return The updated task as a response DTO.
     * @throws IllegalArgumentException if ID in path and body mismatch.
     * @throws RuntimeException         if task is not found.
     */
    @Transactional
    public TaskResponseDTO updateTask(Long id, TaskRequestDTO request) {
        if (request.getId() != null && !id.equals(request.getId())) {
            throw new IllegalArgumentException("ID in request body does not match ID in path.");
        }

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setCompleted(request.isCompleted());
        task.setDueDate(request.getDueDate());

        Task updatedTask = taskRepository.save(task);
        return convertToResponseDTO(updatedTask);
    }

    /**
     * Deletes a task by ID.
     *
     * @param id ID of the task to delete.
     */
    @Transactional
    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

    private TaskResponseDTO convertToResponseDTO(Task task) {
        return TaskResponseDTO.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .completed(task.isCompleted())
                .dueDate(task.getDueDate())
                .build();
    }

    private Task convertToEntity(TaskRequestDTO request) {
        return Task.builder()
                .id(request.getId())
                .title(request.getTitle())
                .description(request.getDescription())
                .completed(request.isCompleted())
                .dueDate(request.getDueDate())
                .build();
    }
}
