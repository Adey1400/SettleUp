package com.SettleUp.expense_service.DTO;


public record SplitRequest(
    String userEmail,
    Double amount,      
    Double percentage   
) {}