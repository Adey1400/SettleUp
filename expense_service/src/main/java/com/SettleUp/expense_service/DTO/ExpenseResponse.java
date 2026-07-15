package com.SettleUp.expense_service.DTO;

import java.time.LocalDateTime;

import com.SettleUp.expense_service.entity.SplitType;

public record ExpenseResponse(
    Long id,
    Long groupId,
    String paidByEmail,
    Double amount,
    String description,
    SplitType splitType,
    LocalDateTime createdAt
) {}
