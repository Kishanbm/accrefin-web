import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ElementLight } from "./screens/ElementLight";
import { BusinessLoanPage } from "./screens/LoanProducts/BusinessLoanPage/index.ts";
import { PersonalLoanPage } from "./screens/LoanProducts/PersonalLoanPage/index.ts";
import { EducationLoanPage } from "./screens/LoanProducts/EducationLoanPage/index.ts";
import { CarLoanPage } from "./screens/LoanProducts/CarLoanPage/index.ts";
import { MachineryLoanPage } from "./screens/LoanProducts/MachineryLoanPage/index.ts";
import { PartnerWithUsPage } from "./screens/AboutUs/PartnerWithUsPage/index.ts";
import { ContactUsPage } from "./screens/ContactUsPage";
import { HomeLoanCalculatorPage } from "./screens/Calculators/HomeLoanCalculatorPage";
import { PersonalLoanCalculatorPage } from "./screens/Calculators/PersonalLoanCalculatorPage/index.ts";
import { AutomobileLoanCalculatorPage } from "./screens/Calculators/AutomobileLoanCalculatorPage";
import { BusinessLoanCalculatorPage } from "./screens/Calculators/BusinessLoanCalculatorPage/index.ts";
import { FDCalculatorPage } from "./screens/Calculators/FDCalculatorPage";
import { InsuranceCalculatorPage } from "./screens/Calculators/InsuranceCalculatorPage/index.ts";
import { MutualFundCalculatorPage } from "./screens/Calculators/MutualFundCalculatorPage/index.ts";
import { CreditCardCalculatorPage } from "./screens/Calculators/CreditCardCalculatorPage/index.ts";
import { HeaderSection } from "./screens/ElementLight/sections/HeaderSection";
import { FooterSection } from "./screens/ElementLight/sections/FooterSection";
import { ROUTES } from './constants/routes';
import { HomeLoanPage } from "./screens/LoanProducts/HomeLoanPage/index.ts";
import { HealthInsurancePage } from "./screens/Insurance/HealthInsurancePage/index.ts";
import { VehicleInsurancePage } from "./screens/Insurance/VehicleInsurancePage/index.ts";
import { LifeInsurancePage } from "./screens/Insurance/LifeInsurancePage/index.ts";
import { ApplicationPage } from "./components/sections/ApplicationPage/ApplicationPage";
import Blogs from "./screens/Resources/BlogsPage/Blogs.tsx";
import BlogPost from "./screens/Resources/BlogsPage/BlogPosts.tsx";
import { CareersPage } from "./screens/AboutUs/CareerPage/index.ts";
import { CurrencyConverterPage } from "./screens/Resources/CurrencyConverterPage/index.ts";
import { IFSCCodeFinderPage } from "./screens/Resources/IFSCCodeFinderPage.tsx/index.ts";
import { TestimonialsPage } from "./screens/TestimonialsPage/TestimonialsPage.tsx";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <Router>
      <div className="min-h-screen flex flex-col">
        <Routes>
          <Route path={ROUTES.HOME} element={<ElementLight />} />
          <Route
            path={ROUTES.BUSINESS_LOAN}
            element={
              <>
                <HeaderSection />
                <BusinessLoanPage />
                <FooterSection />
              </>
            }
          />
          <Route
            path={ROUTES.PERSONAL_LOAN}
            element={
              <>
                <HeaderSection />
                <PersonalLoanPage />
                <FooterSection />
              </>
            }
          />

          <Route
            path={ROUTES.TESTIMONIAL}
            element={
              <>
                <HeaderSection />
                <TestimonialsPage />
                <FooterSection />
              </>
            }
          />
          
          <Route
            path={ROUTES.EDUCATION_LOAN}
            element={
              <>
                <HeaderSection />
                <EducationLoanPage />
                <FooterSection />
              </>
            }
          />
          <Route
            path={ROUTES.CAR_LOAN}
            element={
              <>
                <HeaderSection />
                <CarLoanPage />
                <FooterSection />
              </>
            }
          />
          <Route
            path={ROUTES.MACHINERY_LOAN}
            element={
              <>
                <HeaderSection />
                <MachineryLoanPage />
                <FooterSection />
              </>
            }
          />
          <Route
            path={ROUTES.HOME_LOAN}
            element={
              <>
                <HeaderSection />
                <HomeLoanPage />
                <FooterSection />
              </>
            }
          />
          <Route
            path={ROUTES.HEALTH_INSURANCE}
            element={
              <>
                <HeaderSection />
                <HealthInsurancePage />
                <FooterSection />
              </>
            }
          />
          <Route
            path={ROUTES.VEHICLE_INSURANCE}
            element={
              <>
                <HeaderSection />
                <VehicleInsurancePage />
                <FooterSection />
              </>
            }
          />
          <Route
            path={ROUTES.LIFE_INSURANCE}
            element={
              <>
                <HeaderSection />
                <LifeInsurancePage />
                <FooterSection />
              </>
            }
          />

          <Route
            path={ROUTES.APPLICATION}
            element={
              <>
                <HeaderSection />
                <ApplicationPage />
                <FooterSection />
              </>
            }
          />
          <Route
            path={ROUTES.CONTACT}
            element={
              <>
                <HeaderSection />
                <ContactUsPage />
                <FooterSection />
              </>
            }
          />
          <Route
            path={ROUTES.PARTNER}
            element={
              <>
                <HeaderSection />
                <PartnerWithUsPage />
                <FooterSection />
              </>
            }
          />

          <Route
            path={ROUTES.IFSC_CODE_FINDER}
            element={
              <>
                <HeaderSection />
                <IFSCCodeFinderPage />
                <FooterSection />
              </>
            }
          />

          <Route
            path={ROUTES.CAREERS}
            element={
              <>
                <HeaderSection />
                <CareersPage />
                <FooterSection />
              </>
            }
          />

          <Route
            path={ROUTES.CURRENCY_CONVERTER}
            element={
              <>
                <HeaderSection />
                <CurrencyConverterPage />
                <FooterSection />
              </>
            }
          />

          <Route
            path={ROUTES.CALCULATORS.HOME_LOAN}
            element={
              <>
                <HeaderSection />
                <HomeLoanCalculatorPage />
                <FooterSection />
              </>
            }
          />
          <Route
            path={ROUTES.CALCULATORS.PERSONAL_LOAN}
            element={
              <>
                <HeaderSection />
                <PersonalLoanCalculatorPage />
                <FooterSection />
              </>
            }
          />
          <Route
            path={ROUTES.CALCULATORS.BUSINESS_LOAN}
            element={
              <>
                <HeaderSection />
                <BusinessLoanCalculatorPage />
                <FooterSection />
              </>
            }
          />
          <Route
            path={ROUTES.CALCULATORS.AUTOMOBILE_LOAN}
            element={
              <>
                <HeaderSection />
                <AutomobileLoanCalculatorPage />
                <FooterSection />
              </>
            }
          />
          <Route
            path={ROUTES.CALCULATORS.FD}
            element={
              <>
                <HeaderSection />
                <FDCalculatorPage />
                <FooterSection />
              </>
            }
          />
          <Route
            path={ROUTES.CALCULATORS.INSURANCE}
            element={
              <>
                <HeaderSection />
                <InsuranceCalculatorPage />
                <FooterSection />
              </>
            }
          />
          <Route
            path={ROUTES.CALCULATORS.MUTUAL_FUND}
            element={
              <>
                <HeaderSection />
                <MutualFundCalculatorPage />
                <FooterSection />
              </>
            }
          />
          <Route
            path={ROUTES.CALCULATORS.CREDIT_CARD}
            element={
              <>
                <HeaderSection />
                <CreditCardCalculatorPage />
                <FooterSection />
              </>
            }
          />
          <Route
            path={ROUTES.BLOGS}
            element={
              <>
                <HeaderSection />
                <Blogs />
                <FooterSection />
              </>
            }
          />
          <Route
            path={ROUTES.BLOG_POST(':slug')}
            element={
              <>
                <HeaderSection />
                <BlogPost />
                <FooterSection />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  </StrictMode>
);