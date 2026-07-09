package com.SettleUp.group_service.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record AddMemberRequest(
@NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    String email
) {}
