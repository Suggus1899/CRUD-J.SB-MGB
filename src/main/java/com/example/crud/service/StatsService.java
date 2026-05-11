package com.example.crud.service;

import com.example.crud.dto.StatsDto;
import com.example.crud.exception.ResourceNotFoundException;
import com.example.crud.model.*;
import com.example.crud.repository.TaskRepository;
import com.example.crud.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatsService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public StatsDto getMyStats(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Task> tasks = taskRepository.findAll().stream()
                .filter(t -> t.getUserId().equals(user.getId()))
                .collect(Collectors.toList());

        return buildStats(tasks);
    }

    public StatsDto getGlobalStats() {
        List<Task> tasks = taskRepository.findAll();
        return buildStats(tasks);
    }

    private StatsDto buildStats(List<Task> tasks) {
        Map<String, Long> byStatus = tasks.stream()
                .collect(Collectors.groupingBy(t -> t.getStatus().name(), Collectors.counting()));

        Map<String, Long> byPriority = tasks.stream()
                .collect(Collectors.groupingBy(t -> t.getPriority().name(), Collectors.counting()));

        long overdue = tasks.stream()
                .filter(t -> t.getDueDate() != null
                        && t.getDueDate().isBefore(LocalDate.now())
                        && t.getStatus() != TaskStatus.COMPLETED)
                .count();

        return StatsDto.builder()
                .totalTasks(tasks.size())
                .byStatus(byStatus)
                .byPriority(byPriority)
                .overdueTasks(overdue)
                .completedTasks(byStatus.getOrDefault(TaskStatus.COMPLETED.name(), 0L))
                .pendingTasks(byStatus.getOrDefault(TaskStatus.PENDING.name(), 0L))
                .inProgressTasks(byStatus.getOrDefault(TaskStatus.IN_PROGRESS.name(), 0L))
                .build();
    }
}
