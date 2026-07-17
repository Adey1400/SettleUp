package com.SettleUp.balance_service.client;




import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.SettleUp.balance_service.DTO.ExpenseResponse;

import java.util.List;

// This tells Feign to automatically route requests to our API Gateway on port 8080!
@FeignClient(name = "api-gateway", url = "http://localhost:8080")
public interface ExpenseonClient {

    // We pass the JWT token automatically through a Feign Interceptor (we'll add this later if needed, 
    // but for now, we will pass the Authorization header dynamically).
    @GetMapping(value = "/api/v1/groups/{groupId}/expenses", headers = "Authorization={token}")
    List<ExpenseResponse> getGroupExpenses(
            @PathVariable("groupId") Long groupId,
            @org.springframework.web.bind.annotation.RequestHeader("Authorization") String token
    );
}