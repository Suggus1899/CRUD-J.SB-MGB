package com.example.crud.repository;

import com.example.crud.model.Priority;
import com.example.crud.model.Task;
import com.example.crud.model.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.lang.NonNull;

import java.time.LocalDate;
import java.util.List;

public interface TaskRepository extends MongoRepository<Task, String> {

    Page<Task> findByUserId(String userId, Pageable pageable);

    Page<Task> findByUserIdAndStatus(String userId, TaskStatus status, Pageable pageable);

    Page<Task> findByUserIdAndPriority(String userId, Priority priority, Pageable pageable);

    Page<Task> findByUserIdAndStatusAndPriority(String userId, TaskStatus status, Priority priority, Pageable pageable);

    @Query("{ 'userId': ?0, 'tags': { $in: [?1] } }")
    Page<Task> findByUserIdAndTagsContaining(String userId, String tag, Pageable pageable);

    @Query("{ 'userId': ?0, 'dueDate': { $lt: ?1 }, 'status': { $ne: 'COMPLETED' } }")
    List<Task> findOverdueTasks(String userId, LocalDate today);

    @Override
    @NonNull
    Page<Task> findAll(@NonNull Pageable pageable);
}
