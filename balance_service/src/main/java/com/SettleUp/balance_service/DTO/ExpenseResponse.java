package com.SettleUp.balance_service.DTO;

import java.util.List;

public record ExpenseResponse(
    Long id,
    String paidByEmail,
    Double amount,
    List<SplitResponse> splits) {

}
