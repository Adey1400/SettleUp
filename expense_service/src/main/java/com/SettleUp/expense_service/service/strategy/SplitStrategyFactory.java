package com.SettleUp.expense_service.service.strategy;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.SettleUp.expense_service.entity.SplitType;

@Component
public class SplitStrategyFactory {
private final Map<SplitType, SplitStrategy> strategies = new EnumMap<>(SplitType.class);

    // Spring automatically injects a List of all classes that implement SplitStrategy!
    @Autowired
    public SplitStrategyFactory(List<SplitStrategy> strategyList) {
        for (SplitStrategy strategy : strategyList) {
            strategies.put(strategy.getSplitType(), strategy);
        }
    }

    public SplitStrategy getStrategy(SplitType splitType) {
        SplitStrategy strategy = strategies.get(splitType);
        if (strategy == null) {
            throw new IllegalArgumentException("Unsupported Split Type: " + splitType);
        }
        return strategy;
    }
}
