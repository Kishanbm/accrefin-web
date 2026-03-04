import React from 'react';
import { Input } from '../../../../components/ui/input';
import { ApplicationFormData } from '../ApplicationPage';

type Props = {
  data: ApplicationFormData;
  onChange: <K extends keyof ApplicationFormData>(key: K, value: ApplicationFormData[K]) => void;
};

const FinancialDetails = ({ data, onChange }: Props) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700">Desired loan amount (₹)</label>
        <Input value={data.desiredLoanAmount} onChange={(e) => onChange('desiredLoanAmount', e.target.value)} placeholder="e.g. 500000" />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Tenure (months)</label>
        <Input value={data.tenureMonths} onChange={(e) => onChange('tenureMonths', e.target.value)} placeholder="e.g. 36" />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Annual turnover (if applicable)</label>
        <Input value={data.annualTurnover} onChange={(e) => onChange('annualTurnover', e.target.value)} placeholder="e.g. 1200000" />
      </div>
    </div>
  );
};

export default FinancialDetails;
