package com.SettleUp.group_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.SettleUp.group_service.entity.Group;

public interface GroupRepository extends JpaRepository<Group,Long>{
}
