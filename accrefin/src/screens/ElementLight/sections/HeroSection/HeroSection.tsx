import { Button } from "../../../../components/ui/button";
import { StarIcon } from "lucide-react";

const headingFont = "font-['Power_Grotesk',_'DM_Sans',_sans-serif]";
const bodyFont = "font-['DM_Sans',_sans-serif]";

const RoomGrid = ({ color = "rgba(180,210,240,0.30)" }: { color?: string }) => {
  const W = 1440, H = 900;
  // Front wall — large rectangle centered, ~45% of viewport
  const fw = W * 0.45, fh = H * 0.45;
  const fx = (W - fw) / 2, fy = (H - fh) / 2;
  const fx2 = fx + fw, fy2 = fy + fh;
  const vx = W / 2, vy = H / 2;
  const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
  const n = 10; // grid divisions

  // Ceiling: top edge → top of front wall, with horizontal cross-lines
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    lines.push({ x1: W * t, y1: 0, x2: fx + fw * t, y2: fy }); // radial
  }
  for (let i = 1; i < n; i++) {
    const t = i / n;
    const x1 = W * t * 0 + (1 - t) * 0 + t * 0; // lerp outer left→right at depth t
    // Horizontal cross lines on ceiling at depth t
    const ox = W * t * 0; // left outer at this depth lerp
    const lx = fx * t + 0 * (1 - t);
    const rx = fx2 * t + W * (1 - t);
    const cy = fy * t + 0 * (1 - t);
    lines.push({ x1: lx, y1: cy, x2: rx, y2: cy });
  }

  // Floor: bottom edge → bottom of front wall
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    lines.push({ x1: W * t, y1: H, x2: fx + fw * t, y2: fy2 });
  }
  for (let i = 1; i < n; i++) {
    const t = i / n;
    const lx = fx * t + 0 * (1 - t);
    const rx = fx2 * t + W * (1 - t);
    const cy = fy2 * t + H * (1 - t);
    lines.push({ x1: lx, y1: cy, x2: rx, y2: cy });
  }

  // Left wall: left edge → left side of front wall
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    lines.push({ x1: 0, y1: H * t, x2: fx, y2: fy + fh * t });
  }
  for (let i = 1; i < n; i++) {
    const t = i / n;
    const ty = fy * t + 0 * (1 - t);
    const by = fy2 * t + H * (1 - t);
    const cx = fx * t + 0 * (1 - t);
    lines.push({ x1: cx, y1: ty, x2: cx, y2: by });
  }

  // Right wall: right edge → right side of front wall
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    lines.push({ x1: W, y1: H * t, x2: fx2, y2: fy + fh * t });
  }
  for (let i = 1; i < n; i++) {
    const t = i / n;
    const ty = fy * t + 0 * (1 - t);
    const by = fy2 * t + H * (1 - t);
    const cx = fx2 * t + W * (1 - t);
    lines.push({ x1: cx, y1: ty, x2: cx, y2: by });
  }

  // Front wall grid lines
  for (let i = 1; i < n; i++) {
    const t = i / n;
    lines.push({ x1: fx + fw * t, y1: fy, x2: fx + fw * t, y2: fy2 }); // vertical
    lines.push({ x1: fx, y1: fy + fh * t, x2: fx2, y2: fy + fh * t }); // horizontal
  }

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        {lines.map((l, i) => (
          <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={color} strokeWidth="0.7" />
        ))}
        {/* Front wall outline */}
        <rect x={fx} y={fy} width={fw} height={fh} fill="none" stroke={color} strokeWidth="0.7" />
      </svg>
    </div>
  );
};

export const HeroSection = (): JSX.Element => {
  return (
    <section
      className="w-full relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #FFFFFF 0%, #F4F9FF 100%)",
      }}
    >
      <RoomGrid />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 lg:px-8 pt-10 pb-0">

        {/* Rating badges row — centered */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          {/* Star rating */}
          <div className="flex items-center gap-2 border border-gray-200 rounded-full px-5 py-2.5 bg-white/80 backdrop-blur-sm shadow-sm">
            <StarIcon className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-600">4.9/5</span>
          </div>
          {/* Disbursed */}
          <div className="flex items-center gap-2 border border-gray-200 rounded-full px-5 py-2.5 bg-white/80 backdrop-blur-sm shadow-sm">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="2" y="7" width="20" height="14" rx="2" strokeWidth="2" />
              <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" strokeWidth="2" />
            </svg>
            <span className="text-sm font-medium text-gray-600">₹1,00,000 + Cr</span>
          </div>
          {/* Partners */}
          <div className="flex items-center gap-2 border border-gray-200 rounded-full px-5 py-2.5 bg-white/80 backdrop-blur-sm shadow-sm">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeWidth="2" />
            </svg>
            <span className="text-sm font-medium text-gray-600">275+</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[480px]">

          {/* Left — Content */}
          <div className="flex flex-col gap-7 pb-12">
            {/* Headline */}
            <div>
              <h1
                  className={`font-normal leading-tight text-[#283340] ${headingFont}`}
                  style={{
                    fontSize: "clamp(2.2rem, 4.5vw, 3.5rem)",
                    lineHeight: "1.15",
                    fontFamily: "'Power Grotesk', 'Plus Jakarta Sans', 'DM Sans', sans-serif",
                    fontWeight: 400,
                  }}
              >
                Get Closer to Your
                <br />
                Goals with Us
              </h1>
              <p className="mt-5 text-base text-gray-500 max-w-md leading-relaxed">
                Compare loan offers from 50+ lenders. Instant eligibility.
                <br />
                Transparent approval.
              </p>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4">
              <Button
                  className="px-8 py-4 text-sm font-semibold uppercase tracking-wide rounded-lg text-white shadow-md hover:shadow-lg transition-all"
                style={{ background: "#1664F5" }}
              >
                CHECK ELIGIBILITY
              </Button>
              <Button
                variant="outline"
                  className="px-8 py-4 text-sm font-semibold uppercase tracking-wide rounded-lg border-2 border-[#1664F5] text-[#1664F5] bg-transparent hover:bg-blue-50"
              >
                GET FREE CIBIL SCORE
              </Button>
            </div>
          </div>

          {/* Right — Dashboard card */}
          <div className="flex justify-center lg:justify-end items-center pb-0">
            <div className="relative w-full max-w-[480px]">

              {/* Dashboard window card */}
              <div
                className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
                style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.08)" }}
              >
                {/* Window chrome */}
                <div className="flex items-center gap-2 px-5 py-3 bg-gray-50 border-b border-gray-100">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400 inline-block" />
                  <div className="flex-1" />
                  {/* Accrefin icon */}
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center text-white font-bold text-[10px]"
                    style={{ background: "#1664F5" }}
                  >
                    A
                  </div>
                </div>

                <div className="p-5 flex gap-4">
                  {/* Left col — loan list */}
                  <div className="flex-1 flex flex-col gap-3 min-w-0">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Loan Dashboard</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">Your financial journey</p>
                    </div>
                    <hr className="border-gray-100" />
                    <p className="font-semibold text-gray-800 text-xs">Eligible Loans</p>

                    {[
                      { name: "Personal Loan", amount: "Up to ₹5,00,000", rate: "10.5%" },
                      { name: "Home Loan", amount: "Up to ₹50,00,000", rate: "8.5%" },
                      { name: "Business Loan", amount: "Up to ₹10,00,000", rate: "12%" },
                    ].map((loan, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between border border-gray-100 rounded-lg px-3 py-2.5"
                      >
                        <div>
                          <p className="text-xs font-medium text-gray-800">{loan.name}</p>
                          <p className="text-[10px] text-[#1664F5]">{loan.amount}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-semibold text-[#1664F5]">{loan.rate}</p>
                          <p className="text-[10px] text-gray-400">Interest Rate</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Right col — credit score card (Figma match) */}
                  <div
                    className="relative rounded-lg overflow-hidden border border-[#eeeeee]"
                    style={{
                      width: "209px",
                      flexShrink: 0,
                      background: "#f0fdf4",
                    }}
                  >
                    <svg width="209" height="280" viewBox="0 0 209 280" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
                      {/* Background */}
                      <rect width="209" height="280" fill="#f0fdf4" />

                      {/* Left arc — from left edge, curves up ending beside 750 */}
                      <path d="M 0,105 A 108,108 0 0,1 56,50" fill="none" stroke="#34d399" strokeWidth="6" strokeLinecap="round" />
                      {/* Right arc — mirror, from right edge */}
                      <path d="M 209,105 A 108,108 0 0,0 153,50" fill="none" stroke="#34d399" strokeWidth="6" strokeLinecap="round" />

                      {/* 750 text */}
                      <text x="104.5" y="72" textAnchor="middle" fill="#16a34a" fontSize="50" fontFamily="'Power Grotesk','DM Sans',sans-serif" fontWeight="400">750</text>
                      {/* Credit Score label */}
                      <text x="104.5" y="98" textAnchor="middle" fill="#6b7280" fontSize="13" fontFamily="'DM Sans',sans-serif">Credit Score</text>

                      {/* Outer light mint dome */}
                      <circle cx="104.5" cy="315" r="180" fill="#bbf7d0" />
                      {/* Inner solid green dome */}
                      <circle cx="104.5" cy="315" r="138" fill="#22c55e" />

                      {/* Squircle badge — light mint fill */}
                      <rect x="76" y="208" width="57" height="57" rx="14" ry="14" fill="#dcfce7" transform="rotate(45 104.5 236.5)" />

                      {/* Green circle */}
                      <circle cx="104.5" cy="234" r="21" fill="#22c55e" />

                      {/* White checkmark */}
                      <path d="M94 234.5l7.5 7.5 15-15.5" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trusted by leading banks — full-width logos */}
        <div className="relative flex justify-center px-4 pb-8 mt-6">
          <img
            src="/images/banks/bank-logos-strip.png"
            alt="Trusted by leading banks - HDFC Bank, ICICI Bank, Axis Bank, Citi, SBI, Bank of Baroda, IndusInd Bank, HSBC"
            className="w-full max-w-[1385px] object-contain"
          />
        </div>
      </div>
    </section>
  );
};
