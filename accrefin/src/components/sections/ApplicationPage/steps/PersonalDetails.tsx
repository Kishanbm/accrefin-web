import React from 'react';
import { Input } from '../../../../components/ui/input';
import { ApplicationFormData } from '../ApplicationPage';

type Props = {
  data: ApplicationFormData;
  onChange: <K extends keyof ApplicationFormData>(key: K, value: ApplicationFormData[K]) => void;
};

const PersonalDetails = ({ data, onChange }: Props) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700">Full name</label>
        <Input autoFocus value={data.fullName} onChange={(e) => onChange('fullName', e.target.value)} placeholder="Enter full name" />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Mobile number</label>
        <Input value={data.mobile} onChange={(e) => onChange('mobile', e.target.value)} placeholder="10-digit mobile" />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Email</label>
        <Input value={data.email} onChange={(e) => onChange('email', e.target.value)} placeholder="you@example.com" />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Occupation</label>
        <select value={data.occupation} onChange={(e) => onChange('occupation', e.target.value)} className="w-full h-12 p-2 border rounded-lg">
          <option value="">Select occupation</option>
          <option value="salaried">Salaried</option>
          <option value="self-employed">Self Employed</option>
          <option value="business-owner">Business Owner</option>
        </select>
      </div>
    </div>
  );
};

export default PersonalDetails;
