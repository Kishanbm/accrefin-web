import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { CalculatorIcon, CheckIcon } from 'lucide-react';

const RoomGrid = ({ color = "rgba(180,210,240,0.30)" }: { color?: string }) => {
  const W = 1440, H = 900, fw = W * 0.45, fh = H * 0.45;
  const fx = (W - fw) / 2, fy = (H - fh) / 2, fx2 = fx + fw, fy2 = fy + fh, n = 10;
  const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    lines.push({ x1: W * t, y1: 0, x2: fx + fw * t, y2: fy });
    lines.push({ x1: W * t, y1: H, x2: fx + fw * t, y2: fy2 });
    lines.push({ x1: 0, y1: H * t, x2: fx, y2: fy + fh * t });
    lines.push({ x1: W, y1: H * t, x2: fx2, y2: fy + fh * t });
  }
  for (let i = 1; i < n; i++) {
    const t = i / n;
    lines.push({ x1: fx * t, y1: fy * t, x2: W - fx * t, y2: fy * t });
    lines.push({ x1: fx * t, y1: H - fy * t, x2: W - fx * t, y2: H - fy * t });
    lines.push({ x1: fx * t, y1: fy * t, x2: fx * t, y2: H - fy * t });
    lines.push({ x1: W - fx * t, y1: fy * t, x2: W - fx * t, y2: H - fy * t });
    lines.push({ x1: fx + fw * t, y1: fy, x2: fx + fw * t, y2: fy2 });
    lines.push({ x1: fx, y1: fy + fh * t, x2: fx2, y2: fy + fh * t });
  }
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        {lines.map((l, i) => <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={color} strokeWidth="0.7" />)}
        <rect x={fx} y={fy} width={fw} height={fh} fill="none" stroke={color} strokeWidth="0.7" />
      </svg>
    </div>
  );
};

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

  const headingFont = "font-['Power_Grotesk',_'DM_Sans',_sans-serif]";
  const bodyFont = "font-['DM_Sans',_sans-serif]";

  return (
    <div className="min-h-screen bg-white">
      <section id="hero-section" className="bg-white relative overflow-hidden">
        <RoomGrid />
        <div className="container mx-auto max-w-7xl px-6 pt-8 pb-0 relative z-10">
          <div className="flex justify-center mb-10">
            <div className="flex items-center gap-2 border border-gray-300 rounded-full px-5 py-2.5 bg-gray-50 backdrop-blur-sm">
              <svg className="w-5 h-5 text-[#0050B2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className={`text-gray-700 text-sm ${bodyFont}`}>India's most trusted platform</span>
            </div>
          </div>
          <div className="mb-6">
            <nav className={`flex items-center space-x-2 text-sm ${bodyFont}`}>
              <a href="/" className="text-gray-600 hover:text-gray-800">Home</a>
              <span className="text-gray-400">/</span>
              <a href="/calculators" className="text-gray-600 hover:text-gray-800">Calculators</a>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600">Mutual Fund Calculator</span>
            </nav>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center pb-14">
            <h1 className={`text-4xl lg:text-5xl xl:text-[56px] font-normal text-gray-900 leading-[1.15] tracking-tight ${headingFont}`}>
              Mutual Fund SIP<br />Calculator
            </h1>
            <p className={`text-xl text-gray-600 leading-relaxed ${bodyFont} font-medium`}>
              Estimate your future corpus with disciplined monthly SIP investing at your expected returns.
            </p>
          </div>
        </div>
        <div className="bg-[#0e396d] border-t border-white/10 relative z-10">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="flex items-center justify-between flex-wrap lg:flex-nowrap">
              {[
                { title: "15%+", desc: "Long-term SIP returns" },
                { title: "₹500/mo", desc: "Start small, grow big" },
                { title: "SEBI", desc: "Regulated & safe" },
                { title: "Tax Benefits", desc: "ELSS tax savings" }
              ].map((item, index, arr) => (
                <React.Fragment key={item.title}>
                  <div className="flex flex-col items-start gap-4 py-10 px-10 flex-1">
                    <h3 className={`font-normal text-white text-[22px] leading-[1.3] ${headingFont}`}>{item.title}</h3>
                    <p className={`text-[#a0cfff] text-base font-medium leading-[1.3] ${bodyFont}`}>{item.desc}</p>
                  </div>
                  {index < arr.length - 1 && <div className="hidden lg:block w-px h-[100px] bg-white/15 flex-shrink-0" />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-7xl px-4 py-16">
        <Card className="shadow-2xl border-0 rounded-2xl overflow-hidden">
          <CardContent className="p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="font-semibold">Monthly SIP</label>
                    <div className="flex items-center gap-1 bg-[#0050B2] text-white px-3 py-1 rounded-lg font-bold">
                      <span className="text-xs">₹</span>
                      <input type="number" value={monthlySip} min={500} max={200000} step={500} onChange={(e) => { const v = Number(e.target.value); if (v >= 500 && v <= 200000) setMonthlySip(v); }} className="bg-transparent text-white font-bold text-right w-24 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                    </div>
                  </div>
                  <input type="range" min="500" max="200000" step="500" value={monthlySip} onChange={(e)=>setMonthlySip(Number(e.target.value))} className="w-full h-3 slider" style={{'--fill-percent': getFill(monthlySip,500,200000)} as React.CSSProperties}/>
                </div>

                <div>
                  <div className="flex justify-between mb-2"><label className="font-semibold">Expected Annual Return</label><div className="font-bold">{annualReturn}%</div></div>
                  <input type="range" min="1" max="25" value={annualReturn} onChange={(e)=>setAnnualReturn(Number(e.target.value))} className="w-full h-3 slider" style={{'--fill-percent': getFill(annualReturn,1,25)} as React.CSSProperties}/>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="font-semibold">Investment Duration (Years)</label>
                    <div className="flex items-center gap-1 bg-[#0050B2] text-white px-3 py-1 rounded-lg font-bold">
                      <input type="number" value={years} min={1} max={40} step={1} onChange={(e) => { const v = Number(e.target.value); if (v >= 1 && v <= 40) setYears(v); }} className="bg-transparent text-white font-bold text-right w-10 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                      <span className="text-xs">Yrs</span>
                    </div>
                  </div>
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
