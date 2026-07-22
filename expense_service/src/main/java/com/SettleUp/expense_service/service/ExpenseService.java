package com.SettleUp.expense_service.service;




import com.SettleUp.expense_service.DTO.CreateExpenseRequest;
import com.SettleUp.expense_service.DTO.ExpenseResponse;
import com.SettleUp.expense_service.DTO.SplitResponse;
import com.SettleUp.expense_service.entity.Expense;
import com.SettleUp.expense_service.entity.ExpenseMetadata;
import com.SettleUp.expense_service.entity.Split;
import com.SettleUp.expense_service.repository.ExpenseRepository;
import com.SettleUp.expense_service.service.strategy.SplitStrategy;
import com.SettleUp.expense_service.service.strategy.SplitStrategyFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final SplitStrategyFactory splitStrategyFactory;

    @Transactional
    public ExpenseResponse createExpense(CreateExpenseRequest request, String creatorEmail) {
        
        //Buildiing the Metadata
        ExpenseMetadata metadata = ExpenseMetadata.builder()
                .name(request.description())
                .description(request.description())
                .createdAt(LocalDateTime.now())
                .build();

        //Building the core Expense Entity (without splits yet)
        Expense expense = Expense.builder()
                .groupId(request.groupId())
                .paidByEmail(creatorEmail) // The person making the request paid for it
                .amount(request.amount())
                .splitType(request.splitType())
                .metadata(metadata)
                .build();

        //Dynamically fetching the correct mathematical strategy using our Factory!
        SplitStrategy strategy = splitStrategyFactory.getStrategy(request.splitType());

        //Calculating the exact splits
        List<Split> calculatedSplits = strategy.calculateSplits(
                request.amount(), 
                request.splits(), 
                expense
        );

        // 5. Attaching the splits to the expense
        expense.setSplits(calculatedSplits);

        // 6. Saving everything at once (Cascades to Metadata and Splits automatically)
        Expense savedExpense = expenseRepository.save(expense);

        return mapToResponse(savedExpense);
    }

    public List<ExpenseResponse> getGroupExpenses(Long groupId) {
        return expenseRepository.findByGroupId(groupId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private ExpenseResponse mapToResponse(Expense expense) {
        List<SplitResponse> splitResponses= expense.getSplits().stream().map(split -> new com.SettleUp.expense_service.DTO.SplitResponse(
                        split.getOwedByEmail(), 
                        split.getAmountOwed()))
                .toList();
        return new ExpenseResponse(
                expense.getId(),
                expense.getGroupId(),
                expense.getPaidByEmail(),
                expense.getAmount(),
                expense.getMetadata().getDescription(),
                expense.getSplitType(),
                expense.getMetadata().getCreatedAt(),
                splitResponses
        );
    }
    // getting by id
    public ExpenseResponse getExpenseById(Long id) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found"));
        return mapToResponse(expense);
    }

    //updating expense
    @Transactional
    public ExpenseResponse updateExpense(Long id, CreateExpenseRequest request, String requesterEmail) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found"));

        // AUTHORIZATION: Only the person who paid can edit the expense
        if (!expense.getPaidByEmail().equals(requesterEmail)) {
            throw new SecurityException("Only the payer can edit this expense");
        }

        // Updating primitive fields & metadata
        expense.setAmount(request.amount());
        expense.setSplitType(request.splitType());
        expense.getMetadata().setName(request.description());
        expense.getMetadata().setDescription(request.description());
        //clearing the old splits
        expense.getSplits().clear();

        SplitStrategy strategy = splitStrategyFactory.getStrategy(request.splitType());
        List<Split> newSplits = strategy.calculateSplits(request.amount(), request.splits(), expense);

        expense.getSplits().addAll(newSplits);

        Expense updatedExpense = expenseRepository.save(expense);
        return mapToResponse(updatedExpense);
    }

    // deleting expense
    @Transactional
    public void deleteExpense(Long id, String requesterEmail) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found"));

        // AUTHORIZATION: Only the payer can delete the expense
        if (!expense.getPaidByEmail().equals(requesterEmail)) {
            throw new SecurityException("Only the payer can delete this expense");
        }

       
        expenseRepository.delete(expense);
    }
}