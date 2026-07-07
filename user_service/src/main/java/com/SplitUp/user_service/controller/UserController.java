package com.SplitUp.user_service.controller;



import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.SplitUp.user_service.DTO.UserProfileResponse;
import com.SplitUp.user_service.DTO.UserProfileUpdateRequest;
import com.SplitUp.user_service.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getCurrentUser(Authentication authentication){
      String email = authentication.getName();
      return ResponseEntity.ok(userService.getProfileByEmail(email));
    }
    @GetMapping("/{id}")
    public ResponseEntity<UserProfileResponse> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getProfileById(id));
    }
    @PutMapping("/me")
    public ResponseEntity<UserProfileResponse> updateCurrentUser(Authentication authentication , @Valid @RequestBody  UserProfileUpdateRequest request){
        String email = authentication.getName();
        return ResponseEntity.ok(userService.updateProfile(email, request));
    }
}
