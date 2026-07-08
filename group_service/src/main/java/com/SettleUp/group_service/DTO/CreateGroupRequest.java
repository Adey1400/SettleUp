package com.SettleUp.group_service.DTO;

import java.util.List;

import jakarta.validation.constraints.NotBlank;

public record CreateGroupRequest(
        @NotBlank(message = "Group name is required") 
        String name,
        List<String> memberEmails) {}
