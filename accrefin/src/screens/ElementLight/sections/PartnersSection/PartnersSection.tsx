import { useState } from "react";

const tabs = [
  { id: "home-loan", label: "Home Loan" },
  { id: "personal-loan", label: "Personal Loan" },
  { id: "car-loan", label: "Car Loan" },
  { id: "business-loan", label: "Business Loan" },
];

interface Partner {
  name: string;
  logoUrl: string;
}

const partnersData: Record<string, Partner[]> = {
  "personal-loan": [
    { name: "HDFC Bank", logoUrl: "/logos/hdfc-bank.png" },
    { name: "ICICI Bank", logoUrl: "/logos/icici-bank.png" },
    { name: "Axis Bank", logoUrl: "/logos/axis-bank.png" },
    { name: "IDFC FIRST Bank", logoUrl: "/logos/idfc-first.png" },
    { name: "YES Bank", logoUrl: "/logos/yes-bank.png" },
    { name: "SMFG India Credit", logoUrl: "/logos/smfg.png" },
    { name: "InCred", logoUrl: "/logos/incred.png" },
    { name: "Hero FinCorp", logoUrl: "/logos/hero-fincorp.png" },
    { name: "Poonawalla Fincorp", logoUrl: "/logos/Poonawalla.png" },
    { name: "Kotak Bank", logoUrl: "/logos/kotak-bank.png" },
    { name: "Bajaj Finserv", logoUrl: "/logos/bajaj-finserv.png" },
    { name: "Tata Capital", logoUrl: "/logos/tata-capital.png" },
    { name: "Aditya Birla", logoUrl: "/logos/Aditya birla.png" },
    { name: "CITI Bank", logoUrl: "/logos/Citi-bank.png" },
    { name: "RBL Bank", logoUrl: "/logos/RBL-bank.png" },
    { name: "Clix Capital", logoUrl: "/logos/Clix.png" },
    { name: "IDFC Bank", logoUrl: "/logos/IDFC-bank.png" },
    { name: "LoanTap", logoUrl: "/logos/LoanTap.png" },
    { name: "PaySense", logoUrl: "/logos/paysense.png" },
    { name: "FT Cash", logoUrl: "/logos/ft-cash.png" },
    { name: "Muthoot Finance", logoUrl: "/logos/muthoot.png" },
    { name: "IndiaBulls", logoUrl: "/logos/indiabulls.png" },
    { name: "Deutsche Bank", logoUrl: "/logos/deutsche-bank.png" },
    { name: "L&T", logoUrl: "/logos/l-t.png" },
    { name: "Reliance", logoUrl: "/logos/reliance.png" },
    { name: "Shriram Bank", logoUrl: "/logos/shriram-bank.png" },
    { name: "DCB Bank", logoUrl: "/logos/dcb-bank.png" },
    { name: "HDFC Sales", logoUrl: "/logos/hdfc-sales.png" },
    { name: "IIFL", logoUrl: "/logos/iifl.png" },
    { name: "Bank of Baroda", logoUrl: "/logos/bob.png" },
    { name: "Edelweiss", logoUrl: "/logos/edelweiss.png" },
    { name: "Federal Bank", logoUrl: "/logos/federal-bank.png" },
    { name: "Canara Bank", logoUrl: "/logos/canara-bank.png" },
    { name: "Ujjivan Small Finance", logoUrl: "/logos/ujjivan.png" },
    { name: "IndusInd Bank", logoUrl: "/logos/indusind-bank.png" },
    { name: "Union Bank of India", logoUrl: "/logos/union-bank.png" },
    { name: "State Bank of India", logoUrl: "/logos/sbi.png" },
    { name: "IDBI", logoUrl: "/logos/idbi.png" },
    { name: "Punjab National Bank", logoUrl: "/logos/pnb.png" },
    { name: "Indian Bank", logoUrl: "/logos/indian-bank.png" },
    { name: "Bank of India", logoUrl: "/logos/bank-of-india.png" },
    { name: "Karnataka Bank", logoUrl: "/logos/karnataka-bank.png" },
    { name: "Punjab & Sind Bank", logoUrl: "/logos/punjab-sind-bank.png" },
    { name: "Karur Vysya Bank", logoUrl: "/logos/karur.png" },
    { name: "HSBC", logoUrl: "/logos/hsbc.png" },
    { name: "MoneyWide", logoUrl: "/logos/moneywide.png" },
  ],
  "home-loan": [
    { name: "SBI", logoUrl: "/logos/sbi.png" },
    { name: "HDFC Bank", logoUrl: "/logos/hdfc-bank.png" },
    { name: "ICICI Bank", logoUrl: "/logos/icici-bank.png" },
    { name: "Axis Bank", logoUrl: "/logos/axis-bank.png" },
    { name: "LIC Housing Finance", logoUrl: "/logos/lic-housing.png" },
    { name: "PNB Housing Finance", logoUrl: "/logos/pnb-housing.png" },
    { name: "Kotak Mahindra Bank", logoUrl: "/logos/kotak-bank.png" },
    { name: "Bank of Baroda", logoUrl: "/logos/bob.png" },
    { name: "Canara Bank", logoUrl: "/logos/canara-bank.png" },
    { name: "Union Bank of India", logoUrl: "/logos/union-bank.png" },
    { name: "IDFC FIRST Bank", logoUrl: "/logos/idfc-first.png" },
    { name: "IndusInd Bank", logoUrl: "/logos/indusind-bank.png" },
    { name: "Federal Bank", logoUrl: "/logos/federal-bank.png" },
    { name: "Karnataka Bank", logoUrl: "/logos/karnataka-bank.png" },
    { name: "RBL Bank", logoUrl: "/logos/RBL-bank.png" },
    { name: "DCB Bank", logoUrl: "/logos/dcb-bank.png" },
    { name: "Karur Vysya Bank", logoUrl: "/logos/karur.png" },
    { name: "Indian Bank", logoUrl: "/logos/indian-bank.png" },
  ],
  "car-loan": [
    { name: "HDFC Bank", logoUrl: "/logos/hdfc-bank.png" },
    { name: "ICICI Bank", logoUrl: "/logos/icici-bank.png" },
    { name: "Axis Bank", logoUrl: "/logos/axis-bank.png" },
    { name: "SBI", logoUrl: "/logos/sbi.png" },
    { name: "Kotak Mahindra Bank", logoUrl: "/logos/kotak-bank.png" },
    { name: "IDFC FIRST Bank", logoUrl: "/logos/idfc-first.png" },
    { name: "IndusInd Bank", logoUrl: "/logos/indusind-bank.png" },
    { name: "RBL Bank", logoUrl: "/logos/RBL-bank.png" },
    { name: "Federal Bank", logoUrl: "/logos/federal-bank.png" },
    { name: "Bajaj Finserv", logoUrl: "/logos/bajaj-finserv.png" },
    { name: "Tata Capital", logoUrl: "/logos/tata-capital.png" },
    { name: "IndiaBulls", logoUrl: "/logos/indiabulls.png" },
    { name: "Edelweiss", logoUrl: "/logos/edelweiss.png" },
    { name: "L&T Finance", logoUrl: "/logos/l-t.png" },
    { name: "Hero FinCorp", logoUrl: "/logos/hero-fincorp.png" },
    { name: "Muthoot Finance", logoUrl: "/logos/muthoot.png" },
    { name: "IIFL", logoUrl: "/logos/iifl.png" },
    { name: "Aditya Birla Capital", logoUrl: "/logos/Aditya birla.png" },
  ],
  "business-loan": [
    { name: "HDFC Bank", logoUrl: "/logos/hdfc-bank.png" },
    { name: "ICICI Bank", logoUrl: "/logos/icici-bank.png" },
    { name: "Axis Bank", logoUrl: "/logos/axis-bank.png" },
    { name: "SBI", logoUrl: "/logos/sbi.png" },
    { name: "Kotak Mahindra Bank", logoUrl: "/logos/kotak-bank.png" },
    { name: "IDFC FIRST Bank", logoUrl: "/logos/idfc-first.png" },
    { name: "IndusInd Bank", logoUrl: "/logos/indusind-bank.png" },
    { name: "RBL Bank", logoUrl: "/logos/RBL-bank.png" },
    { name: "Federal Bank", logoUrl: "/logos/federal-bank.png" },
    { name: "Bank of Baroda", logoUrl: "/logos/bob.png" },
    { name: "Punjab National Bank", logoUrl: "/logos/pnb.png" },
    { name: "Canara Bank", logoUrl: "/logos/canara-bank.png" },
    { name: "Union Bank of India", logoUrl: "/logos/union-bank.png" },
    { name: "Indian Bank", logoUrl: "/logos/indian-bank.png" },
    { name: "Bajaj Finserv", logoUrl: "/logos/bajaj-finserv.png" },
    { name: "Tata Capital", logoUrl: "/logos/tata-capital.png" },
    { name: "L&T Finance", logoUrl: "/logos/l-t.png" },
    { name: "Bank of India", logoUrl: "/logos/bank-of-india.png" },
  ],
};

export const PartnersSection = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState("home-loan");
  const currentPartners = partnersData[activeTab] ?? partnersData["home-loan"];

  return (
    <section
      className="w-full py-[80px]"
      style={{ background: "linear-gradient(360deg, #F4F9FF 0%, #FFFFFF 100%)" }}
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-[57px]">

        {/* Heading */}
        <div className="flex flex-col items-center gap-[12px] mb-[40px]">
          <h2
            className="text-center text-[#283340] leading-[120%]"
            style={{
              fontFamily: "'Power Grotesk', 'Power Grotesk Trial', Helvetica, sans-serif",
              fontWeight: 400,
              fontSize: "64px",
            }}
          >
            Our Partners
          </h2>
          <p
            className="text-center leading-[21px] tracking-[-0.02em]"
            style={{
              fontFamily: "'DM Sans', Helvetica, sans-serif",
              fontWeight: 500,
              fontSize: "20px",
              color: "#8C909A",
            }}
          >
            Connect with our trusted network of 54+ financial partners
          </p>
        </div>

        {/* Tab strip */}
        <div className="flex items-center justify-center gap-4 mb-[56px]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center justify-center transition-all duration-200"
              style={
                activeTab === tab.id
                  ? {
                      padding: "12px 24px",
                      height: "50px",
                      background: "#0977FF",
                      border: "1px solid #DBEAFE",
                      borderRadius: "9999px",
                      fontFamily: "'Inter', Helvetica, sans-serif",
                      fontWeight: 700,
                      fontSize: "13.5px",
                      lineHeight: "24px",
                      color: "#FFFFFF",
                      whiteSpace: "nowrap",
                    }
                  : {
                      padding: "12px 24px",
                      height: "50px",
                      background: "rgba(255, 255, 255, 0.9)",
                      border: "1px solid #DBEAFE",
                      borderRadius: "9999px",
                      fontFamily: "'Inter', Helvetica, sans-serif",
                      fontWeight: 700,
                      fontSize: "13.5px",
                      lineHeight: "24px",
                      color: "#374151",
                      whiteSpace: "nowrap",
                    }
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Logo grid */}
        <div
          className="flex flex-row flex-wrap justify-center"
          style={{ gap: "20px 22px", maxWidth: "1324px", margin: "0 auto" }}
        >
          {currentPartners.map((partner, i) => (
            <div
              key={`${partner.name}-${i}`}
              className="flex items-center justify-center bg-white"
              style={{
                width: "127.38px",
                minWidth: "127.38px",
                height: "58.71px",
                borderRadius: "8.86px",
                padding: "11px 19px",
              }}
            >
              <img
                src={partner.logoUrl}
                alt={partner.name}
                style={{
                  maxWidth: "88.61px",
                  maxHeight: "33.23px",
                  width: "100%",
                  objectFit: "contain",
                }}
                title={partner.name}
              />
            </div>
          ))}
        </div>

        {/* CTA (styled button per Frame 24517157) */}
        <div className="flex justify-center mt-[56px]">
          <button
            onClick={() => {
              /* TODO: wire CTA action */
            }}
            className="uppercase whitespace-nowrap"
            style={{
              fontFamily: "'DM Sans', Helvetica, sans-serif",
              fontWeight: 700,
              fontSize: "13.7px",
              lineHeight: "20px",
              padding: "16px 36px",
              minWidth: "190px",
              height: "52px",
              background: "#0977FF",
              boxShadow: "0px 4px 11.8px -5px #0050B2",
              borderRadius: "4px",
              border: "none",
              color: "#FFFFFF",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            GET BEST OFFERS
          </button>
        </div>
      </div>
    </section>
  );
};
