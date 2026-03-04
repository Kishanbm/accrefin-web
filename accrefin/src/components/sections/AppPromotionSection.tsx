import React from "react";
// import { AnimatedMobilePhone } from "./AnimatedMobilePhone";
// import { AppDownloadPromo } from './AppDownloadPromo';

export const AppPromotionSection = (): JSX.Element => {
  // Replace these with your actual image paths
//   const appLogo = "/assets/images/accrefin-logo-black.svg"; // Your logo
//   const googlePlayIcon = "data:image/png;base64,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"; // Replace with your Google Play icon
  const qrCode = "data:image/png;base64,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"; // Replace with your app QR code
  const appScreenshots = "https://cdn.urbanmoney.com/homepageimages/partersapp.svg"; // Replace with your app screenshots image
  const appStoreIcon = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOanUrYt2Eo8LrxK9VOJHHE8kSi918fXRiGEwpYyw_ERiZo8H2uxKyxYhIc--zOMwKnTM&usqp=CAU"; // Replace with your App Store icon
  const indiaMap = "https://cdn.urbanmoney.com/homepageimages/map.svg"; // This is the base map of India

  return (
    <section className="w-full py-12 relative overflow-hidden" style={{ background: "#F4F9FF" }}>


      <div className="container mx-auto max-w-[1400px] px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side: Text, Download Links, Phone Image */}
          <div className="flex flex-col justify-center text-center lg:text-left">
            {/* Logo */}
            <img 
              alt="Accrefin" 
              loading="lazy" 
              width="200" 
              height="80" 
              decoding="async" 
              className="mb-8 mx-auto lg:mx-0"
              src="/images/AccrefinLogoCode.svg"  
              style={{ color: "transparent" }} 
            />

            {/* <img src="/images/promo-phone.png" alt="App phone mock" className="w-56 sm:w-72 md:w-80 drop-shadow-2xl rounded-xl" /> */}


            {/* Title */}
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5 leading-tight">
              Trusted By <span className="text-[#0050B2]">10K+</span> Customers
            </h3>

            {/* Description */}
            <p className="font-light text-gray-600 mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Download the Accrefin mobile app to track your loan applications, get real-time updates, personalized offers, and manage your financial profile on the go.
            </p>

            {/* Download Links */}
            <div className="mb-8">
              <p className="text-lg font-bold text-gray-900 mb-4">Scan or click to Download App on your mobile</p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <div className="flex flex-col items-center sm:items-start gap-2">
                  {/* <a href="#" target="_blank" rel="noopener noreferrer">
                    <img alt="Google Play" loading="lazy" width="140" height="47" decoding="async" style={{ color: "transparent" }} src={googlePlayIcon} />
                  </a> */}
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <img alt="App Store" loading="lazy" width="140" height="47" decoding="async" style={{ color: "transparent" }} src={appStoreIcon} />
                  </a>
                </div>
                <span className="text-gray-500 font-semibold text-lg py-2 sm:px-4">Or</span>
                <img alt="QR Code" loading="lazy" width="100" height="100" decoding="async" style={{ color: "transparent" }} src={qrCode} />
              </div>
            </div>

            {/* App Screenshots Image */}
            <img 
              alt="App Screenshots" 
              loading="lazy" 
              width="300" 
              height="250" 
              decoding="async" 
              className="mt-6 mx-auto lg:mx-0 hidden md:block" // Hidden on small screens, shown on medium and above
              style={{ color: "transparent" }} 
            //   src={appScreenshots} 
              src="/images/phone.png"
            />
          </div>

          {/* <div className="mt-8 mx-auto lg:mx-0 hidden md:block">
            <AnimatedMobilePhone />
        </div> */}
        {/* </div> */}

          {/* Right Side: Map of India with Bangalore Marker */}
          <div className="relative flex justify-center items-center h-[450px] w-full lg:h-[550px]">
            {/* Base Map Image */}
            <img 
              alt="Map of India" 
              loading="lazy" 
              width="700" 
              height="860" 
              decoding="async" 
            //   className="absolute inset-0 w-full h-full object-contain object-center opacity-60 grayscale" 
              style={{ color: "transparent" }} 
              src={indiaMap} 
            />

            {/* Bangalore Pulse Dot and Label */}
            <div className="absolute" style={{ top: '91.6%', left: '27.2%' /* Adjust these values for precise Bangalore location */ }}>
              <div className="relative flex items-center justify-center">
                {/* Pulse effect */}
                <span className="absolute w-5 h-5 bg-[#0050B2] rounded-full opacity-75 animate-ping"></span>
                {/* Inner dot */}
                <span className="relative flex items-center justify-center w-3 h-3 bg-[#0050B2] rounded-full text-white text-xs font-semibold"></span>
              </div>
              {/* Label */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white text-gray-800 text-xs px-2 py-1 rounded-md shadow-md whitespace-nowrap">
                Bengaluru
              </div>
            </div>
            
            {/* Optional: Add more specific cities*/}
            {/* Example for a different city: */}
            {/*
            <div className="absolute" style={{ top: '25%', left: '45%' }}> // Example coordinates for Delhi
              <div className="relative flex items-center justify-center">
                <span className="absolute w-5 h-5 bg-[#0050B2] rounded-full opacity-75 animate-ping"></span>
                <span className="relative flex items-center justify-center w-3 h-3 bg-[#0050B2] rounded-full text-white text-xs font-semibold"></span>
              </div>
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white text-gray-800 text-xs px-2 py-1 rounded-md shadow-md whitespace-nowrap">
                Delhi
              </div>
            </div>
            */}
          </div>
        </div>
      </div>
    </section>
  );
};