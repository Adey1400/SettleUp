package com.SettleUp.balance_service.controller;


import com.SettleUp.balance_service.DTO.DebtResponse;
import com.SettleUp.balance_service.service.BalanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/api/v1/balances")
@RequiredArgsConstructor
public class BalanceController {

    private final BalanceService balanceService;

    @GetMapping("/group/{groupId}")
    public ResponseEntity<List<DebtResponse>> getGroupBalances(
            @PathVariable Long groupId,
            HttpServletRequest request) {
        
        // Extracting the Authorization header to pass it down to the Feign Client
        String authHeader = request.getHeader("Authorization");
        
        return ResponseEntity.ok(balanceService.calculateWhoOwesWhom(groupId, authHeader));
    }
}