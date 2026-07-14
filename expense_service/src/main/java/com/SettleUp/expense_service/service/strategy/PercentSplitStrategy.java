package com.SettleUp.expense_service.service.strategy;


import com.SettleUp.expense_service.DTO.SplitRequest;
import com.SettleUp.expense_service.entity.Expense;
import com.SettleUp.expense_service.entity.Split;
import com.SettleUp.expense_service.entity.SplitType;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class PercentSplitStrategy implements SplitStrategy {

    @Override
    public List<Split> calculateSplits(Double totalAmount, List<SplitRequest> splitRequests, Expense expense) {
        
        // Validation: Percentages MUST sum to exactly 100
        double sumPercentage = splitRequests.stream()
                .mapToDouble(SplitRequest::percentage)
                .sum();

        if (Math.abs(sumPercentage - 100.0) > 0.01) {
            throw new IllegalArgumentException("Percentages must sum up to exactly 100");
        }

        return splitRequests.stream().map(request -> {
            double calculatedAmount = Math.round((totalAmount * request.percentage() / 100.0) * 100.0) / 100.0;
            return Split.builder()
                .expense(expense)
                .owedByEmail(request.userEmail())
                .amountOwed(calculatedAmount)
                .percentage(request.percentage())
                .build();
        }).collect(Collectors.toList());
    }

    @Override
    public SplitType getSplitType() {
        return SplitType.PERCENT;
    }
}