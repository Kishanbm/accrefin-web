import React, { useState } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { CalculatorIcon, CheckIcon } from 'lucide-react';

export const CreditCardCalculatorPage = (): JSX.Element => {
  const [balance, setBalance] = useState(50000);
  const [annualRate, setAnnualRate] = useState(24);
  const [monthlyPayment, setMonthlyPayment] = useState(2000);

  const calculatePayoff = () => {
    const monthlyRate = annualRate / 12 / 100;
    let bal = balance;
    let months = 0;
    let totalInterest = 0;
    const maxMonths = 600;
    if (monthlyPayment <= bal * monthlyRate) return { months: Infinity, totalInterest: Infinity };
    while (bal > 0 && months < maxMonths) {
      const interest = bal * monthlyRate;
      totalInterest += interest;
      bal = bal + interest - monthlyPayment;
      months++;
      if (months > maxMonths) break;
    }
    return { months, totalInterest: Math.round(totalInterest) };
  };

  const { months, totalInterest } = calculatePayoff();

  return (
    <div className="min-h-screen bg-white">
      <section id="hero-section" className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-16">
        <div className="container mx-auto max-w-7xl px-4 text-center">
          <div className="mb-8">
            <nav className="flex items-center space-x-2 text-sm justify-center">
              <a href="/" className="text-blue-600 hover:text-blue-800">Home</a>
              <span className="text-gray-400">/</span>
              <a href="/calculators" className="text-blue-600 hover:text-blue-800">Calculators</a>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600">Credit Card Calculator</span>
            </nav>
          </div>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-[#0050B2] to-[#003d8a] rounded-2xl flex items-center justify-center shadow-lg">
              <CalculatorIcon className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">Credit Card Payoff Calculator</h1>
          <p className="text-lg text-gray-600">Estimate how long it will take to clear your credit card balance.</p>
        </div>
      </section>

      <div className="container mx-auto max-w-7xl px-4 py-16">
        <Card className="shadow-2xl border-0 rounded-2xl overflow-hidden">
          <CardContent className="p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2"><label className="font-semibold">Outstanding Balance</label><div className="font-bold">₹{balance.toLocaleString()}</div></div>
                  <input type="range" min="1000" max="1000000" step="500" value={balance} onChange={(e)=>setBalance(Number(e.target.value))} className="w-full h-3 slider" style={{'--fill-percent': `${((balance-1000)/(1000000-1000))*100}%`} as React.CSSProperties}/>
                </div>

                <div>
                  <div className="flex justify-between mb-2"><label className="font-semibold">Annual Interest Rate</label><div className="font-bold">{annualRate}%</div></div>
                  <input type="range" min="5" max="60" value={annualRate} onChange={(e)=>setAnnualRate(Number(e.target.value))} className="w-full h-3 slider" style={{'--fill-percent': `${((annualRate-5)/(60-5))*100}%`} as React.CSSProperties}/>
                </div>

                <div>
                  <div className="flex justify-between mb-2"><label className="font-semibold">Planned Monthly Payment</label><div className="font-bold">₹{monthlyPayment.toLocaleString()}</div></div>
                  <input type="range" min="500" max="200000" step="100" value={monthlyPayment} onChange={(e)=>setMonthlyPayment(Number(e.target.value))} className="w-full h-3 slider" style={{'--fill-percent': `${((monthlyPayment-500)/(200000-500))*100}%`} as React.CSSProperties}/>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-r from-[#0050B2] to-[#003d8a] rounded-2xl p-8 text-white text-center">
                  <h3 className="text-lg font-semibold mb-2">Payoff Estimate</h3>
                  {months === Infinity ? (
                    <div className="text-sm">Your monthly payment is too low to cover even the interest. Increase payment.</div>
                  ) : (
                    <>
                      <div className="text-4xl font-bold">{months} months</div>
                      <div className="text-sm mt-2">Total Interest ~ ₹{totalInterest.toLocaleString()}</div>
                    </>
                  )}
                  <Button className="mt-6 bg-white text-[#0050B2]">Get Repayment Options</Button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3"><div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center"><CheckIcon className="w-4 h-4 text-blue-600"/></div><div><div className="font-semibold">Tip</div><div className="text-sm text-gray-600">Pay more than the minimum due to reduce interest burden quickly.</div></div></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreditCardCalculatorPage;
