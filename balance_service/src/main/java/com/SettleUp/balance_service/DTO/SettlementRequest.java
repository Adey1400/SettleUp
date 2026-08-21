package com.SettleUp.balance_service.DTO;

public record SettlementRequest(Long groupId,
    String payerEmail,
    String receiverEmail,
    Double amount) {

}
