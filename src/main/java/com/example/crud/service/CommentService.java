package com.example.crud.service;

import com.example.crud.dto.CommentDto;
import com.example.crud.dto.CommentRequest;
import com.example.crud.exception.ResourceNotFoundException;
import com.example.crud.exception.UnauthorizedException;
import com.example.crud.model.Comment;
import com.example.crud.model.Role;
import com.example.crud.model.Task;
import com.example.crud.model.User;
import com.example.crud.repository.TaskRepository;
import com.example.crud.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@SuppressWarnings("null")
@Service
@RequiredArgsConstructor
public class CommentService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public List<CommentDto> getComments(String taskId, String username) {
        Task task = getTask(taskId);
        validateTaskAccess(task, username);

        return task.getComments().stream()
                .map(c -> toDto(c, username))
                .collect(Collectors.toList());
    }

    public CommentDto addComment(String taskId, CommentRequest request, String username) {
        Task task = getTask(taskId);
        validateTaskAccess(task, username);

        User user = getUser(username);

        Comment comment = Comment.builder()
                .authorId(user.getId())
                .text(request.getText())
                .build();

        task.getComments().add(comment);
        taskRepository.save(task);

        return toDto(comment, user.getUsername());
    }

    public CommentDto updateComment(String taskId, String commentId, CommentRequest request, String username) {
        Task task = getTask(taskId);
        User user = getUser(username);

        Comment comment = task.getComments().stream()
                .filter(c -> c.getId().equals(commentId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Comment", commentId));

        if (!comment.getAuthorId().equals(user.getId()) && user.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("You can only edit your own comments");
        }

        comment.setText(request.getText());
        taskRepository.save(task);

        return toDto(comment, user.getUsername());
    }

    public void deleteComment(String taskId, String commentId, String username) {
        Task task = getTask(taskId);
        User user = getUser(username);

        Comment comment = task.getComments().stream()
                .filter(c -> c.getId().equals(commentId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Comment", commentId));

        if (!comment.getAuthorId().equals(user.getId()) && user.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("You can only delete your own comments");
        }

        task.getComments().remove(comment);
        taskRepository.save(task);
    }

    private Task getTask(String taskId) {
        return taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task", taskId));
    }

    private User getUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
    }

    private void validateTaskAccess(Task task, String username) {
        User user = getUser(username);
        if (user.getRole() == Role.ADMIN)
            return;
        if (!task.getUserId().equals(user.getId())) {
            throw new UnauthorizedException("You don't have permission to access this task");
        }
    }

    private CommentDto toDto(Comment comment, String authorUsername) {
        return CommentDto.builder()
                .id(comment.getId())
                .authorId(comment.getAuthorId())
                .authorUsername(authorUsername)
                .text(comment.getText())
                .createdAt(comment.getCreatedAt())
                .build();
    }
}
