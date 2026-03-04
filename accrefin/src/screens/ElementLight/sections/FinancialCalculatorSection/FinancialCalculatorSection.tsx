import { useState, useEffect } from "react";
import { Button } from "../../../../components/ui/button";

const TunnelGrid = ({ color = "rgba(100,150,220,0.22)" }: { color?: string }) => {
  const W = 1440, H = 900;
  const vx = W / 2, vy = H / 2;
  const wallT = 0.30;
  const wallX = vx - vx * wallT, wallY = vy - vy * wallT;
  const wallW = W * wallT, wallH = H * wallT;
  const wallX2 = wallX + wallW, wallY2 = wallY + wallH;
  const numFan = 16;
  const fanLines: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let i = 0; i <= numFan; i++) {
    const t = i / numFan;
    fanLines.push({ x1: W * t, y1: 0, x2: wallX + wallW * t, y2: wallY });
    fanLines.push({ x1: W * t, y1: H, x2: wallX + wallW * t, y2: wallY2 });
    fanLines.push({ x1: 0, y1: H * t, x2: wallX, y2: wallY + wallH * t });
    fanLines.push({ x1: W, y1: H * t, x2: wallX2, y2: wallY + wallH * t });
  }
  const rings = [0.95, 0.82, 0.68, 0.54, 0.40, wallT].map(t => ({
    x: vx - vx * t, y: vy - vy * t, w: W * t, h: H * t,
  }));
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        {fanLines.map((l, i) => <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={color} strokeWidth="0.6" />)}
        {rings.map((r, i) => <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} fill="none" stroke={color} strokeWidth="0.6" />)}
      </svg>
    </div>
  );
};

const calculatorTypes = [
  { id: "home-loan", label: "Home Loan" },
  { id: "personal-loan", label: "Personal Loan" },
  { id: "car-loan", label: "Car Loan" },
  { id: "business-loan", label: "Business Loan" },
];

const configs: Record<string, {
  maxAmount: number; minAmount: number;
  maxYears: number; minYears: number;
  defaultRate: number; minRate: number; maxRate: number;
  title: string;
}> = {
  "home-loan": {
    maxAmount: 50000000, minAmount: 100000,
    maxYears: 30, minYears: 1,
    defaultRate: 8, minRate: 6.5, maxRate: 15,
    title: "Home Loan\nEMI Calculator",
  },
  "personal-loan": {
    maxAmount: 5000000, minAmount: 25000,
    maxYears: 7, minYears: 1,
    defaultRate: 10.5, minRate: 9.5, maxRate: 24,
    title: "Personal Loan\nEMI Calculator",
  },
  "car-loan": {
    maxAmount: 2000000, minAmount: 100000,
    maxYears: 7, minYears: 1,
    defaultRate: 9.5, minRate: 7.5, maxRate: 18,
    title: "Car Loan\nEMI Calculator",
  },
  "business-loan": {
    maxAmount: 10000000, minAmount: 100000,
    maxYears: 10, minYears: 1,
    defaultRate: 12, minRate: 10, maxRate: 24,
    title: "Business Loan\nEMI Calculator",
  },
};

const fmt = (n: number) =>
  `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

const fmtDec = (n: number) =>
  `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const FinancialCalculatorSection = (): JSX.Element => {
  const [active, setActive] = useState("home-loan");
  const [loanAmount, setLoanAmount] = useState(30000000);
  const [loanYears, setLoanYears] = useState(30);
  const [interestRate, setInterestRate] = useState(8);

  const config = configs[active];

  useEffect(() => {
    setInterestRate(config.defaultRate);
    setLoanAmount(Math.min(loanAmount, config.maxAmount));
    setLoanYears(Math.min(loanYears, config.maxYears));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const monthlyRate = interestRate / 12 / 100;
  const n = loanYears * 12;
  const emi = monthlyRate === 0
    ? loanAmount / n
    : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, n)) /
      (Math.pow(1 + monthlyRate, n) - 1);
  const totalAmount = emi * n;
  const totalInterest = totalAmount - loanAmount;
  const monthlyInterest = totalInterest / n;

  const pct = (v: number, min: number, max: number) =>
    `${Math.max(0, Math.min(100, ((v - min) / (max - min)) * 100))}%`;

  const handleTabChange = (id: string) => setActive(id);

  return (
    <section className="w-full relative overflow-hidden" style={{ background: "#F4F9FF" }}>

      <TunnelGrid />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 lg:px-8 py-20">

        {/* Tab strip — centered pill buttons */}
        <div className="flex justify-center flex-wrap gap-3 mb-10">
          {calculatorTypes.map((t) => (
            <button
              key={t.id}
              onClick={() => handleTabChange(t.id)}
              className="transition-all duration-200"
              style={{
                fontFamily: "'DM Sans', Helvetica, sans-serif",
                fontWeight: 500,
                fontSize: "15px",
                lineHeight: "1",
                padding: "10px 20px",
                borderRadius: "99px",
                border: active === t.id ? "none" : "1px solid #D0D5DD",
                background: active === t.id ? "#1664F5" : "#FFFFFF",
                color: active === t.id ? "#FFFFFF" : "#464646",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Calculator layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left — heading + sliders */}
          <div className="flex flex-col gap-8">
            {/* "Starting today to X years" label */}
            <div
              className="flex items-center gap-3 uppercase"
              style={{
                fontFamily: "'DM Sans', Helvetica, sans-serif",
                fontWeight: 700,
                fontSize: "13px",
                letterSpacing: "0.08em",
                color: "#6B7280",
              }}
            >
              <span>Starting Today To Years</span>
              <span
                className="font-bold"
                style={{
                  padding: "4px 12px",
                  borderRadius: "8px",
                  background: "#FFFFFF",
                  border: "1px solid #D0E4FF",
                  color: "#111827",
                  fontSize: "14px",
                }}
              >
                {loanYears}
              </span>
              <span>Years</span>
            </div>

            {/* Big heading — Power Grotesk matching Figma */}
            <h2
              className="text-[#283340] whitespace-pre-line"
              style={{
                fontFamily: "'Power Grotesk', 'Plus Jakarta Sans', 'DM Sans', sans-serif",
                fontWeight: 400,
                fontSize: "clamp(2.5rem, 5vw, 64px)",
                lineHeight: "1.1",
              }}
            >
              {config.title}
            </h2>

            <p
              style={{
                fontFamily: "'DM Sans', Helvetica, sans-serif",
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "24px",
                color: "#6B7280",
                maxWidth: "360px",
              }}
            >
              Calculate your monthly EMI and plan your finances with our easy-to-use calculator
            </p>

            <Button
              className="w-fit text-white font-bold uppercase rounded-lg"
              style={{
                fontFamily: "'DM Sans', Helvetica, sans-serif",
                fontSize: "13px",
                letterSpacing: "0.06em",
                padding: "12px 28px",
                background: "#1664F5",
              }}
              asChild
            >
              <a href="/application">APPLY QUICK LOAN</a>
            </Button>

            {/* Sliders */}
            <div className="flex flex-col gap-6 mt-2">
              {/* Loan Amount slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Loan Amount</span>
                  <span className="text-sm font-semibold text-gray-900">{fmt(loanAmount)}</span>
                </div>
                <input
                  type="range"
                  min={config.minAmount}
                  max={config.maxAmount}
                  step={50000}
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full cursor-pointer appearance-none"
                  style={{
                    background: `linear-gradient(to right, #1664F5 ${pct(loanAmount, config.minAmount, config.maxAmount)}, #E0E7FF ${pct(loanAmount, config.minAmount, config.maxAmount)})`,
                  }}
                />
              </div>

              {/* Tenure slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Loan Tenure</span>
                  <span className="text-sm font-semibold text-gray-900">{loanYears} Yrs</span>
                </div>
                <input
                  type="range"
                  min={config.minYears}
                  max={config.maxYears}
                  step={1}
                  value={loanYears}
                  onChange={(e) => setLoanYears(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full cursor-pointer appearance-none"
                  style={{
                    background: `linear-gradient(to right, #1664F5 ${pct(loanYears, config.minYears, config.maxYears)}, #E0E7FF ${pct(loanYears, config.minYears, config.maxYears)})`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Right — results table */}
          <div className="flex flex-col gap-0 divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
            {[
              { label: "Loan Amount", value: fmt(loanAmount) },
              { label: "Interest Rate", value: `${interestRate}%` },
              { label: "Monthly Interest", value: fmtDec(monthlyInterest) },
              { label: "Total Interest", value: fmtDec(totalInterest) },
              { label: "Total Amount Payable", value: fmtDec(totalAmount) },
            ].map((row, i) => (
              <div key={i} className="flex items-center justify-between px-6 py-4 bg-white">
                <span className="text-sm text-gray-600">{row.label}</span>
                <span className="text-sm font-semibold text-gray-900 bg-gray-50 border border-gray-100 rounded-lg px-4 py-1.5">
                  {row.value}
                </span>
              </div>
            ))}

            {/* Monthly EMI — highlighted (match other rows visually) */}
            <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
              <span className="text-sm font-semibold text-[#1664F5]">Monthly EMI</span>
              <span className="text-sm font-bold bg-gray-50 px-4 py-1.5 rounded-lg text-[#1664F5] border border-[#C7D8FF]">
                {fmt(emi)}
              </span>
            </div>

            {/* Interest rate slider inside the card */}
            <div className="px-6 py-5 bg-white">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Interest Rate</span>
                <span className="text-sm font-semibold text-gray-900">{interestRate}%</span>
              </div>
              <input
                type="range"
                min={config.minRate}
                max={config.maxRate}
                step={0.1}
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-1.5 rounded-full cursor-pointer appearance-none"
                style={{
                  background: `linear-gradient(to right, #1664F5 ${pct(interestRate, config.minRate, config.maxRate)}, #E0E7FF ${pct(interestRate, config.minRate, config.maxRate)})`,
                }}
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>{config.minRate}%</span>
                <span>{config.maxRate}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Range input thumb style */}
      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #1664F5;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 1px 4px rgba(22,100,245,0.3);
        }
        input[type=range]::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #1664F5;
          cursor: pointer;
          border: 2px solid #fff;
        }
      `}</style>
    </section>
  );
};
