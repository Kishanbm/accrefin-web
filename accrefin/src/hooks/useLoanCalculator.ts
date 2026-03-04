// src/hooks/useLoanCalculator.ts
import { useState, useEffect } from 'react';
import { CalculatorInputs, CalculatorResults } from '../types'; // Use new types

export const useLoanCalculator = (inputs: CalculatorInputs): CalculatorResults => {
    const [results, setResults] = useState<CalculatorResults>({
        emi: 0,
        totalAmount: 0,
        totalInterest: 0,
    });

    // The actual EMI calculation logic (extracted from the pages)
    useEffect(() => {
        const { loanAmount, interestRate, loanTenure, tenureType } = inputs;
        const principal = loanAmount;
        const months = tenureType === 'years' ? loanTenure * 12 : loanTenure;
        const monthlyRate = interestRate / 100 / 12;

        if (monthlyRate === 0 || months === 0) {
            // Simple case for 0 rate or 0 tenure
            setResults({
                emi: principal / months || 0,
                totalAmount: principal,
                totalInterest: 0,
            });
            return;
        }

        const calculatedEmi =
            (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
            (Math.pow(1 + monthlyRate, months) - 1);

        const calculatedTotal = calculatedEmi * months;
        const calculatedInterest = calculatedTotal - principal;

        setResults({
            emi: calculatedEmi,
            totalAmount: calculatedTotal,
            totalInterest: calculatedInterest,
        });
    }, [inputs]);

    return results;
};