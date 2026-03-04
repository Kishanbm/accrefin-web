import React from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { HelpCircleIcon, RotateCcwIcon, PrinterIcon } from 'lucide-react';
import { getFillPercentage, formatCurrency } from '../../../utils/formatters';

type Props = {
  loanAmount: number;
  setLoanAmount: (v: number) => void;
  interestRate: number;
  setInterestRate: (v: number) => void;
  loanTenure: number;
  setLoanTenure: (v: number) => void;
  tenureType: 'years' | 'months';
  setTenureType: (v: 'years' | 'months') => void;
  processingFeeRate: number;
  setProcessingFeeRate: (v: number) => void;
  resetCalculator: () => void;
  handlePrint: () => void;
  showTooltip: string | null;
  setShowTooltip: (v: string | null) => void;
};

export const CalculatorInputs: React.FC<Props> = ({
  loanAmount,
  setLoanAmount,
  interestRate,
  setInterestRate,
  loanTenure,
  setLoanTenure,
  tenureType,
  setTenureType,
  processingFeeRate,
  setProcessingFeeRate,
  resetCalculator,
  handlePrint,
  showTooltip,
  setShowTooltip,
}) => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Calculate Your Business Loan EMI</h3>
        <div className="flex gap-2">
          <Button
            onClick={resetCalculator}
            variant="outline"
            size="sm"
            className="border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            <RotateCcwIcon className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button
            onClick={handlePrint}
            variant="outline"
            size="sm"
            className="border-[#0050B2] text-[#0050B2] hover:bg-blue-50"
          >
            <PrinterIcon className="w-4 h-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      {/* Loan Amount */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <label className="text-lg font-semibold text-gray-900">Loan Amount</label>
            <div className="relative">
              <HelpCircleIcon
                className="w-4 h-4 text-gray-400 cursor-help"
                onMouseEnter={() => setShowTooltip('loanAmount')}
                onMouseLeave={() => setShowTooltip(null)}
              />
              {showTooltip === 'loanAmount' && (
                <div className="absolute bottom-6 left-0 bg-gray-800 text-white text-xs p-2 rounded-lg w-48 z-10">
                  The principal amount you want to borrow for your business needs
                </div>
              )}
            </div>
          </div>
          <div className="bg-[#0050B2] text-white px-4 py-2 rounded-lg font-bold">{formatCurrency(loanAmount)}</div>
        </div>

        <input
          type="range"
          min="100000"
          max="10000000"
          step="50000"
          value={loanAmount}
          onChange={(e) => setLoanAmount(Number(e.target.value))}
          className="w-full h-3 bg-gray-200 rounded-lg cursor-pointer slider"
          style={{ '--fill-percent': getFillPercentage(loanAmount, 100000, 10000000) } as React.CSSProperties}
        />
        <div className="flex justify-between text-sm text-gray-500">
          <span>₹1L</span>
          <span>₹1Cr</span>
        </div>
      </div>

      {/* Interest Rate */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <label className="text-lg font-semibold text-gray-900">Interest Rate (% p.a.)</label>
            <div className="relative">
              <HelpCircleIcon
                className="w-4 h-4 text-gray-400 cursor-help"
                onMouseEnter={() => setShowTooltip('interestRate')}
                onMouseLeave={() => setShowTooltip(null)}
              />
              {showTooltip === 'interestRate' && (
                <div className="absolute bottom-6 left-0 bg-gray-800 text-white text-xs p-2 rounded-lg w-48 z-10">Annual interest rate charged by the lender (varies based on credit profile)</div>
              )}
            </div>
          </div>
          <div className="bg-[#0050B2] text-white px-4 py-2 rounded-lg font-bold">{interestRate}%</div>
        </div>

        <input
          type="range"
          min="9"
          max="24"
          step="0.1"
          value={interestRate}
          onChange={(e) => setInterestRate(Number(e.target.value))}
          className="w-full h-3 bg-gray-200 rounded-lg cursor-pointer slider"
          style={{ '--fill-percent': getFillPercentage(interestRate, 9, 24) } as React.CSSProperties}
        />
        <div className="flex justify-between text-sm text-gray-500">
          <span>9%</span>
          <span>24%</span>
        </div>
      </div>

      {/* Loan Tenure */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <label className="text-lg font-semibold text-gray-900">Loan Tenure</label>
            <div className="relative">
              <HelpCircleIcon
                className="w-4 h-4 text-gray-400 cursor-help"
                onMouseEnter={() => setShowTooltip('tenure')}
                onMouseLeave={() => setShowTooltip(null)}
              />
              {showTooltip === 'tenure' && (
                <div className="absolute bottom-6 left-0 bg-gray-800 text-white text-xs p-2 rounded-lg w-48 z-10">The time period over which you'll repay the loan</div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-[#0050B2] text-white px-4 py-2 rounded-lg font-bold">{loanTenure} {tenureType}</div>
            <select value={tenureType} onChange={(e) => setTenureType(e.target.value as 'years' | 'months')} className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option value="years">Years</option>
              <option value="months">Months</option>
            </select>
          </div>
        </div>

        <input
          type="range"
          min={tenureType === 'years' ? '1' : '12'}
          max={tenureType === 'years' ? '10' : '120'}
          step="1"
          value={loanTenure}
          onChange={(e) => setLoanTenure(Number(e.target.value))}
          className="w-full h-3 bg-gray-200 rounded-lg cursor-pointer slider"
          style={{ '--fill-percent': getFillPercentage(loanTenure, Number(tenureType === 'years' ? '1' : '12'), Number(tenureType === 'years' ? '10' : '120')) } as React.CSSProperties}
        />
        <div className="flex justify-between text-sm text-gray-500">
          <span>{tenureType === 'years' ? '1 Year' : '12 Months'}</span>
          <span>{tenureType === 'years' ? '10 Years' : '120 Months'}</span>
        </div>
      </div>

      {/* Processing Fee */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <label className="text-lg font-semibold text-gray-900">Processing Fee (%)</label>
            <div className="relative">
              <HelpCircleIcon
                className="w-4 h-4 text-gray-400 cursor-help"
                onMouseEnter={() => setShowTooltip('processingFee')}
                onMouseLeave={() => setShowTooltip(null)}
              />
              {showTooltip === 'processingFee' && (
                <div className="absolute bottom-6 left-0 bg-gray-800 text-white text-xs p-2 rounded-lg w-48 z-10">One-time fee charged by lender for processing your loan application</div>
              )}
            </div>
          </div>
          <div className="bg-[#0050B2] text-white px-4 py-2 rounded-lg font-bold">{processingFeeRate}%</div>
        </div>

        <input
          type="range"
          min="0"
          max="5"
          step="0.1"
          value={processingFeeRate}
          onChange={(e) => setProcessingFeeRate(Number(e.target.value))}
          className="w-full h-3 bg-gray-200 rounded-lg cursor-pointer slider"
          style={{ '--fill-percent': getFillPercentage(processingFeeRate, 0, 5) } as React.CSSProperties}
        />
        <div className="flex justify-between text-sm text-gray-500">
          <span>0%</span>
          <span>5%</span>
        </div>
      </div>
    </div>
  );
};
