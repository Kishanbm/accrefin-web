// src/types/calculator.ts
export interface CalculatorInputs {
    loanAmount: number;
    interestRate: number;
    loanTenure: number;
    tenureType: 'years' | 'months';
}

export interface CalculatorResults {
    emi: number;
    totalAmount: number;
    totalInterest: number;
}