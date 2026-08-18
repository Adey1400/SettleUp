package com.SettleUp.group_service.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "group_invites")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GroupInvite {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long groupId;

    @Column(nullable = false)
    private String groupName; 

    @Column(nullable = false)
    private String inviterEmail;

    @Column(nullable = false)
    private String inviteeEmail;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InviteStatus status;

    private LocalDateTime createdAt;
}