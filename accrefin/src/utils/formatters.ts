export const formatCurrency = (amount: number) => {
  return `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
};

export const getFillPercentage = (value: number, min: number, max: number): string => {
  const numValue = Number(value);
  const numMin = Number(min);
  const numMax = Number(max);

  if (numMax === numMin) return '0%';
  const percentage = ((numValue - numMin) / (numMax - numMin)) * 100;
  return `${Math.max(0, Math.min(100, percentage))}%`;
};
