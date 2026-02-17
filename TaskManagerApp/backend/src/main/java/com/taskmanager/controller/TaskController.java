package com.taskmanager.controller;

import com.taskmanager.dto.TaskRequestDTO;
import com.taskmanager.dto.TaskResponseDTO;
import com.taskmanager.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for managing tasks.
 * Provides endpoints for CRUD operations and filtering.
 */
@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // For development convenience
public class TaskController {
    private final TaskService taskService;

    /**
     * Retrieves a paginated list of all tasks, optionally filtered by completion
     * status.
     *
     * @param completed Optional filter for task completion status.
     * @param page      The page number to retrieve (default 0).
     * @param size      The number of tasks per page (default 10).
     * @param sort      Sorting criteria in format "field,direction" (default
     *                  "id,desc").
     * @return A page of TaskResponseDTOs.
     */
    @GetMapping
    public Page<TaskResponseDTO> getAllTasks(
            @RequestParam(required = false) Boolean completed,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,desc") String[] sort) {

        Sort.Direction direction = sort[1].equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sort[0]));

        return taskService.getAllTasks(completed, pageable);
    }

    /**
     * Retrieves a single task by its unique ID.
     *
     * @param id The ID of the task to retrieve.
     * @return The TaskResponseDTO for the requested task.
     * @throws RuntimeException if the task is not found.
     */
    @GetMapping("/{id}")
    public TaskResponseDTO getTaskById(@PathVariable Long id) {
        return taskService.getTaskById(id);
    }

    /**
     * Creates a new task with a manually assigned ID.
     *
     * @param taskRequest DTO containing task details and the mandatory ID.
     * @return The created TaskResponseDTO.
     * @throws IllegalArgumentException if ID is missing.
     * @throws RuntimeException         if a task with the same ID already exists.
     */
    @PostMapping
    @ResponseStatus(HttpStatus.ACCEPTED) // User requested 202
    public TaskResponseDTO createTask(@RequestBody TaskRequestDTO taskRequest) {
        return taskService.createTask(taskRequest);
    }

    /**
     * Updates an existing task.
     *
     * @param id          The ID of the task to update.
     * @param taskRequest DTO containing updated task details.
     * @return The updated TaskResponseDTO.
     * @throws RuntimeException if the task is not found.
     */
    @PutMapping("/{id}")
    public TaskResponseDTO updateTask(@PathVariable Long id, @RequestBody TaskRequestDTO taskRequest) {
        return taskService.updateTask(id, taskRequest);
    }

    /**
     * Deletes a task by its unique ID.
     *
     * @param id The ID of the task to delete.
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
    }
}
