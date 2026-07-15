package com.SettleUp.expense_service.DTO;



import com.SettleUp.expense_service.entity.SplitType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.util.List;

public record CreateExpenseRequest(
    @NotNull(message = "Group ID is required")
    Long groupId,

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be greater than zero")
    Double amount,

   @NotBlank(message = "Description is required")
    String description,

    @NotNull(message = "Split type is required")
    SplitType splitType,

    @NotEmpty(message = "Splits cannot be empty")
    List<SplitRequest> splits
){}