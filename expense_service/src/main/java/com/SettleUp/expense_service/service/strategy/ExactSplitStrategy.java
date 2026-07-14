package com.SettleUp.expense_service.service.strategy;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.SettleUp.expense_service.DTO.SplitRequest;
import com.SettleUp.expense_service.entity.Expense;
import com.SettleUp.expense_service.entity.Split;
import com.SettleUp.expense_service.entity.SplitType;

@Component
public class ExactSplitStrategy implements SplitStrategy {
  
    @Override
    public List<Split> calculateSplits(Double totalAmount,List<SplitRequest> splitRequests, Expense expense){
        // Validation: Sum of exact amounts MUST equal the total bill
        double sumAmount = splitRequests.stream()
                .mapToDouble(SplitRequest::amount)
                .sum();

        // Allowing a tiny margin of error for double precision floating-point arithmetic
        if (Math.abs(sumAmount - totalAmount) > 0.01) {
            throw new IllegalArgumentException("Exact amounts must sum up to the total expense amount");
        }

        return splitRequests.stream().map(request ->
            Split.builder()
                .expense(expense)
                .owedByEmail(request.userEmail())
                .amountOwed(request.amount())
                .build()
        ).collect(Collectors.toList());
    }
    @Override
    public SplitType getSplitType() {
        return SplitType.EXACT;
    }
}
