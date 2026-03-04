import React, { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import { CheckIcon, BriefcaseIcon, ZapIcon, GlobeIcon, UsersIcon, TrendingUpIcon, MailIcon, PhoneIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";

export const CareersPage = (): JSX.Element => {
    // STATE MANAGEMENT
    const [activeTab, setActiveTab] = useState("openings");
    const [isTabSticky, setIsTabSticky] = useState(false);
    const [formStatus, setFormStatus] = useState<'FORM' | 'LOADING' | 'SUCCESS'>('FORM');
    const [expandedJob, setExpandedJob] = useState<number | null>(null);

    // UX & FORM HANDLERS 
    
    // Sticky scroll logic (Assumes scroll effects are defined in parent components/helpers)
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
        // Simulate API call delay
        setTimeout(() => {
            setFormStatus('SUCCESS');
        }, 1500); 
    };

    // PAGE DATA
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
        { icon: <ZapIcon className="w-8 h-8" />, title: "Innovation First", description: "Embrace new technologies and challenge the status quo daily.", bgColor: "bg-orange-100" },
        { icon: <UsersIcon className="w-8 h-8" />, title: "Partner Centric", description: "Place the needs of our partners and customers at the center of every decision.", bgColor: "bg-green-100" },
        { icon: <TrendingUpIcon className="w-8 h-8" />, title: "Growth Mindset", description: "Prioritize continuous learning and professional development for all teams.", bgColor: "bg-blue-100" },
        { icon: <GlobeIcon className="w-8 h-8" />, title: "Integrity & Trust", description: "Uphold the highest ethical standards in all business dealings.", bgColor: "bg-purple-100" },
    ];


    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section id="hero-section" className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-16 relative overflow-hidden">
                <div className="container mx-auto max-w-7xl px-4 relative z-10">
                    {/* Breadcrumb */}
                    <div className="mb-8">
                        <nav className="flex items-center space-x-2 text-sm">
                            <a href="/" className="text-blue-600 hover:text-blue-800 transition-colors">Home</a>
                            <span className="text-gray-400">/</span>
                            <span className="text-gray-600">Careers</span>
                        </nav>
                    </div>
                    
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
                            <span className="text-gray-900">Build the Future of Finance</span>
                            <br />
                            <span className="bg-gradient-to-r from-[#0050B2] to-[#003d8a] bg-clip-text text-transparent">
                                Join Accrefin Careers
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 leading-relaxed mb-8">
                            We are looking for ambitious and talented individuals to drive innovation in India's lending ecosystem.
                        </p>
                        <Button onClick={() => scrollToSection('openings')} className="bg-[#0050B2] hover:bg-[#003d8a] text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                            See Open Positions
                        </Button>
                    </div>
                </div>
            </section>

            {/* Sticky Tab Navigation */}
            <div className={`${isTabSticky ? 'fixed top-0 left-0 right-0 z-50 shadow-lg' : 'relative'} bg-white border-b border-gray-200 transition-all duration-300`}>
                <div className="container mx-auto max-w-7xl px-4">
                    <div className="flex items-center justify-center">
                        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                            {tabItems.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => scrollToSection(tab.id)}
                                    className={`px-6 py-3 text-sm font-medium rounded-lg transition-all duration-300 ${
                                        activeTab === tab.id
                                            ? 'bg-[#0050B2] text-white shadow-lg'
                                            : 'text-gray-600 hover:text-[#0050B2] hover:bg-white'
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
            <section id="openings" className="py-16 bg-gray-50">
                <div className="container mx-auto max-w-7xl px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                            Current Job Openings
                        </h2>
                        <p className="text-xl text-gray-600">
                            We offer competitive salaries, flexible work options, and excellent benefits.
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto space-y-4">
                        {openPositions.map((job, index) => (
                            <Card key={job.id} className="border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                                <CardContent className="p-0">
                                    <button
                                        onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                                        className="w-full p-6 text-left flex items-center justify-between hover:bg-blue-50 transition-colors duration-200"
                                    >
                                        <div className="flex items-center gap-4">
                                            <BriefcaseIcon className="w-5 h-5 text-[#0050B2] flex-shrink-0" />
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                                                <p className="text-sm text-gray-600">
                                                    {job.location} | {job.type}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                                                {job.salary}
                                            </Badge>
                                            {expandedJob === job.id ? (
                                                <ChevronUpIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                            ) : (
                                                <ChevronDownIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                            )}
                                        </div>
                                    </button>

                                    {expandedJob === job.id && (
                                        <div className="px-6 pb-6 border-t border-gray-100 bg-white">
                                            <p className="text-gray-700 mt-4 mb-4">{job.description}</p>
                                            <h4 className="font-semibold text-gray-800 mb-2">Key Skills:</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {job.requiredSkills.map((skill, idx) => (
                                                    <Badge key={idx} className="bg-blue-50 text-blue-700 text-xs">{skill}</Badge>
                                                ))}
                                            </div>
                                            <Button onClick={() => scrollToSection('apply')} className="mt-6 bg-[#0050B2] hover:bg-[#003d8a]">
                                                Quick Apply
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* 2. Our Culture Section */}
            <section id="culture" className="py-16 bg-white">
                <div className="container mx-auto max-w-7xl px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                            Our Core Values
                        </h2>
                        <p className="text-xl text-gray-600">
                            The principles that guide our work and our mission to innovate finance.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {coreValues.map((value, index) => (
                            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-gray-50">
                                <CardContent className="p-8 text-center">
                                    <div className={`w-16 h-16 ${value.bgColor} rounded-full flex items-center justify-center mx-auto mb-6 text-xl text-gray-700 group-hover:scale-110 transition-transform duration-300`}>
                                        {value.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#0050B2]">{value.title}</h3>
                                    <p className="text-gray-600">{value.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. Quick Apply Form Section */}
            <section id="apply" className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="container mx-auto max-w-md px-4">
                    <Card className="shadow-2xl border-0 rounded-2xl overflow-hidden">
                        <div className="bg-gradient-to-r from-[#0050B2] to-[#003d8a] px-6 py-4 text-white text-center">
                            <h3 className="text-xl font-bold">Quick Application</h3>
                            <p className="text-sm opacity-80">Submit your details—it only takes 2 minutes!</p>
                        </div>

                        <CardContent className="p-8">
                            {formStatus === 'FORM' && (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div><Input placeholder="Full Name" required /></div>
                                    <div><Input placeholder="Email Address" type="email" required /></div>
                                    <div><Input placeholder="Phone Number" type="tel" required /></div>
                                    
                                    <div>
                                        <select 
                                            placeholder="Applying For" 
                                            className="w-full h-12 p-3 border-2 border-gray-200 focus:border-[#0050B2] rounded-xl text-base text-gray-600"
                                            defaultValue=""
                                            required
                                        >
                                            <option value="" disabled hidden>Applying For (Position)</option>
                                            {openPositions.map(job => (
                                                <option key={job.id} value={job.title}>{job.title}</option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div className="pt-2 text-center text-xs text-gray-500">
                                        Your information will be kept confidential.
                                    </div>
                                    <Button type="submit" className="w-full bg-[#0050B2] hover:bg-[#003d8a]">
                                        Submit Application
                                    </Button>
                                </form>
                            )}

                            {formStatus === 'LOADING' && (
                                <div className="flex flex-col items-center justify-center h-64 text-gray-600">
                                    <svg className="animate-spin h-10 w-10 text-[#0050B2] mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">...</svg>
                                    <p className="text-lg font-semibold">Sending application...</p>
                                </div>
                            )}

                            {formStatus === 'SUCCESS' && (
                                <div className="flex flex-col items-center justify-center h-64 text-green-700 text-center">
                                    <svg className="w-16 h-16 text-green-500 mb-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    <h3 className="text-2xl font-bold mb-2">Success!</h3>
                                    <p className="text-gray-600">Thank you for applying. We will be in touch shortly.</p>
                                    <Button onClick={() => setFormStatus('FORM')} className="mt-4 bg-[#0050B2] hover:bg-[#003d8a]">Apply for Another</Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    );
};