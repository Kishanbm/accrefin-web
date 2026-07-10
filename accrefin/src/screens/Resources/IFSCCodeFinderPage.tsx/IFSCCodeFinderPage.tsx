import React, { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Zap, MapPin, Search, Banknote } from 'lucide-react';

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

export const IFSCCodeFinderPage = (): JSX.Element => {
    const headingFont = "font-['Power_Grotesk',_'DM_Sans',_sans-serif]";
    const bodyFont = "font-['DM_Sans',_sans-serif]";

    const stats = [
        { title: "All Banks", desc: "60,000+ branches" },
        { title: "Instant", desc: "Find IFSC in seconds" },
        { title: "RBI Verified", desc: "100% accurate" },
        { title: "Free Tool", desc: "No registration" },
    ];

    // ⭐️ MOCK DATA (In a real app, this would come from an API) ⭐️
    const mockBanks = ["State Bank of India (SBI)", "HDFC Bank", "ICICI Bank", "Axis Bank"];
    const mockStates = ["Karnataka", "Maharashtra", "Delhi", "Tamil Nadu"];

    // Core App State
    const [selectedBank, setSelectedBank] = useState("");
    const [selectedState, setSelectedState] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedBranch, setSelectedBranch] = useState("");
    const [searchResult, setSearchResult] = useState('');
    const [loading, setLoading] = useState(false);

    // Mock districts and branches dependent on state/bank selection
    const mockDistricts = selectedState ? ["Bengaluru Urban", "Mysuru", "Hubballi"] : [];
    const mockBranches = selectedDistrict ? ["Koramangala", "Indiranagar", "Jayanagar"] : [];

    // ⭐️ SEARCH LOGIC ⭐️
    const handleSearch = () => {
        if (!selectedBank || !selectedBranch) {
            setSearchResult('Please select the Bank and Branch.');
            return;
        }

        setLoading(true);
        setSearchResult('');

        // Simulate API delay for fetching the IFSC code
        setTimeout(() => {
            // Logic to generate a mock IFSC code:
            const bankCode = selectedBank.slice(0, 4).toUpperCase();
            const ifsc = `SBIN0${bankCode}00${Math.floor(Math.random() * 900) + 100}`;

            setSearchResult(ifsc);
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen">
            {/* Premium Hero */}
            <section className="bg-white relative overflow-hidden">
                <RoomGrid />
                <div className="container mx-auto max-w-7xl px-6 pt-8 pb-14 relative z-10">
                    <div className="flex justify-center mb-10">
                        <div className="flex items-center gap-2 border border-gray-300 rounded-full px-5 py-2.5 bg-gray-50">
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
                            <span className="text-gray-600">IFSC Code Finder</span>
                        </nav>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-end">
                        <h1 className={`text-4xl lg:text-5xl font-normal text-gray-900 leading-tight mb-4 ${headingFont}`}>
                            IFSC Code Finder
                        </h1>
                        <p className={`text-lg text-gray-600 ${bodyFont}`}>
                            Quickly find IFSC codes for NEFT, RTGS, and IMPS transfers.
                        </p>
                    </div>
                </div>
                {/* Dark stats bar */}
                <div className="bg-[#0e396d] border-t border-white/10">
                    <div className="container mx-auto max-w-7xl px-4">
                        <div className="flex items-center justify-between flex-wrap lg:flex-nowrap">
                            {stats.map((item, index, arr) => (
                                <React.Fragment key={item.title}>
                                    <div className="flex flex-col items-start gap-4 py-10 px-10 flex-1">
                                        <h3 className={`font-normal text-white text-[22px] ${headingFont}`}>{item.title}</h3>
                                        <p className={`text-[#a0cfff] text-base font-medium ${bodyFont}`}>{item.desc}</p>
                                    </div>
                                    {index < arr.length - 1 && <div className="hidden lg:block w-px h-[100px] bg-white/15 flex-shrink-0" />}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Finder Section */}
            <section className="bg-[#f4f9ff]">
                <div className="container mx-auto max-w-4xl px-4 py-16">

                    {/* Finder Card */}
                    <Card className="bg-white border-2 border-[#c8d7eb] rounded-2xl shadow-lg">
                        <CardContent className="p-8 lg:p-12">
                            <div className="space-y-8">

                                {/* Input Dropdowns */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Bank Selection */}
                                    <div>
                                        <label className={`block text-sm font-medium text-gray-700 mb-2 ${bodyFont}`}>
                                            Select Bank
                                        </label>
                                        <select
                                            value={selectedBank}
                                            onChange={(e) => { setSelectedBank(e.target.value); setSelectedState(''); setSearchResult(''); }}
                                            className="w-full h-12 p-3 border-2 border-gray-300 focus:border-[#0050B2] rounded-xl text-base bg-white text-gray-700"
                                        >
                                            <option value="" disabled>Choose Bank</option>
                                            {mockBanks.map(bank => (
                                                <option key={bank} value={bank}>{bank}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* State Selection */}
                                    <div>
                                        <label className={`block text-sm font-medium text-gray-700 mb-2 ${bodyFont}`}>
                                            Select State
                                        </label>
                                        <select
                                            value={selectedState}
                                            onChange={(e) => { setSelectedState(e.target.value); setSelectedDistrict(''); setSearchResult(''); }}
                                            className="w-full h-12 p-3 border-2 border-gray-300 focus:border-[#0050B2] rounded-xl text-base bg-white text-gray-700"
                                            disabled={!selectedBank}
                                        >
                                            <option value="" disabled>Choose State</option>
                                            {mockStates.map(state => (
                                                <option key={state} value={state}>{state}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* District Selection */}
                                    <div>
                                        <label className={`block text-sm font-medium text-gray-700 mb-2 ${bodyFont}`}>
                                            Select District
                                        </label>
                                        <select
                                            value={selectedDistrict}
                                            onChange={(e) => { setSelectedDistrict(e.target.value); setSelectedBranch(''); setSearchResult(''); }}
                                            className="w-full h-12 p-3 border-2 border-gray-300 focus:border-[#0050B2] rounded-xl text-base bg-white text-gray-700"
                                            disabled={!selectedState}
                                        >
                                            <option value="" disabled>Choose District</option>
                                            {mockDistricts.map(district => (
                                                <option key={district} value={district}>{district}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Branch Selection */}
                                    <div>
                                        <label className={`block text-sm font-medium text-gray-700 mb-2 ${bodyFont}`}>
                                            Select Branch
                                        </label>
                                        <select
                                            value={selectedBranch}
                                            onChange={(e) => { setSelectedBranch(e.target.value); setSearchResult(''); }}
                                            className="w-full h-12 p-3 border-2 border-gray-300 focus:border-[#0050B2] rounded-xl text-base bg-white text-gray-700"
                                            disabled={!selectedDistrict}
                                        >
                                            <option value="" disabled>Choose Branch</option>
                                            {mockBranches.map(branch => (
                                                <option key={branch} value={branch}>{branch}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Search Button */}
                                <Button
                                    onClick={handleSearch}
                                    disabled={!selectedBranch || loading}
                                    className={`w-full bg-[#0877ff] hover:bg-[#0666dd] text-white py-3 text-lg font-semibold rounded-xl transition-all duration-300 flex items-center justify-center ${bodyFont}`}
                                >
                                    {loading ? (
                                        <svg className="animate-spin h-5 w-5 text-white mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <>
                                            <Search className="w-5 h-5 mr-2" /> Find IFSC Code
                                        </>
                                    )}
                                </Button>

                                {/* Result Display */}
                                {searchResult && (
                                    <div className="mt-8 bg-blue-50/70 p-6 rounded-xl border-l-4 border-[#0050B2] flex items-center justify-between">
                                        <div>
                                            <h3 className={`text-md font-semibold text-gray-700 mb-1 ${bodyFont}`}>
                                                IFSC Code:
                                            </h3>
                                            <p className={`text-3xl font-bold text-gray-900 tracking-wider ${headingFont}`}>
                                                {searchResult}
                                            </p>
                                        </div>
                                        <Button variant="outline" className="bg-white border-gray-300 text-[#0050B2] hover:bg-gray-100">
                                            Copy
                                        </Button>
                                    </div>
                                )}

                                {/* Information Section */}
                                <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                        <Banknote className="w-6 h-6 text-green-600 mx-auto mb-2" />
                                        <p className={`text-xs text-gray-700 font-medium ${bodyFont}`}>NEFT, RTGS, IMPS Enabled</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                        <MapPin className="w-6 h-6 text-[#0050B2] mx-auto mb-2" />
                                        <p className={`text-xs text-gray-700 font-medium ${bodyFont}`}>All Indian Bank Branches</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                        <Zap className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                                        <p className={`text-xs text-gray-700 font-medium ${bodyFont}`}>Instant Verification</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </section>
        </div>
    );
};
