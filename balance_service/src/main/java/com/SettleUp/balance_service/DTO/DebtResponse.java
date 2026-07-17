package com.SettleUp.balance_service.DTO;



public record DebtResponse(
    String debtorEmail,  
    String creditorEmail, 
    Double amount
) {}