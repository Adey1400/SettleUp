package com.SettleUp.balance_service.DTO;


public record SplitResponse(
    String owedByEmail,
    Double amountOwed
) {}
