import React from 'react';
import { ApplicationFormData } from '../ApplicationPage';

type Props = {
  data: ApplicationFormData;
};

const ReviewSubmit = ({ data }: Props) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Review your details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="text-sm text-gray-500">Full name</div>
          <div className="font-medium">{data.fullName || '—'}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Mobile</div>
          <div className="font-medium">{data.mobile || '—'}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Email</div>
          <div className="font-medium">{data.email || '—'}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Occupation</div>
          <div className="font-medium">{data.occupation || '—'}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Company</div>
          <div className="font-medium">{data.company || '—'}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Designation</div>
          <div className="font-medium">{data.designation || '—'}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Monthly Income</div>
          <div className="font-medium">{data.monthlyIncome || '—'}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Desired Loan Amount</div>
          <div className="font-medium">{data.desiredLoanAmount || '—'}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Tenure</div>
          <div className="font-medium">{data.tenureMonths ? `${data.tenureMonths} months` : '—'}</div>
        </div>
      </div>

      <div>
        <div className="text-sm text-gray-500">Uploaded documents</div>
        {data.documents && data.documents.length > 0 ? (
          <ul className="list-disc pl-5 mt-2 text-sm">
            {data.documents.map((d, i) => <li key={i}>{d}</li>)}
          </ul>
        ) : (
          <div className="text-sm text-gray-500">No files uploaded</div>
        )}
      </div>
    </div>
  );
};

export default ReviewSubmit;
