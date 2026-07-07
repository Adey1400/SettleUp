package com.SettleUp.user_service.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
        
    private String token;
    private Long id; 
    private String firstName;
    private String email;
    private String profilePicture;
}
