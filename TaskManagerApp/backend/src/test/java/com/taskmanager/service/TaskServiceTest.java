package com.taskmanager.service;

import com.taskmanager.dto.TaskRequestDTO;
import com.taskmanager.dto.TaskResponseDTO;
import com.taskmanager.model.Task;
import com.taskmanager.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private TaskService taskService;

    private TaskRequestDTO requestDTO;
    private Task task;

    @BeforeEach
    void setUp() {
        requestDTO = TaskRequestDTO.builder()
                .id(100L)
                .title("Test Task")
                .description("Test Description")
                .completed(false)
                .dueDate(LocalDateTime.now())
                .build();

        task = Task.builder()
                .id(100L)
                .title("Test Task")
                .description("Test Description")
                .completed(false)
                .dueDate(requestDTO.getDueDate())
                .build();
    }

    @Test
    void createTask_Success() {
        when(taskRepository.existsById(100L)).thenReturn(false);
        when(taskRepository.save(any(Task.class))).thenReturn(task);

        TaskResponseDTO result = taskService.createTask(requestDTO);

        assertNotNull(result);
        assertEquals(100L, result.getId());
        verify(taskRepository).save(any(Task.class));
    }

    @Test
    void createTask_DuplicateId_ThrowsException() {
        when(taskRepository.existsById(100L)).thenReturn(true);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            taskService.createTask(requestDTO);
        });

        assertTrue(exception.getMessage().contains("already exists with this ID"));
        verify(taskRepository, never()).save(any(Task.class));
    }

    @Test
    void getTaskById_Success() {
        when(taskRepository.findById(100L)).thenReturn(Optional.of(task));

        TaskResponseDTO result = taskService.getTaskById(100L);

        assertNotNull(result);
        assertEquals(100L, result.getId());
    }

    @Test
    void getTaskById_NotFound_ThrowsException() {
        when(taskRepository.findById(100L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            taskService.getTaskById(100L);
        });

        assertTrue(exception.getMessage().contains("Task not found"));
    }

    @Test
    void updateTask_Success() {
        when(taskRepository.findById(100L)).thenReturn(Optional.of(task));
        when(taskRepository.save(any(Task.class))).thenReturn(task);

        TaskResponseDTO result = taskService.updateTask(100L, requestDTO);

        assertNotNull(result);
        assertEquals(100L, result.getId());
        verify(taskRepository).save(any(Task.class));
    }

    @Test
    void deleteTask_Success() {
        doNothing().when(taskRepository).deleteById(100L);

        taskService.deleteTask(100L);

        verify(taskRepository).deleteById(100L);
    }
}
