import React, { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { CheckIcon, CalculatorIcon } from "lucide-react";

export const InsuranceCalculatorPage = (): JSX.Element => {
  const [coverAmount, setCoverAmount] = useState(500000);
  const [age, setAge] = useState(30);
  const [members, setMembers] = useState(1);
  const [activeSection, setActiveSection] = useState('calculator');
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

  const getFillPercentage = (value: number, min: number, max: number) => `${Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100))}%`;

  const calculatePremium = () => {
    const base = coverAmount * 0.025; // 2.5% base
    const ageMultiplier = 1 + (age - 30) * 0.015;
    const memberMultiplier = 0.7 + members * 0.3;
    const premium = Math.round(base * ageMultiplier * memberMultiplier);
    return premium;
  };

  const premium = calculatePremium();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = isTabSticky ? 80 : 0;
      window.scrollTo({ top: el.offsetTop - offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <section id="hero-section" className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-16">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mb-8">
            <nav className="flex items-center space-x-2 text-sm">
              <a href="/" className="text-blue-600 hover:text-blue-800">Home</a>
              <span className="text-gray-400">/</span>
              <a href="/calculators" className="text-blue-600 hover:text-blue-800">Calculators</a>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600">Insurance Calculator</span>
            </nav>
          </div>

          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-[#0050B2] to-[#003d8a] rounded-2xl flex items-center justify-center shadow-lg">
                <CalculatorIcon className="w-8 h-8 text-white" />
              </div>
            </div>

            <h1 className="text-4xl font-bold mb-4">Insurance Premium Calculator</h1>
            <p className="text-lg text-gray-600">Estimate annual premium for your desired coverage.</p>
          </div>
        </div>
      </section>

      <div className={`${isTabSticky ? 'fixed top-0 left-0 right-0 z-50 shadow-lg' : 'relative'} bg-white border-b border-gray-200`}> 
        <div className="container mx-auto max-w-7xl px-4 py-3">
          <div className="flex justify-center">
            {/* <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button onClick={() => scrollToSection('calculator')} className="px-6 py-2 text-sm font-medium rounded-lg bg-[#0050B2] text-white">Calculator</button>
            </div> */}
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-16">
        <Card className="shadow-2xl border-0 rounded-2xl overflow-hidden">
          <CardContent className="p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold">Estimate Your Premium</h3>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="font-semibold">Coverage Amount</label>
                    <div className="font-bold">₹{(coverAmount/100000).toFixed(1)}L</div>
                  </div>
                  <input type="range" min="100000" max="10000000" step="100000" value={coverAmount} onChange={(e)=>setCoverAmount(Number(e.target.value))} className="w-full h-3 slider" style={{ '--fill-percent': getFillPercentage(coverAmount,100000,10000000)} as React.CSSProperties}/>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="font-semibold">Age</label>
                    <div className="font-bold">{age} yrs</div>
                  </div>
                  <input type="range" min="18" max="70" value={age} onChange={(e)=>setAge(Number(e.target.value))} className="w-full h-3 slider" style={{ '--fill-percent': getFillPercentage(age,18,70)} as React.CSSProperties}/>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="font-semibold">Family Members</label>
                    <div className="font-bold">{members}</div>
                  </div>
                  <input type="range" min="1" max="6" value={members} onChange={(e)=>setMembers(Number(e.target.value))} className="w-full h-3 slider" style={{ '--fill-percent': getFillPercentage(members,1,6)} as React.CSSProperties}/>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-r from-[#0050B2] to-[#003d8a] rounded-2xl p-8 text-white text-center">
                  <h3 className="text-lg font-semibold mb-2">Estimated Annual Premium</h3>
                  <div className="text-4xl font-bold">₹{premium.toLocaleString()}</div>
                  <div className="text-sm mt-2">Monthly ~ ₹{Math.round(premium/12).toLocaleString()}</div>
                  <Button className="mt-6 bg-white text-[#0050B2]">Compare Plans</Button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center"><CheckIcon className="w-4 h-4 text-blue-600"/></div>
                    <div>
                      <div className="font-semibold">Quick Estimate</div>
                      <div className="text-sm text-gray-600">This gives a simple estimate to help you plan your budget.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InsuranceCalculatorPage;
