import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Zap, MapPin, Search, Banknote } from 'lucide-react'; 

export const IFSCCodeFinderPage = (): JSX.Element => {
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
        <div className="min-h-screen bg-gray-50 pt-16">
            <div className="container mx-auto max-w-4xl px-4">
                
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        IFSC Code Finder
                    </h1>
                    <p className="text-xl text-gray-600">
                        Quickly find IFSC codes for NEFT, RTGS, and IMPS transfers.
                    </p>
                </div>

                {/* Finder Card */}
                <Card className="shadow-2xl border-0 rounded-2xl bg-white">
                    <CardContent className="p-8 lg:p-12">
                        <div className="space-y-8">
                            
                            {/* Input Dropdowns */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Bank Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                                className="w-full bg-[#0050B2] hover:bg-[#003d8a] text-white py-3 text-lg font-semibold rounded-xl transition-all duration-300 flex items-center justify-center"
                            >
                                {loading ? (
                                    <svg className="animate-spin h-5 w-5 text-white mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
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
                                        <h3 className="text-md font-semibold text-gray-700 mb-1">
                                            IFSC Code:
                                        </h3>
                                        <p className="text-3xl font-bold text-gray-900 tracking-wider">
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
                                    <p className="text-xs text-gray-700 font-medium">NEFT, RTGS, IMPS Enabled</p>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                    <MapPin className="w-6 h-6 text-[#0050B2] mx-auto mb-2" />
                                    <p className="text-xs text-gray-700 font-medium">All Indian Bank Branches</p>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                    <Zap className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                                    <p className="text-xs text-gray-700 font-medium">Instant Verification</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
};