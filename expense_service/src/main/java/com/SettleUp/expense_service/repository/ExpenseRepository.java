package com.SettleUp.expense_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.SettleUp.expense_service.entity.Expense;

public interface ExpenseRepository extends JpaRepository<Expense,Long>{
 List<Expense> findByGroupId(Long groupId);
}
