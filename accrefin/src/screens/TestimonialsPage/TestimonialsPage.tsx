import React from "react";
import { Card, CardContent } from "../../components/ui/card";
import { StarIcon } from "lucide-react";
import { Badge } from "../../components/ui/badge"; // Ensure Badge is imported

const testimonialsData = [
    {
        name: "Priya Sharma",
        location: "Mumbai, Maharashtra",
        photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        feedback: "Accrefin made my home loan journey incredibly smooth. Got the best rate from HDFC Bank within 24 hours. Highly recommended!",
        rating: 5,
        loanType: "Home Loan"
    },
    {
        name: "Rajesh Kumar",
        location: "Delhi, NCR",
        photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        feedback: "Quick personal loan approval for my business needs. The team was very professional and transparent about all charges.",
        rating: 5,
        loanType: "Personal Loan"
    },
    {
        name: "Anita Patel",
        location: "Ahmedabad, Gujarat",
        photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        feedback: "Excellent service! They helped me compare multiple offers and choose the best one. Saved me ₹50,000 in interest.",
        rating: 5,
        loanType: "Business Loan"
    },
    {
        name: "Kishore Reddy",
        location: "Hyderabad, Telangana",
        photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        feedback: "I was skeptical about online platforms, but Accrefin provided fast, hassle-free service for my car loan refinance. Saved money on my EMI!",
        rating: 4,
        loanType: "Car Loan"
    },
    {
        name: "Sneha Varma",
        location: "Chennai, Tamil Nadu",
        photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        feedback: "The home loan approval process was quicker than expected. I appreciated the transparent fees and prompt support from the team.",
        rating: 5,
        loanType: "Home Loan"
    },
    {
        name: "Vikram Singh",
        location: "Pune, Maharashtra",
        photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
        feedback: "Used the education loan service for my master's degree abroad. The moratorium period advice was extremely helpful.",
        rating: 5,
        loanType: "Education Loan"
    }
];

export const TestimonialsPage = (): JSX.Element => {
    return (
        <div className="min-h-screen bg-gray-50 pt-16">
            <div className="container mx-auto max-w-7xl px-4">
                
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        Customer Success Stories
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        See what thousands of happy customers and partners say about Accrefin.
                    </p>
                </div>

            {/* Testimonials Grid */}
            <div className="pb-16 lg:pb-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonialsData.map((t, index) => (
                        <Card 
                            key={index}
                            className="bg-gradient-to-b from-[#0e5aa0] to-[#083b6f] text-white shadow-lg transition-all duration-300 rounded-xl border-0"
                        >
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    {/* Rating */}
                                    <div className="flex items-center gap-1">
                                        {[...Array(t.rating)].map((_, i) => (
                                            <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                        ))}
                                    </div>
                                    
                                    {/* Feedback */}
                                    <p className="text-white leading-relaxed italic">
                                        "{t.feedback}"
                                    </p>
                                    
                                    {/* Customer Info */}
                                    <div className="flex items-center gap-3 pt-4 border-t border-white/20">
                                        <img src={t.photo} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                                        <div>
                                            <h4 className="font-semibold text-white">{t.name}</h4>
                                            <p className="text-sm text-white/70">{t.location}</p>
                                            <Badge className="mt-1 bg-white/20 text-white text-xs">{t.loanType}</Badge>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    </div>
    );
};