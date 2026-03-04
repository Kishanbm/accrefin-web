import React from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { AmortRow } from '../../../utils/calculations';
import { formatCurrency } from '../../../utils/formatters';

type Props = { schedule: AmortRow[] };

export const AmortizationTable: React.FC<Props> = ({ schedule }) => {
  return (
    <Card className="shadow-xl border-0">
      <CardContent className="p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Amortization Schedule (First 12 Months)</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0050B2] text-white">
              <tr>
                <th className="px-4 py-3 text-left">Month</th>
                <th className="px-4 py-3 text-left">EMI</th>
                <th className="px-4 py-3 text-left">Principal</th>
                <th className="px-4 py-3 text-left">Interest</th>
                <th className="px-4 py-3 text-left">Balance</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((row, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-4 py-3 font-medium">{row.month}</td>
                  <td className="px-4 py-3">{formatCurrency(row.emi)}</td>
                  <td className="px-4 py-3">{formatCurrency(row.principal)}</td>
                  <td className="px-4 py-3">{formatCurrency(row.interest)}</td>
                  <td className="px-4 py-3">{formatCurrency(row.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
