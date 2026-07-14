package com.SettleUp.expense_service.service.strategy;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.SettleUp.expense_service.DTO.SplitRequest;
import com.SettleUp.expense_service.entity.Expense;
import com.SettleUp.expense_service.entity.Split;
import com.SettleUp.expense_service.entity.SplitType;

@Component
public class EqualSplitStrategy implements SplitStrategy{

 @Override
 public List<Split> calculateSplits(Double totalAmount, List<SplitRequest> splitRequests, Expense expense){
  if(splitRequests==null || splitRequests.isEmpty()){
    throw new IllegalArgumentException("Split Request Cannot be empty");
  }
  // Math: Total / number of people
  double splitAmount = Math.round(totalAmount/splitRequests.size()*100.0)/100.0;

  return splitRequests.stream().map(request -> 
            Split.builder()
                .expense(expense)
                .owedByEmail(request.userEmail())
                .amountOwed(splitAmount)
                .build()
        ).collect(Collectors.toList());
 }
 @Override
    public SplitType getSplitType() {
        return SplitType.EQUAL;
    }
}
