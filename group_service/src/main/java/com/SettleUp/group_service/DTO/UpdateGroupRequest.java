package com.SettleUp.group_service.DTO;



import jakarta.validation.constraints.NotBlank;

public record UpdateGroupRequest(
    @NotBlank(message = "Group name cannot be empty")
    String name
) {}