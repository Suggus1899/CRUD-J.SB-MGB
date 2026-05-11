package com.example.crud.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatsDto {

    private long totalTasks;
    private Map<String, Long> byStatus;
    private Map<String, Long> byPriority;
    private long overdueTasks;
    private long completedTasks;
    private long pendingTasks;
    private long inProgressTasks;
}
