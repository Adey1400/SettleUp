package com.SettleUp.balance_service.DTO;


import java.io.Serializable;


public record DebtResponse(
    String debtorEmail,  
    String creditorEmail, 
    Double amount
) implements Serializable {}