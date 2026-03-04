import React from 'react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { PrinterIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';

type Props = {
  emi: number;
  totalInterest: number;
  loanAmount: number;
  processingFeeRate: number;
  processingFeeAmount: number;
  displayTotalAmount: number;
  showAmortization: boolean;
  setShowAmortization: (v: boolean) => void;
  handlePrint: () => void;
};

export const ResultsPanel: React.FC<Props> = ({
  emi,
  totalInterest,
  loanAmount,
  processingFeeRate,
  processingFeeAmount,
  displayTotalAmount,
  showAmortization,
  setShowAmortization,
  handlePrint,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#0050B2] to-[#003d8a] rounded-2xl p-8 text-white text-center">
        <h3 className="text-lg font-semibold mb-2 opacity-90">Monthly EMI</h3>
        <div className="text-4xl font-bold mb-4">{formatCurrency(emi)}</div>
        <Button className="bg-white text-[#0050B2] hover:bg-gray-100 font-semibold px-8 py-3 rounded-xl transition-all duration-300">Apply for Business Loan</Button>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
          <span className="text-gray-600">Principal Amount</span>
          <span className="font-bold text-gray-900">{formatCurrency(loanAmount)}</span>
        </div>

        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
          <span className="text-gray-600">Processing Fee ({processingFeeRate}%)</span>
          <span className="font-bold text-gray-900">{formatCurrency(processingFeeAmount)}</span>
        </div>

        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
          <span className="text-gray-600">Total Interest</span>
          <span className="font-bold text-gray-900">{formatCurrency(totalInterest)}</span>
        </div>

        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
          <span className="text-green-700 font-semibold">Total Amount Payable</span>
          <span className="font-bold text-green-700 text-lg">{formatCurrency(displayTotalAmount)}</span>
        </div>
      </div>

      <div className="pt-4">
        <Button onClick={() => setShowAmortization(!showAmortization)} variant="outline" className="w-full border-[#0050B2] text-[#0050B2] hover:bg-[#0050B2] hover:text-white">
          {showAmortization ? 'Hide' : 'Show'} Amortization Schedule
          {showAmortization ? <ChevronUpIcon className="w-4 h-4 ml-2" /> : <ChevronDownIcon className="w-4 h-4 ml-2" />}
        </Button>
      </div>
    </div>
  );
};
