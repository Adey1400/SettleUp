package com.SettleUp.group_service.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.HashSet;
import org.springframework.stereotype.Service;

import com.SettleUp.group_service.DTO.CreateGroupRequest;
import com.SettleUp.group_service.DTO.GroupResponse;
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
     
    @Transactional
    public GroupResponse createGroup(CreateGroupRequest request, String creatorEmail) {
        Group group = buildGroup(request, creatorEmail);
        List <GroupMember> members= buildGroupMembers(group, request, creatorEmail);
        group.setMembers(members);
        Group saveGroup= groupRepository.save(group);
        return mapToResponse(saveGroup);
    }
   
   
       public List<GroupResponse> getUserGroups(String userEmail) {

        return groupMemberRepository.findByUserEmail(userEmail)
                .stream()
                .map(GroupMember::getGroup)
                .map(this::mapToResponse)
                .toList();
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
