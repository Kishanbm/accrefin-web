import React from 'react';
import { HelpCircleIcon, RotateCcwIcon, PrinterIcon, InfoIcon } from 'lucide-react';
import { Button } from '../../../components/ui/button';
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
  processingFee: number;
  setProcessingFee: (v: number) => void;
  vehicleType: string;
  setVehicleType: (v: string) => void;
  vehicleConfigs: Record<string, any>;
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
  processingFee,
  setProcessingFee,
  vehicleType,
  setVehicleType,
  vehicleConfigs,
  resetCalculator,
  handlePrint,
  showTooltip,
  setShowTooltip,
}) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Calculate Your Auto Loan EMI</h3>
        <div className="flex gap-2">
          <Button onClick={resetCalculator} variant="outline" size="sm" className="border-gray-300 text-gray-600 hover:bg-gray-50">
            <RotateCcwIcon className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handlePrint} variant="outline" size="sm" className="border-[#0050B2] text-[#0050B2] hover:bg-blue-50">
            <PrinterIcon className="w-4 h-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      {/* Vehicle Type */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <label className="text-lg font-semibold text-gray-900">Vehicle Type</label>
          <div className="relative">
            <InfoIcon className="w-4 h-4 text-gray-400 cursor-help" onMouseEnter={() => setShowTooltip('vehicleType')} onMouseLeave={() => setShowTooltip(null)} />
            {showTooltip === 'vehicleType' && (
              <div className="absolute bottom-6 left-0 bg-gray-900 text-white text-xs p-2 rounded w-48 z-10">Select the type of vehicle you're financing</div>
            )}
          </div>
        </div>
        <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#0050B2] focus:ring-2 focus:ring-blue-100">
          {Object.entries(vehicleConfigs).map(([key, config]) => (
            <option key={key} value={key}>{config.label}</option>
          ))}
        </select>
      </div>

      {/* Loan Amount */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <label className="text-lg font-semibold text-gray-900">Loan Amount</label>
            <div className="relative">
              <InfoIcon className="w-4 h-4 text-gray-400 cursor-help" onMouseEnter={() => setShowTooltip('loanAmount')} onMouseLeave={() => setShowTooltip(null)} />
              {showTooltip === 'loanAmount' && (
                <div className="absolute bottom-6 left-0 bg-gray-900 text-white text-xs p-2 rounded w-48 z-10">The total amount you want to borrow to purchase your vehicle.</div>
              )}
            </div>
          </div>
          <div className="bg-[#0050B2] text-white px-4 py-2 rounded-lg font-bold">{formatCurrency(loanAmount)}</div>
        </div>

        <input type="range" min="100000" max={vehicleConfigs[vehicleType].maxAmount} step="25000" value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))} className="w-full h-3 bg-gray-200 rounded-lg cursor-pointer slider" style={{ '--fill-percent': getFillPercentage(loanAmount, 100000, vehicleConfigs[vehicleType].maxAmount) } as React.CSSProperties} />
        <div className="flex justify-between text-sm text-gray-500"><span>₹1L</span><span>{formatCurrency(vehicleConfigs[vehicleType].maxAmount)}</span></div>
      </div>

      {/* Interest Rate */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <label className="text-lg font-semibold text-gray-900">Interest Rate (% p.a.)</label>
            <div className="relative">
              <InfoIcon className="w-4 h-4 text-gray-400 cursor-help" onMouseEnter={() => setShowTooltip('interestRate')} onMouseLeave={() => setShowTooltip(null)} />
              {showTooltip === 'interestRate' && (
                <div className="absolute bottom-6 left-0 bg-gray-900 text-white text-xs p-2 rounded w-48 z-10">The annual interest rate charged by the lender.</div>
              )}
            </div>
          </div>
          <div className="bg-[#0050B2] text-white px-4 py-2 rounded-lg font-bold">{interestRate}%</div>
        </div>

        <input type="range" min={vehicleConfigs[vehicleType].minRate} max={vehicleConfigs[vehicleType].maxRate} step="0.1" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} className="w-full h-3 bg-gray-200 rounded-lg cursor-pointer slider" style={{ '--fill-percent': getFillPercentage(interestRate, vehicleConfigs[vehicleType].minRate, vehicleConfigs[vehicleType].maxRate) } as React.CSSProperties} />
        <div className="flex justify-between text-sm text-gray-500"><span>{vehicleConfigs[vehicleType].minRate}%</span><span>{vehicleConfigs[vehicleType].maxRate}%</span></div>
      </div>

      {/* Loan Tenure */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <label className="text-lg font-semibold text-gray-900">Loan Tenure</label>
            <div className="relative">
              <InfoIcon className="w-4 h-4 text-gray-400 cursor-help" onMouseEnter={() => setShowTooltip('tenure')} onMouseLeave={() => setShowTooltip(null)} />
              {showTooltip === 'tenure' && (
                <div className="absolute bottom-6 left-0 bg-gray-900 text-white text-xs p-2 rounded w-48 z-10">The period over which you'll repay the loan.</div>
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

        <input type="range" min={tenureType === 'years' ? '1' : '12'} max={tenureType === 'years' ? '7' : '84'} step="1" value={loanTenure} onChange={(e) => setLoanTenure(Number(e.target.value))} className="w-full h-3 bg-gray-200 rounded-lg cursor-pointer slider" style={{ '--fill-percent': getFillPercentage(loanTenure, Number(tenureType === 'years' ? '1' : '12'), Number(tenureType === 'years' ? '7' : '84')) } as React.CSSProperties} />
        <div className="flex justify-between text-sm text-gray-500"><span>{tenureType === 'years' ? '1 Year' : '12 Months'}</span><span>{tenureType === 'years' ? '7 Years' : '84 Months'}</span></div>
      </div>

      {/* Processing Fee */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <label className="text-lg font-semibold text-gray-900">Processing Fee (%)</label>
            <div className="relative">
              <InfoIcon className="w-4 h-4 text-gray-400 cursor-help" onMouseEnter={() => setShowTooltip('processingFee')} onMouseLeave={() => setShowTooltip(null)} />
              {showTooltip === 'processingFee' && (
                <div className="absolute bottom-6 left-0 bg-gray-900 text-white text-xs p-2 rounded w-48 z-10">One-time fee charged by lenders for processing your loan application</div>
              )}
            </div>
          </div>
          <div className="bg-[#0050B2] text-white px-4 py-2 rounded-lg font-bold">{processingFee}%</div>
        </div>

        <input type="range" min="0" max="5" step="0.1" value={processingFee} onChange={(e) => setProcessingFee(Number(e.target.value))} className="w-full h-3 bg-gray-200 rounded-lg cursor-pointer slider" style={{ '--fill-percent': getFillPercentage(processingFee, 0, 5) } as React.CSSProperties} />
        <div className="flex justify-between text-sm text-gray-500"><span>0%</span><span>5%</span></div>
      </div>
    </div>
  );
};
