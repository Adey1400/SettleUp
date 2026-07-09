package com.SettleUp.group_service.controller;




import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.SettleUp.group_service.DTO.AddMemberRequest;
import com.SettleUp.group_service.DTO.CreateGroupRequest;
import com.SettleUp.group_service.DTO.GroupResponse;
import com.SettleUp.group_service.DTO.UpdateGroupRequest;
import com.SettleUp.group_service.service.GroupService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/groups")
@RequiredArgsConstructor
public class GroupController {

    private final GroupService groupService;

    @PostMapping
    public ResponseEntity<GroupResponse> createGroup(
            @Valid @RequestBody CreateGroupRequest request,
            Authentication authentication) {
        
        // Extract the creator's email safely from the JWT token
        String creatorEmail = authentication.getName();
        
        GroupResponse response = groupService.createGroup(request, creatorEmail);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<GroupResponse>> getMyGroups(Authentication authentication) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(groupService.getUserGroups(userEmail));
    }

    @GetMapping("/{id}")
    public ResponseEntity<GroupResponse> getGroupById(
            @PathVariable Long id, 
            Authentication authentication) {
        String requesterEmail = authentication.getName();
        return ResponseEntity.ok(groupService.getGroupById(id, requesterEmail));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GroupResponse> updateGroup(
            @PathVariable Long id,
            @Valid @RequestBody UpdateGroupRequest request,
            Authentication authentication) {
        String requesterEmail = authentication.getName();
        return ResponseEntity.ok(groupService.updateGroup(id, request, requesterEmail));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGroup(
            @PathVariable Long id, 
            Authentication authentication) {
        String requesterEmail = authentication.getName();
        groupService.deleteGroup(id, requesterEmail);
        return ResponseEntity.noContent().build(); 
    }

    @PostMapping("/{id}/members")
    public ResponseEntity<GroupResponse> addMember(
            @PathVariable Long id,
            @Valid @RequestBody AddMemberRequest request,
            Authentication authentication) {
        
        String requesterEmail = authentication.getName();
        return ResponseEntity.ok(groupService.addMember(id, request, requesterEmail));
    }

    @DeleteMapping("/{id}/members/{userEmail}")
    public ResponseEntity<GroupResponse> removeMember(
            @PathVariable Long id,
            @PathVariable String userEmail,
            Authentication authentication) {
        
        String requesterEmail = authentication.getName();
        return ResponseEntity.ok(groupService.removeMember(id, userEmail, requesterEmail));
    }
}