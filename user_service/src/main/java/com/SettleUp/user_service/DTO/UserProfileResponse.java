package com.SettleUp.user_service.DTO;

public record UserProfileResponse(
    Long id,
    String email,
    String firstName,
    String lastName
) {}
