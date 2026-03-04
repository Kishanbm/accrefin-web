import React from "react";
import { HeaderSection } from "./sections/HeaderSection";
import { HeroSection } from "./sections/HeroSection";
import { LoanProductsSection } from "./sections/LoanProductsSection";
import { LoanJourneySection } from "./sections/LoanJourneySection";
import { CibilScoreSection } from "./sections/CibilScoreSection";
import { AppPromotionSection } from "../../components/sections/AppPromotionSection";
import { WhyAccrefinSection } from "./sections/WhyAccrefinSection";
import { TestimonialsSection } from "../TestimonialsPage/TestimonialsSection";
import { BlogSection } from "./sections/BlogSection";
import { PartnersSection } from "./sections/PartnersSection";
import { FinancialCalculatorSection } from "./sections/FinancialCalculatorSection";
import { FooterSection } from "./sections/FooterSection";

export const ElementLight = (): JSX.Element => {
  return (
    <div className="flex flex-col w-full items-start relative bg-white">
      <HeaderSection />
      <HeroSection />
      <LoanProductsSection />
      <LoanJourneySection />
      <FinancialCalculatorSection />
      <CibilScoreSection />
      <AppPromotionSection />
      <WhyAccrefinSection />
      <TestimonialsSection />
      <PartnersSection />
      <BlogSection />
      <FooterSection />
    </div>
  );
};