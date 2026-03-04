import React from 'react';
import { Button } from '../../../components/ui/button';
import { formatCurrency } from '../../../utils/formatters';

type Props = {
  emi: number;
  totalInterest: number;
  totalPayment: number;
  principal: number;
  processingFeeAmount: number;
  onApplyNow: () => void;
};

export const ResultsPanel: React.FC<Props> = ({ emi, totalInterest, totalPayment, principal, processingFeeAmount, onApplyNow }) => {
  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow">
      <div className="text-center">
        <div className="text-3xl font-extrabold text-[#0050B2]">{formatCurrency(emi)}</div>
        <div className="text-sm text-gray-500">Estimated EMI</div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded">
          <div className="text-sm text-gray-500">Loan Amount</div>
          <div className="text-lg font-semibold">{formatCurrency(principal)}</div>
        </div>
        <div className="p-4 bg-gray-50 rounded">
          <div className="text-sm text-gray-500">Processing Fee</div>
          <div className="text-lg font-semibold">{formatCurrency(processingFeeAmount)}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded">
          <div className="text-sm text-gray-500">Total Interest</div>
          <div className="text-lg font-semibold">{formatCurrency(totalInterest)}</div>
        </div>
        <div className="p-4 bg-gray-50 rounded">
          <div className="text-sm text-gray-500">Total Payment (Principal + Interest)</div>
          <div className="text-lg font-semibold">{formatCurrency(totalPayment)}</div>
        </div>
      </div>

      <Button onClick={onApplyNow} className="w-full bg-[#0050B2] text-white">Apply Now</Button>
    </div>
  );
};
