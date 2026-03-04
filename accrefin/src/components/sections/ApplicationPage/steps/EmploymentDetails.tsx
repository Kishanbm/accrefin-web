import React from 'react';
import { Input } from '../../../../components/ui/input';
import { ApplicationFormData } from '../ApplicationPage';

type Props = {
  data: ApplicationFormData;
  onChange: <K extends keyof ApplicationFormData>(key: K, value: ApplicationFormData[K]) => void;
};

const EmploymentDetails = ({ data, onChange }: Props) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700">Company / Employer</label>
        <Input value={data.company} onChange={(e) => onChange('company', e.target.value)} placeholder="Company name" />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Designation</label>
        <Input value={data.designation} onChange={(e) => onChange('designation', e.target.value)} placeholder="Your designation" />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Monthly income (₹)</label>
        <Input value={data.monthlyIncome} onChange={(e) => onChange('monthlyIncome', e.target.value)} placeholder="e.g. 50000" />
      </div>
    </div>
  );
};

export default EmploymentDetails;
