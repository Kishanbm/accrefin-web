import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { CalculatorIcon, CheckIcon } from 'lucide-react';

export const MutualFundCalculatorPage = (): JSX.Element => {
  const [monthlySip, setMonthlySip] = useState(5000);
  const [annualReturn, setAnnualReturn] = useState(12);
  const [years, setYears] = useState(10);
  const [isTabSticky, setIsTabSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const hero = document.getElementById('hero-section');
      if (hero) {
        const heroBottom = hero.offsetTop + hero.offsetHeight;
        setIsTabSticky(window.scrollY > heroBottom - 100);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getFill = (v:number, min:number, max:number) => `${((v-min)/(max-min))*100}%`;

  // SIP future value formula: A = P * [ ( (1+r)^n -1 ) / r ] * (1+r)
  const calculateMaturity = () => {
    const r = annualReturn/100/12;
    const n = years*12;
    if (r === 0) return monthlySip * n;
    const factor = (Math.pow(1+r, n) - 1)/r;
    const maturity = monthlySip * factor * (1+r);
    return Math.round(maturity);
  };

  const maturity = calculateMaturity();

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
              <span className="text-gray-600">Mutual Fund Calculator</span>
            </nav>
          </div>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-[#0050B2] to-[#003d8a] rounded-2xl flex items-center justify-center shadow-lg">
              <CalculatorIcon className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">Mutual Fund SIP Calculator</h1>
          <p className="text-lg text-gray-600">Estimate corpus for a monthly SIP at an expected return.</p>
        </div>
      </section>

      <div className="container mx-auto max-w-7xl px-4 py-16">
        <Card className="shadow-2xl border-0 rounded-2xl overflow-hidden">
          <CardContent className="p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2"><label className="font-semibold">Monthly SIP</label><div className="font-bold">₹{monthlySip.toLocaleString()}</div></div>
                  <input type="range" min="500" max="200000" step="500" value={monthlySip} onChange={(e)=>setMonthlySip(Number(e.target.value))} className="w-full h-3 slider" style={{'--fill-percent': getFill(monthlySip,500,200000)} as React.CSSProperties}/>
                </div>

                <div>
                  <div className="flex justify-between mb-2"><label className="font-semibold">Expected Annual Return</label><div className="font-bold">{annualReturn}%</div></div>
                  <input type="range" min="1" max="25" value={annualReturn} onChange={(e)=>setAnnualReturn(Number(e.target.value))} className="w-full h-3 slider" style={{'--fill-percent': getFill(annualReturn,1,25)} as React.CSSProperties}/>
                </div>

                <div>
                  <div className="flex justify-between mb-2"><label className="font-semibold">Investment Duration (Years)</label><div className="font-bold">{years}</div></div>
                  <input type="range" min="1" max="40" value={years} onChange={(e)=>setYears(Number(e.target.value))} className="w-full h-3 slider" style={{'--fill-percent': getFill(years,1,40)} as React.CSSProperties}/>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-r from-[#0050B2] to-[#003d8a] rounded-2xl p-8 text-white text-center">
                  <h3 className="text-lg font-semibold mb-2">Estimated Maturity</h3>
                  <div className="text-4xl font-bold">₹{maturity.toLocaleString()}</div>
                  <div className="text-sm mt-2">Total Invested: ₹{(monthlySip*years*12).toLocaleString()}</div>
                  <Button className="mt-6 bg-white text-[#0050B2]">See Suggested Funds</Button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3"><div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center"><CheckIcon className="w-4 h-4 text-blue-600"/></div><div><div className="font-semibold">SIP Advantage</div><div className="text-sm text-gray-600">Rupee cost averaging and disciplined investing.</div></div></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MutualFundCalculatorPage;
