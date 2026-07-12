package com.SettleUp.expense_service.entity;


import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "expenses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long groupId; // Logical link to the Group Service

    @Column(nullable = false)
    private String paidByEmail; // Logical link to the User Service

    @Column(nullable = false)
    private Double amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SplitType splitType;

    // One-to-One mapping to the metadata table
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "metadata_id", referencedColumnName = "id")
    private ExpenseMetadata metadata;

    // One expense has many splits. Cascade handles saving/deleting the splits automatically.
    @OneToMany(mappedBy = "expense", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Split> splits = new ArrayList<>();
}