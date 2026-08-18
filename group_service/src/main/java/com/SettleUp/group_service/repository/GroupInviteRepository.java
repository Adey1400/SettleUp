package com.SettleUp.group_service.repository;

import com.SettleUp.group_service.entity.GroupInvite;
import com.SettleUp.group_service.entity.InviteStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface GroupInviteRepository extends JpaRepository<GroupInvite, Long> {
    List<GroupInvite> findByInviteeEmailAndStatus(String inviteeEmail, InviteStatus status);
    Optional<GroupInvite> findByGroupIdAndInviteeEmailAndStatus(Long groupId, String inviteeEmail, InviteStatus status);
}