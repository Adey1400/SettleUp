package com.SettleUp.expense_service.DTO;

public record SplitResponse(
    String owedByEmail,
    Double amountOwed
) {

}
