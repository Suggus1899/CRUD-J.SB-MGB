package com.example.crud.dto;

import com.example.crud.model.Priority;
import com.example.crud.model.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class TaskRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 100, message = "Title must not exceed 100 characters")
    private String title;

    private String description;

    private TaskStatus status;

    private Priority priority;

    private List<String> tags;

    private LocalDate dueDate;
}
