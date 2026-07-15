package com.SettleUp.expense_service.controller;


import com.SettleUp.expense_service.DTO.CreateExpenseRequest;
import com.SettleUp.expense_service.DTO.ExpenseResponse;
import com.SettleUp.expense_service.service.ExpenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;


    @PostMapping("/expenses")
    public ResponseEntity<ExpenseResponse> addExpense(
            @Valid @RequestBody CreateExpenseRequest request,
            Authentication authentication) {
        String requesterEmail = (authentication != null) ? authentication.getName() : "anonymous";
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(expenseService.createExpense(request, requesterEmail));
    }


    @GetMapping("/expenses/{id}")
    public ResponseEntity<ExpenseResponse> getExpenseById(@PathVariable Long id) {
        return ResponseEntity.ok(expenseService.getExpenseById(id));
    }


    @PutMapping("/expenses/{id}")
    public ResponseEntity<ExpenseResponse> updateExpense(
            @PathVariable Long id,
            @Valid @RequestBody CreateExpenseRequest request,
            Authentication authentication) {
        String requesterEmail = authentication.getName();
        return ResponseEntity.ok(expenseService.updateExpense(id, request, requesterEmail));
    }


    @DeleteMapping("/expenses/{id}")
    public ResponseEntity<Void> deleteExpense(
            @PathVariable Long id,
            Authentication authentication) {
        String requesterEmail = authentication.getName();
        expenseService.deleteExpense(id, requesterEmail);
        return ResponseEntity.noContent().build();
    }

   
    @GetMapping("/groups/{id}/expenses")
    public ResponseEntity<List<ExpenseResponse>> getGroupExpenses(@PathVariable("id") Long groupId) {
        return ResponseEntity.ok(expenseService.getGroupExpenses(groupId));
    }
}