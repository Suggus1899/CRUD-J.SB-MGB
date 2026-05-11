package com.example.crud.service;

import com.example.crud.dto.TaskDto;
import com.example.crud.dto.TaskRequest;
import com.example.crud.exception.ResourceNotFoundException;
import com.example.crud.exception.UnauthorizedException;
import com.example.crud.model.*;
import com.example.crud.repository.TaskRepository;
import com.example.crud.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@SuppressWarnings("null")
@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskDto createTask(TaskRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(request.getStatus() != null ? request.getStatus() : TaskStatus.PENDING)
                .priority(request.getPriority() != null ? request.getPriority() : Priority.MEDIUM)
                .tags(request.getTags() != null ? request.getTags() : List.of())
                .dueDate(request.getDueDate())
                .userId(user.getId())
                .build();

        return toDto(taskRepository.save(task));
    }

    public Page<TaskDto> getTasks(String username, TaskStatus status, Priority priority,
            String tag, boolean overdue, Pageable pageable) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String userId = user.getId();

        if (tag != null && !tag.isBlank()) {
            return taskRepository.findByUserIdAndTagsContaining(userId, tag, pageable).map(this::toDto);
        }
        if (status != null && priority != null) {
            return taskRepository.findByUserIdAndStatusAndPriority(userId, status, priority, pageable).map(this::toDto);
        }
        if (status != null) {
            return taskRepository.findByUserIdAndStatus(userId, status, pageable).map(this::toDto);
        }
        if (priority != null) {
            return taskRepository.findByUserIdAndPriority(userId, priority, pageable).map(this::toDto);
        }

        return taskRepository.findByUserId(userId, pageable).map(this::toDto);
    }

    public List<Task> getOverdueTasks(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return taskRepository.findOverdueTasks(user.getId(), LocalDate.now());
    }

    public TaskDto getTaskById(String id, String username) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", id));
        validateOwnership(task, username);
        return toDto(task);
    }

    public TaskDto updateTask(String id, TaskRequest request, String username) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", id));
        validateOwnership(task, username);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (request.getStatus() != null && !request.getStatus().equals(task.getStatus())) {
            task.getHistory().add(ChangeRecord.builder()
                    .field("status")
                    .oldValue(task.getStatus().name())
                    .newValue(request.getStatus().name())
                    .changedBy(user.getId())
                    .build());
            task.setStatus(request.getStatus());
        }

        if (request.getPriority() != null && !request.getPriority().equals(task.getPriority())) {
            task.getHistory().add(ChangeRecord.builder()
                    .field("priority")
                    .oldValue(task.getPriority().name())
                    .newValue(request.getPriority().name())
                    .changedBy(user.getId())
                    .build());
            task.setPriority(request.getPriority());
        }

        if (request.getTitle() != null)
            task.setTitle(request.getTitle());
        if (request.getDescription() != null)
            task.setDescription(request.getDescription());
        if (request.getTags() != null)
            task.setTags(request.getTags());
        if (request.getDueDate() != null)
            task.setDueDate(request.getDueDate());

        task.setUpdatedAt(LocalDateTime.now());

        return toDto(taskRepository.save(task));
    }

    public void deleteTask(String id, String username) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", id));
        validateOwnership(task, username);
        taskRepository.deleteById(id);
    }

    public List<ChangeRecord> getHistory(String id, String username) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", id));
        validateOwnership(task, username);
        return task.getHistory();
    }

    private void validateOwnership(Task task, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getRole() == Role.ADMIN)
            return;

        if (!task.getUserId().equals(user.getId())) {
            throw new UnauthorizedException("You don't have permission to access this task");
        }
    }

    public TaskDto toDto(Task task) {
        return TaskDto.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .priority(task.getPriority())
                .tags(task.getTags())
                .dueDate(task.getDueDate())
                .userId(task.getUserId())
                .comments(task.getComments())
                .history(task.getHistory())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }
}
