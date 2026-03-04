export type AmortRow = {
  month: number;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
};

export const generateAmortization = (
  loanAmount: number,
  interestRate: number,
  loanTenure: number,
  tenureType: 'years' | 'months',
  emi: number,
  monthsToShow = 12
): AmortRow[] => {
  const schedule: AmortRow[] = [];
  const months = tenureType === 'years' ? loanTenure * 12 : loanTenure;
  const monthlyRate = interestRate / 100 / 12;
  let balance = loanAmount;

  for (let i = 1; i <= Math.min(months, monthsToShow); i++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = emi - interestPayment;
    balance -= principalPayment;

    schedule.push({
      month: i,
      emi,
      principal: principalPayment,
      interest: interestPayment,
      balance: Math.max(0, balance),
    });
  }

  return schedule;
};
