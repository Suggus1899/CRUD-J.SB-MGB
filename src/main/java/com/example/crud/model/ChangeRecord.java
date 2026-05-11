package com.example.crud.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChangeRecord {

    private String field;
    private String oldValue;
    private String newValue;
    private String changedBy;

    @Builder.Default
    private LocalDateTime changedAt = LocalDateTime.now();
}
