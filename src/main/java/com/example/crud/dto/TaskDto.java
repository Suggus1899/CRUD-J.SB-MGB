package com.example.crud.dto;

import com.example.crud.model.ChangeRecord;
import com.example.crud.model.Comment;
import com.example.crud.model.Priority;
import com.example.crud.model.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskDto {

    private String id;
    private String title;
    private String description;
    private TaskStatus status;
    private Priority priority;
    private List<String> tags;
    private LocalDate dueDate;
    private String userId;
    private List<Comment> comments;
    private List<ChangeRecord> history;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
