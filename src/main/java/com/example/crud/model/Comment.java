package com.example.crud.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Comment {

    @Builder.Default
    private String id = UUID.randomUUID().toString();

    private String authorId;

    private String text;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
