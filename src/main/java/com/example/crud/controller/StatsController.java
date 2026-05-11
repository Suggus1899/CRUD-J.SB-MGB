package com.example.crud.controller;

import com.example.crud.dto.StatsDto;
import com.example.crud.service.StatsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
@Tag(name = "Statistics", description = "Task statistics and dashboard")
public class StatsController {

    private final StatsService statsService;

    @GetMapping("/me")
    @Operation(summary = "Get statistics for the authenticated user")
    public ResponseEntity<StatsDto> getMyStats(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(statsService.getMyStats(userDetails.getUsername()));
    }

    @GetMapping("/global")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get global statistics (ADMIN only)")
    public ResponseEntity<StatsDto> getGlobalStats() {
        return ResponseEntity.ok(statsService.getGlobalStats());
    }
}
