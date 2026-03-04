import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { DollarSign, Clock, CheckCircle, Shuffle } from 'lucide-react'; 

export const CurrencyConverterPage = (): JSX.Element => {
    // Mock data for initial options (API call would populate this)
    const mockOptions = [
        { code: "INR", name: "Indian Rupee" },
        { code: "USD", name: "US Dollar" },
        { code: "EUR", name: "Euro" },
        { code: "GBP", name: "British Pound" },
        { code: "JPY", name: "Japanese Yen" },
    ];
    
    // Core App State
    const [amount, setAmount] = useState(100);
    const [fromCurrency, setFromCurrency] = useState("USD");
    const [toCurrency, setToCurrency] = useState("INR");
    const [convertedAmount, setConvertedAmount] = useState(0);
    const [rate, setRate] = useState(83.5); // Mock initial rate (1 USD = 83.5 INR)
    const [loading, setLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState('Just now');
        
    // Function to simulate fetching the conversion rate and calculating output
    const convert = () => {
        setLoading(true);
        // In a live app, this would be an Axios/Fetch API call 
        // using an API like 'currency-api'
        setTimeout(() => {
            let mockRate = 1.0;
            if (fromCurrency === "USD" && toCurrency === "INR") {
                mockRate = 83.5;
            } else if (fromCurrency === "INR" && toCurrency === "USD") {
                 mockRate = 1 / 83.5;
            } else {
                 // Fallback mock rate
                 mockRate = Math.random() * (100 - 0.1) + 0.1;
            }

            const output = amount * mockRate;
            setRate(mockRate);
            setConvertedAmount(output);
            setLoading(false);
            setLastUpdated(new Date().toLocaleTimeString());
        }, 800);
    };

    // Run conversion when component mounts or currency/amount changes
    useEffect(() => {
        convert();
    }, [fromCurrency, toCurrency, amount]); 

    // Function to swap currencies
    const flip = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
    };

    const formatCurrency = (value: number, currencyCode: string) => {
        return value.toLocaleString('en-IN', {
            style: 'currency',
            currency: currencyCode,
            maximumFractionDigits: 2,
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-16">
            <div className="container mx-auto max-w-4xl px-4">
                
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Real-time Currency Converter
                    </h1>
                    <p className="text-xl text-gray-600">
                        Check current exchange rates for over 150 currencies.
                    </p>
                    <div className="text-sm text-gray-500 mt-2 flex items-center justify-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>Last Updated: {lastUpdated}</span>
                    </div>
                </div>

                {/* Converter Card */}
                <Card className="shadow-2xl border-0 rounded-2xl bg-white">
                    <CardContent className="p-8 lg:p-12">
                        <div className="space-y-6">

                            {/* 1. INPUT ROW */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                                <div className="md:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Amount
                                    </label>
                                    <Input 
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(Number(e.target.value))}
                                        className="h-12 text-lg border-2 border-gray-300 focus:border-[#0050B2] rounded-xl"
                                    />
                                </div>
                                <div className="md:col-span-2 flex items-center gap-2 justify-between">
                                    
                                    {/* FROM CURRENCY */}
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            From
                                        </label>
                                        <select
                                            value={fromCurrency}
                                            onChange={(e) => setFromCurrency(e.target.value)}
                                            className="w-full h-12 p-3 border-2 border-gray-300 focus:border-[#0050B2] rounded-xl text-base bg-white"
                                        >
                                            {mockOptions.map(option => (
                                                <option key={option.code} value={option.code}>
                                                    {option.code} - {option.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* SWITCH BUTTON */}
                                    <div className="mx-2 mb-0 md:mb-1">
                                        <div onClick={flip} className="p-3 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 transition-colors duration-200">
                                            <Shuffle size={24} className="text-[#0050B2] rotate-90 md:rotate-0" />
                                        </div>
                                    </div>

                                    {/* TO CURRENCY */}
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            To
                                        </label>
                                        <select
                                            value={toCurrency}
                                            onChange={(e) => setToCurrency(e.target.value)}
                                            className="w-full h-12 p-3 border-2 border-gray-300 focus:border-[#0050B2] rounded-xl text-base bg-white"
                                        >
                                            {mockOptions.map(option => (
                                                <option key={option.code} value={option.code}>
                                                    {option.code} - {option.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            
                            {/* 2. CONVERSION RESULT */}
                            <div className="pt-6">
                                <Button 
                                    onClick={convert} 
                                    disabled={loading} 
                                    className="w-full bg-[#0050B2] hover:bg-[#003d8a] text-white py-3 text-lg font-semibold rounded-xl transition-all duration-300 flex items-center justify-center"
                                >
                                    {loading ? (
                                        <svg className="animate-spin h-5 w-5 text-white mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <>Convert</>
                                    )}
                                </Button>
                            </div>
                            
                            {/* 3. OUTPUT DISPLAY */}
                            <div className="mt-8 bg-blue-50/70 p-6 rounded-xl border-l-4 border-[#0050B2]">
                                <h3 className="text-md font-semibold text-gray-700 mb-1">
                                    Result:
                                </h3>
                                <p className="text-3xl font-bold text-gray-900">
                                    {formatCurrency(convertedAmount, toCurrency)}
                                </p>
                                <p className="text-sm text-gray-600 mt-2">
                                    {formatCurrency(amount, fromCurrency)} is equal to {formatCurrency(convertedAmount, toCurrency)}.
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    1 {fromCurrency} = {rate.toFixed(4)} {toCurrency} (Exchange Rate)
                                </p>
                            </div>
                            
                            {/* Information Section */}
                            <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                    <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
                                    <p className="text-xs text-gray-700 font-medium">No Hidden Fees</p>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                    <CheckCircle className="w-6 h-6 text-[#0050B2] mx-auto mb-2" />
                                    <p className="text-xs text-gray-700 font-medium">Market Rates</p>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                    <Clock className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                                    <p className="text-xs text-gray-700 font-medium">Real-time Data</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
};