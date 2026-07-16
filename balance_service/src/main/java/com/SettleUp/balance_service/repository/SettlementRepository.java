package com.SettleUp.balance_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.SettleUp.balance_service.entity.Settlement;
import com.SettleUp.balance_service.entity.SettlementStatus;

public interface SettlementRepository extends JpaRepository<Settlement,Long> {
List<Settlement> findByGroupIdAndStatus(Long groupId, SettlementStatus status);
}
