package com.SettleUp.balance_service.client;




import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.SettleUp.balance_service.DTO.ExpenseResponse;

import java.util.List;

@FeignClient(name = "api-gateway", url = "http://localhost:8080")
public interface ExpenseClient {

    @GetMapping(value = "/api/v1/groups/{groupId}/expenses", headers = "Authorization={token}")
    List<ExpenseResponse> getGroupExpenses(
            @PathVariable("groupId") Long groupId,
            @org.springframework.web.bind.annotation.RequestHeader("Authorization") String token
    );
}