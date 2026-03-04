import React from 'react';
import { AmortRow } from '../../../utils/calculations';
import { formatCurrency } from '../../../utils/formatters';

type Props = {
  schedule: AmortRow[];
};

export const AmortizationTable: React.FC<Props> = ({ schedule }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow p-4">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-gray-500">
            <th className="px-3 py-2">Month</th>
            <th className="px-3 py-2">Principal</th>
            <th className="px-3 py-2">Interest</th>
            <th className="px-3 py-2">EMI</th>
            <th className="px-3 py-2">Remaining</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((row) => (
            <tr key={row.month} className="border-t border-gray-100">
              <td className="px-3 py-2">{row.month}</td>
              <td className="px-3 py-2">{formatCurrency(row.principalPaid)}</td>
              <td className="px-3 py-2">{formatCurrency(row.interestPaid)}</td>
              <td className="px-3 py-2">{formatCurrency(row.emi)}</td>
              <td className="px-3 py-2">{formatCurrency(row.remainingBalance)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
