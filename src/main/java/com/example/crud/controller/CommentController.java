package com.example.crud.controller;

import com.example.crud.dto.CommentDto;
import com.example.crud.dto.CommentRequest;
import com.example.crud.service.CommentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks/{taskId}/comments")
@RequiredArgsConstructor
@Tag(name = "Comments", description = "Comment management for tasks")
public class CommentController {

    private final CommentService commentService;

    @GetMapping
    @Operation(summary = "List all comments for a task")
    public ResponseEntity<List<CommentDto>> getComments(
            @PathVariable String taskId,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(commentService.getComments(taskId, userDetails.getUsername()));
    }

    @PostMapping
    @Operation(summary = "Add a comment to a task")
    public ResponseEntity<CommentDto> addComment(
            @PathVariable String taskId,
            @Valid @RequestBody CommentRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(commentService.addComment(taskId, request, userDetails.getUsername()));
    }

    @PutMapping("/{commentId}")
    @Operation(summary = "Update a comment (author only)")
    public ResponseEntity<CommentDto> updateComment(
            @PathVariable String taskId,
            @PathVariable String commentId,
            @Valid @RequestBody CommentRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                commentService.updateComment(taskId, commentId, request, userDetails.getUsername()));
    }

    @DeleteMapping("/{commentId}")
    @Operation(summary = "Delete a comment (author or ADMIN)")
    public ResponseEntity<Void> deleteComment(
            @PathVariable String taskId,
            @PathVariable String commentId,
            @AuthenticationPrincipal UserDetails userDetails) {
        commentService.deleteComment(taskId, commentId, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
