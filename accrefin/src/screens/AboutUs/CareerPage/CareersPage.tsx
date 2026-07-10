import React, { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import { BriefcaseIcon, ZapIcon, GlobeIcon, UsersIcon, TrendingUpIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";

const TunnelGrid = ({ color = "rgba(255,255,255,0.18)" }: { color?: string }) => {
  const W = 1440, H = 900, vx = W / 2, vy = H / 2, wallT = 0.30;
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
  const rings = [0.95, 0.82, 0.68, 0.54, 0.40, wallT].map(t => ({ x: vx - vx * t, y: vy - vy * t, w: W * t, h: H * t }));
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        {fanLines.map((l, i) => <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={color} strokeWidth="0.6" />)}
        {rings.map((r, i) => <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} fill="none" stroke={color} strokeWidth="0.6" />)}
      </svg>
    </div>
  );
};

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

export const CareersPage = (): JSX.Element => {
  const headingFont = "font-['Power_Grotesk',_'DM_Sans',_sans-serif]";
  const bodyFont = "font-['DM_Sans',_sans-serif]";

  const [activeTab, setActiveTab] = useState("openings");
  const [isTabSticky, setIsTabSticky] = useState(false);
  const [formStatus, setFormStatus] = useState<'FORM' | 'LOADING' | 'SUCCESS'>('FORM');
  const [expandedJob, setExpandedJob] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById('hero-section');
      if (heroSection) {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        setIsTabSticky(window.scrollY > heroBottom - 100);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    setActiveTab(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = isTabSticky ? 80 : 0;
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({ top: elementPosition, behavior: 'smooth' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('LOADING');
    setTimeout(() => {
      setFormStatus('SUCCESS');
    }, 1500);
  };

  const tabItems = [
    { id: "openings", label: "Open Positions" },
    { id: "culture", label: "Our Culture" },
    { id: "apply", label: "Quick Apply" }
  ];

  const openPositions = [
    { id: 1, title: "Senior Software Engineer", location: "Bengaluru", type: "Full-Time", salary: "₹18L - ₹25L", description: "Develop and maintain high-performance, scalable React applications.", requiredSkills: ["TypeScript", "React", "Node.js"] },
    { id: 2, title: "Financial Analyst", location: "Mumbai", type: "Full-Time", salary: "₹8L - ₹12L", description: "Analyze market trends and optimize loan product pricing strategies.", requiredSkills: ["Financial Modeling", "Excel", "Data Analysis"] },
    { id: 3, title: "Sales Development Representative", location: "Remote/Pan India", type: "Full-Time", salary: "₹5L - ₹8L", description: "Manage partner relationships and drive loan lead generation.", requiredSkills: ["Communication", "Sales CRM", "Negotiation"] },
    { id: 4, title: "UI/UX Designer", location: "Bengaluru", type: "Contract", salary: "₹10L - ₹15L", description: "Design and prototype user interfaces for our web and mobile platforms.", requiredSkills: ["Figma", "UX Research", "Prototyping"] },
  ];

  const coreValues = [
    { icon: <ZapIcon className="w-7 h-7 text-[#0877ff]" />, title: "Innovation First", description: "Embrace new technologies and challenge the status quo daily." },
    { icon: <UsersIcon className="w-7 h-7 text-[#0877ff]" />, title: "Partner Centric", description: "Place the needs of our partners and customers at the center of every decision." },
    { icon: <TrendingUpIcon className="w-7 h-7 text-[#0877ff]" />, title: "Growth Mindset", description: "Prioritize continuous learning and professional development for all teams." },
    { icon: <GlobeIcon className="w-7 h-7 text-[#0877ff]" />, title: "Integrity & Trust", description: "Uphold the highest ethical standards in all business dealings." },
  ];

  const trustStats = [
    { value: "50+", label: "Open Roles", sub: "Across departments" },
    { value: "Remote", label: "Friendly", sub: "Hybrid work options" },
    { value: "Great", label: "Culture", sub: "Inclusive & supportive" },
    { value: "Fast", label: "Growth", sub: "Rapid promotions" },
  ];

  return (
    <div className={`min-h-screen bg-white ${bodyFont}`}>

      {/* Hero Section */}
      <section id="hero-section" className="bg-white relative overflow-hidden py-20">
        <RoomGrid />
        <div className="container mx-auto max-w-7xl px-4 relative z-10">
          {/* Shield Badge */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2 bg-[#f0f6ff] border border-[#c7deff] rounded-full px-5 py-2">
              <svg className="w-4 h-4 text-[#0877ff]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.318 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
              </svg>
              <span className="text-[#0050B2] text-sm font-semibold">India's most trusted platform</span>
            </div>
          </div>

          {/* Breadcrumb */}
          <div className="flex justify-center mb-6">
            <nav className="flex items-center space-x-2 text-sm">
              <a href="/" className="text-[#0877ff] hover:text-[#0050B2] transition-colors">Home</a>
              <span className="text-gray-400">/</span>
              <span className="text-gray-500">Careers</span>
            </nav>
          </div>

          {/* Title */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center pb-14">
            <div>
              <h1 className={`${headingFont} text-5xl lg:text-6xl font-bold leading-tight mb-8 text-gray-900`}>
                Build Your Career
                <br />
                <span className="text-[#0877ff]">At Accrefin</span>
              </h1>
              <Button
                onClick={() => scrollToSection('openings')}
                className="bg-[#0877ff] hover:bg-[#0050B2] text-white px-10 py-3 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                See Open Positions
              </Button>
            </div>
            <div>
              <p className="text-xl text-gray-500 leading-relaxed">
                We are looking for ambitious and talented individuals to drive innovation in India's lending ecosystem.
              </p>
            </div>
          </div>
        </div>

        {/* Trust Bar */}
        <div className="bg-[#0e396d] mt-16 py-8 relative z-10">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              {trustStats.map((stat, i) => (
                <div key={i} className="text-white">
                  <div className={`${headingFont} text-2xl font-bold text-white`}>{stat.value} <span className="text-[#5aabff]">{stat.label}</span></div>
                  <div className="text-blue-200 text-sm mt-1">{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Tab Navigation */}
      <div className={`${isTabSticky ? 'fixed top-0 left-0 right-0 z-50 shadow-lg' : 'relative'} bg-white border-b border-gray-200 transition-all duration-300`}>
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-center py-2">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              {tabItems.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => scrollToSection(tab.id)}
                  className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${activeTab === tab.id
                    ? 'bg-[#0877ff] text-white shadow-lg'
                    : 'text-gray-600 hover:text-[#0877ff] hover:bg-white'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 1. Open Positions Section */}
      <section id="openings" className="py-20 bg-[#f4f9ff]">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-14">
            <h2 className={`${headingFont} text-4xl lg:text-5xl font-bold text-gray-900 mb-4`}>
              Current Job Openings
            </h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              We offer competitive salaries, flexible work options, and excellent benefits.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {openPositions.map((job) => (
              <div key={job.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <button
                  onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-[#f4f9ff] transition-colors duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#e8f1ff] rounded-lg flex items-center justify-center flex-shrink-0">
                      <BriefcaseIcon className="w-5 h-5 text-[#0877ff]" />
                    </div>
                    <div>
                      <h3 className={`${headingFont} text-lg font-semibold text-gray-900`}>{job.title}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {job.location} &nbsp;·&nbsp; {job.type}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="hidden sm:inline-block bg-green-50 text-green-700 text-xs font-semibold px-3 py-1 rounded-full border border-green-200">
                      {job.salary}
                    </span>
                    {expandedJob === job.id
                      ? <ChevronUpIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      : <ChevronDownIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />}
                  </div>
                </button>

                {expandedJob === job.id && (
                  <div className="px-6 pb-6 border-t border-gray-100">
                    <p className="text-gray-600 mt-4 mb-4 leading-relaxed">{job.description}</p>
                    <h4 className="font-semibold text-gray-800 text-sm mb-3">Key Skills</h4>
                    <div className="flex flex-wrap gap-2 mb-5">
                      {job.requiredSkills.map((skill, idx) => (
                        <span key={idx} className="bg-[#e8f1ff] text-[#0877ff] text-xs font-medium px-3 py-1 rounded-full">{skill}</span>
                      ))}
                    </div>
                    <Button
                      onClick={() => scrollToSection('apply')}
                      className="bg-[#0877ff] hover:bg-[#0050B2] text-white font-semibold px-6 py-2 rounded-lg text-sm"
                    >
                      Apply Now
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Our Culture Section */}
      <section id="culture" className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-14">
            <h2 className={`${headingFont} text-4xl lg:text-5xl font-bold text-gray-900 mb-4`}>
              Our Core Values
            </h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              The principles that guide our work and our mission to innovate finance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((value, index) => (
              <div
                key={index}
                className="group bg-white border border-gray-100 rounded-2xl p-8 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-[#e8f1ff] rounded-xl flex items-center justify-center mx-auto mb-5 group-hover:bg-[#0877ff] transition-colors duration-300">
                  <div className="group-hover:[&>svg]:text-white transition-colors duration-300">
                    {value.icon}
                  </div>
                </div>
                <h3 className={`${headingFont} text-lg font-bold text-gray-900 mb-3 group-hover:text-[#0877ff] transition-colors duration-300`}>
                  {value.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Quick Apply Form Section */}
      <section id="apply" className="py-20 bg-[#0E396E] relative overflow-hidden">
        <TunnelGrid />
        <div className="container mx-auto max-w-7xl px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <h2 className={`${headingFont} text-4xl lg:text-5xl font-bold text-white mb-4`}>
                Quick Application
              </h2>
              <p className="text-blue-200 text-lg leading-relaxed mb-8">
                Submit your details — it only takes 2 minutes! Our team will review your application and reach out within 48 hours.
              </p>
              <ul className="space-y-3">
                {["No lengthy paperwork", "Hear back within 48 hours", "Roles across all departments"].map(item => (
                  <li key={item} className="flex items-center gap-3 text-blue-100">
                    <svg className="w-5 h-5 text-[#5aabff] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden">
            <div className="p-8">
              {formStatus === 'FORM' && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    placeholder="Full Name"
                    required
                    className="w-full h-12 px-4 bg-white/15 border border-white/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:border-white/60 focus:bg-white/20 transition-all"
                  />
                  <input
                    placeholder="Email Address"
                    type="email"
                    required
                    className="w-full h-12 px-4 bg-white/15 border border-white/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:border-white/60 focus:bg-white/20 transition-all"
                  />
                  <input
                    placeholder="Phone Number"
                    type="tel"
                    required
                    className="w-full h-12 px-4 bg-white/15 border border-white/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:border-white/60 focus:bg-white/20 transition-all"
                  />
                  <select
                    defaultValue=""
                    required
                    className="w-full h-12 px-4 bg-white/15 border border-white/30 rounded-xl text-white focus:outline-none focus:border-white/60 focus:bg-white/20 transition-all appearance-none"
                  >
                    <option value="" disabled className="text-gray-700 bg-white">Applying For (Position)</option>
                    {openPositions.map(job => (
                      <option key={job.id} value={job.title} className="text-gray-700 bg-white">{job.title}</option>
                    ))}
                  </select>
                  <p className="text-center text-xs text-blue-200 pt-1">
                    Your information will be kept confidential.
                  </p>
                  <button
                    type="submit"
                    className="w-full h-12 bg-[#0877ff] hover:bg-[#0050B2] text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Submit Application
                  </button>
                </form>
              )}

              {formStatus === 'LOADING' && (
                <div className="flex flex-col items-center justify-center h-56 text-white">
                  <svg className="animate-spin h-10 w-10 text-white mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <p className="text-lg font-semibold">Sending application...</p>
                </div>
              )}

              {formStatus === 'SUCCESS' && (
                <div className="flex flex-col items-center justify-center h-56 text-center">
                  <svg className="w-14 h-14 text-green-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className={`${headingFont} text-2xl font-bold text-white mb-2`}>Application Sent!</h3>
                  <p className="text-blue-200 mb-6">Thank you for applying. We will be in touch shortly.</p>
                  <button
                    onClick={() => setFormStatus('FORM')}
                    className="px-6 py-2.5 bg-white text-[#0877ff] font-semibold rounded-xl hover:bg-blue-50 transition-all"
                  >
                    Apply for Another Role
                  </button>
                </div>
              )}
            </div>
          </div>
          </div>
        </div>
      </section>
    </div>
  );
};
