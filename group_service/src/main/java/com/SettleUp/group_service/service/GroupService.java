package com.SettleUp.group_service.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.HashSet;
import org.springframework.stereotype.Service;

import com.SettleUp.group_service.DTO.AddMemberRequest;
import com.SettleUp.group_service.DTO.CreateGroupRequest;
import com.SettleUp.group_service.DTO.GroupResponse;
import com.SettleUp.group_service.DTO.UpdateGroupRequest;
import com.SettleUp.group_service.entity.Group;
import com.SettleUp.group_service.entity.GroupMember;
import com.SettleUp.group_service.repository.GroupMemberRepository;
import com.SettleUp.group_service.repository.GroupRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class GroupService {

    private final GroupRepository groupRepository;
    private final GroupMemberRepository groupMemberRepository;
     
    //Creating a group
    @Transactional
    public GroupResponse createGroup(CreateGroupRequest request, String creatorEmail) {
        Group group = buildGroup(request, creatorEmail);
        List <GroupMember> members= buildGroupMembers(group, request, creatorEmail);
        group.setMembers(members);
        Group saveGroup= groupRepository.save(group);
        return mapToResponse(saveGroup);
    }
   
     //get method for group
       public List<GroupResponse> getUserGroups(String userEmail) {

        return groupMemberRepository.findByUserEmail(userEmail)
                .stream()
                .map(GroupMember::getGroup)
                .map(this::mapToResponse)
                .toList();
    }
   

    //getting group by id 
    public GroupResponse getGroupById(Long id, String requesterEmail){
        Group group= groupRepository.findById(id)
        .orElseThrow(()-> new RuntimeException("Group not found"));
 
        //Authorization: Check if the requester is actually a member of group
        boolean isMember= group.getMembers().stream()
        .anyMatch(member->member.getUserEmail().equals(requesterEmail));
        if(!isMember){
            throw new SecurityException("You are not authorized to view this group");
        }
        return mapToResponse(group);
    }
   
    //updating group name 
    @Transactional
    public GroupResponse updateGroup(Long id ,UpdateGroupRequest request , String requesterEmail){
        Group group = groupRepository.findById(id)
        .orElseThrow(()-> new RuntimeException("Group not found"));
        // AUTHORIZATION: Only the creator can update the group name
        if (!group.getCreatedByEmail().equals(requesterEmail)) {
            throw new SecurityException("Only the group creator can update the group");
        }
        group.setName(request.name());
        Group updateGroup= groupRepository.save(group);
        return mapToResponse(updateGroup);
    }
   
    //Deleting group
    @Transactional
    public void deleteGroup(Long id , String requesterEmail){
        Group group = groupRepository.findById(id)
        .orElseThrow(()-> new RuntimeException("Group not founf"));
        
        // AUTHORIZATION: Only the creator can delete the group
        if (!group.getCreatedByEmail().equals(requesterEmail)) {
            throw new SecurityException("Only the group creator can delete the group");
        }
        groupRepository.delete(group);
    }

    //adding group members
    @Transactional
    public GroupResponse addMember(Long id, AddMemberRequest request, String requesterEmail) {
        Group group = groupRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        // AUTHORIZATION: Only creator can add members
        if (!group.getCreatedByEmail().equals(requesterEmail)) {
            throw new SecurityException("Only the group creator can add members");
        }

        //preventing duplicates
        boolean alreadyMember = group.getMembers().stream()
                .anyMatch(member -> member.getUserEmail().equals(request.email()));

        if (alreadyMember) {
            throw new IllegalArgumentException("User is already a member of this group");
        }

        //  Adding new member
        GroupMember newMember = GroupMember.builder()
                .userEmail(request.email())
                .group(group)
                .build();
                
        group.getMembers().add(newMember);
        
        Group updatedGroup = groupRepository.save(group);
        return mapToResponse(updatedGroup);
    }

    //Removing group members
    @Transactional
    public GroupResponse removeMember(Long id, String emailToRemove, String requesterEmail) {
        Group group = groupRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        // AUTHORIZATION: Only creator can remove members
        if (!group.getCreatedByEmail().equals(requesterEmail)) {
            throw new SecurityException("Only the group creator can remove members");
        }
        //if someone try to remove group creator
        if (group.getCreatedByEmail().equals(emailToRemove)) {
            throw new IllegalArgumentException("The group creator cannot be removed");
        }
        // Action: Find and remove the member from the list
        boolean removed = group.getMembers().removeIf(member -> member.getUserEmail().equals(emailToRemove));

        if (!removed) {
            throw new RuntimeException("User is not a member of this group");
        }

        Group updatedGroup = groupRepository.save(group);
        return mapToResponse(updatedGroup);
    }
   
    
    // helper function to create group members

    private List<GroupMember> buildGroupMembers(
            Group group,
            CreateGroupRequest request,
            String creatorEmail) {

        Set<String> emails = collectUniqueEmails(request, creatorEmail);

        return emails.stream()
                .map(email -> GroupMember.builder()
                        .group(group)
                        .userEmail(email)
                        .build())
                .toList();
    }

    // helper function to map the response
    private GroupResponse mapToResponse(Group group) {

        List<String> memberEmails = group.getMembers()
                .stream()
                .map(GroupMember::getUserEmail)
                .toList();

        return new GroupResponse(
                group.getId(),
                group.getName(),
                group.getCreatedByEmail(),
                group.getCreatedAt(),
                memberEmails);
    }

    // Helper function to create a group
    private Group buildGroup(CreateGroupRequest request, String creatorEmail) {

        return Group.builder()
                .name(request.name())
                .createdByEmail(creatorEmail)
                .createdAt(LocalDateTime.now())
                .members(new ArrayList<>())
                .build();
    }
    /**
 * Collects all unique member emails.
 * Ensures the creator is always a member.
 */
private Set<String> collectUniqueEmails(
        CreateGroupRequest request,
        String creatorEmail) {

    Set<String> emails = new HashSet<>();

    emails.add(creatorEmail);

    if (request.memberEmails() != null) {
        emails.addAll(request.memberEmails());
    }

    return emails;
}

}
