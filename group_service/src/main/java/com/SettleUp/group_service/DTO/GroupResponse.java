package com.SettleUp.group_service.DTO;



import java.time.LocalDateTime;
import java.util.List;

public record GroupResponse(
    Long id,
    String name,
    String createdByEmail,
    LocalDateTime createdAt,
    List<String> members 
) {}