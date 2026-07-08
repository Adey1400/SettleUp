package com.SettleUp.group_service.repository;



import org.springframework.data.jpa.repository.JpaRepository;

import com.SettleUp.group_service.entity.GroupMember;

import java.util.List;

public interface GroupMemberRepository extends JpaRepository<GroupMember, Long> {
    // This custom method allows us to find all groups a specific user belongs to
    List<GroupMember> findByUserEmail(String email);
}