package com.SettleUp.expense_service.service.strategy;

import java.util.List;



import com.SettleUp.expense_service.DTO.SplitRequest;
import com.SettleUp.expense_service.entity.Expense;
import com.SettleUp.expense_service.entity.Split;
import com.SettleUp.expense_service.entity.SplitType;

public interface SplitStrategy {

    List<Split> calculateSplits(Double totalAmount, List <SplitRequest> splitRequests , Expense expense);
    SplitType getSplitType();
} 