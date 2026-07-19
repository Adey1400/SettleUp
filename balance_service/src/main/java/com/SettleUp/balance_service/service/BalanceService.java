package com.SettleUp.balance_service.service;



import com.SettleUp.balance_service.DTO.DebtResponse;
import com.SettleUp.balance_service.DTO.ExpenseResponse;
import com.SettleUp.balance_service.DTO.SplitResponse;
import com.SettleUp.balance_service.client.ExpenseClient;
import com.SettleUp.balance_service.entity.Settlement;
import com.SettleUp.balance_service.entity.SettlementStatus;
import com.SettleUp.balance_service.repository.SettlementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class BalanceService {

    private final ExpenseClient expenseClient;
    private final SettlementRepository settlementRepository;

    public List<DebtResponse> calculateWhoOwesWhom(Long groupId, String jwtToken) {
        //Fetching all expenses from the other microservice
        List<ExpenseResponse> expenses = expenseClient.getGroupExpenses(groupId, jwtToken);
        
        // Fetching all completed settlements from our local database
        List<Settlement> settlements = settlementRepository.findByGroupIdAndStatus(groupId, SettlementStatus.COMPLETED);

        // Mapping to track the net balance of every user
        Map<String, Double> balances = new HashMap<>();

        // Processing Expenses ---
        for (ExpenseResponse expense : expenses) {
            // The person who paid gets a POSITIVE balance (Group owes them)
            balances.put(expense.paidByEmail(), balances.getOrDefault(expense.paidByEmail(), 0.0) + expense.amount());

            // The people who were split get a NEGATIVE balance (They owe the group)
            for (SplitResponse split : expense.splits()) {
                balances.put(split.owedByEmail(), balances.getOrDefault(split.owedByEmail(), 0.0) - split.amountOwed());
            }
        }

        //  Processing Settlements
        for (Settlement settlement : settlements) {
            // The person who paid off their debt gets a POSITIVE bump
            balances.put(settlement.getPayerEmail(), balances.getOrDefault(settlement.getPayerEmail(), 0.0) + settlement.getAmount());
            
            // The person who received the cash gets a NEGATIVE bump
            balances.put(settlement.getReceiverEmail(), balances.getOrDefault(settlement.getReceiverEmail(), 0.0) - settlement.getAmount());
        }

        // Simplifying Debts
        return simplifyDebts(balances);
    }

    private List<DebtResponse> simplifyDebts(Map<String, Double> balances) {
        List<DebtResponse> transactions = new ArrayList<>();

        // Separating into two lists: Debtors (negative) and Creditors (positive)
        List<Map.Entry<String, Double>> debtors = new ArrayList<>();
        List<Map.Entry<String, Double>> creditors = new ArrayList<>();

        for (Map.Entry<String, Double> entry : balances.entrySet()) {
            // Rounding off to 2 decimal places to avoid floating point weirdness
            double amount = Math.round(entry.getValue() * 100.0) / 100.0;
            if (amount < 0) {
                debtors.add(new AbstractMap.SimpleEntry<>(entry.getKey(), amount));
            } else if (amount > 0) {
                creditors.add(new AbstractMap.SimpleEntry<>(entry.getKey(), amount));
            }
        }

        int i = 0; // Debtor index
        int j = 0; // Creditor index

        while (i < debtors.size() && j < creditors.size()) {
            Map.Entry<String, Double> debtor = debtors.get(i);
            Map.Entry<String, Double> creditor = creditors.get(j);

            // Amount to settle is the minimum of what the debtor owes and what the creditor is owed
            double debtAmount = Math.abs(debtor.getValue());
            double creditAmount = creditor.getValue();
            double settleAmount = Math.min(debtAmount, creditAmount);

            // Recording the transaction
            transactions.add(new DebtResponse(debtor.getKey(), creditor.getKey(), Math.round(settleAmount * 100.0) / 100.0));

            // Adjusting remaining balances
            debtor.setValue(debtor.getValue() + settleAmount);
            creditor.setValue(creditor.getValue() - settleAmount);

            // Moving to the next person if their balance is settled
            if (Math.abs(debtor.getValue()) < 0.01) i++;
            if (creditor.getValue() < 0.01) j++;
        }

        return transactions;
    }
}