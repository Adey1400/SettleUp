package com.SettleUp.user_service.DTO;

import jakarta.validation.constraints.NotBlank;

public record UserProfileUpdateRequest(
    @NotBlank(message = "First name cannot be empty")
    String firstName,
    
    @NotBlank(message = "Last name cannot be empty")
    String lastName
) {}
