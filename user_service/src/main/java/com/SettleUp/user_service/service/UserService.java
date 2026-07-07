package com.SettleUp.user_service.service;

import org.springframework.stereotype.Service;

import com.SettleUp.user_service.DTO.UserProfileResponse;
import com.SettleUp.user_service.DTO.UserProfileUpdateRequest;
import com.SettleUp.user_service.Entity.User;
import com.SettleUp.user_service.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    
    //get me
    public UserProfileResponse getProfileByEmail(String email){
        User user = userRepository.findByEmail(email)
        .orElseThrow(()-> new RuntimeException("User not found with this email"+email));
        return mapToResponse(user);
    }

    //Updating profile (put)
    public UserProfileResponse updateProfile(String email, UserProfileUpdateRequest request){
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        User updatedUser = userRepository.save(user);
      return mapToResponse(updatedUser);
    }

    //get by id
    public UserProfileResponse getProfileById(Long id){
        User user = userRepository.findById(id)
        .orElseThrow(()-> new RuntimeException("User not found with id "+ id));
        return mapToResponse(user);
    }

    // Helper method to keep code DRY 
    private UserProfileResponse mapToResponse(User user) {
        return new UserProfileResponse(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName()
        );
    }
}
