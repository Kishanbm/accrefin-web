// src/types/loan.ts
export interface LoanProduct {
    id: string;
    name: string;
    icon: string;
    summary: string;
    features: string[];
    rate: string;
    gradient: string;
}

export interface LoanEligibility {
    minAge: number;
    maxAge: number;
    minIncome: number;
    minCreditScore: number;
    employmentTypes: string[];
}

export interface LoanDocument {
    id: string;
    name: string;
    description: string;
    required: boolean;
}