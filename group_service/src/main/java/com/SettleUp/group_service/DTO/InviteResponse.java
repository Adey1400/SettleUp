package com.SettleUp.group_service.DTO;


import java.time.LocalDateTime;

public record InviteResponse(
    Long id,
    Long groupId,
    String groupName,
    String inviterEmail,
    String inviteeEmail,
    String status,
    LocalDateTime createdAt
) {}