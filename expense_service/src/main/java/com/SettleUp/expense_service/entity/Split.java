package com.SettleUp.expense_service.entity;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "splits")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Split {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "expense_id", nullable = false)
    private Expense expense;

    @Column(nullable = false)
    private String owedByEmail;

    @Column(nullable = false)
    private Double amountOwed; // The exact calculated amount this user owes

    // Nullable. Only used if SplitType == PERCENT
    private Double percentage; 
}