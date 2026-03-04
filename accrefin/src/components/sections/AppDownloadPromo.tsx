// import React from 'react';
// import { Button } from '../../components/ui/button'; // Assuming Button component path
// import { Zap, Download } from 'lucide-react'; // Example icons

// export const AppDownloadPromo = (): JSX.Element => {
//   // ⭐️ Content based on the image text ⭐️
//   const mainTitle = "Unlock More Power";
//   const subtitle = "Seamless experience, personalized for you.";

//   return (
//     // ⭐️ Left-Side Promo Container ⭐️
//     <div className="flex flex-col justify-center p-8 md:p-12 h-full min-h-[520px] rounded-2xl bg-transparent text-white">

//       {/* 1. Main Text Content (Large, Left-aligned) */}
//       <div className="space-y-6 self-start max-w-md">
//         <h2 className="text-5xl sm:text-6xl lg:text-6xl font-extrabold leading-tight">
//           {mainTitle}
//         </h2>
//         <p className="text-lg sm:text-xl font-light opacity-90">
//           {subtitle}
//         </p>
//       </div>

//       {/* 2. Replace phone mock with provided transparent PNG */}
//       <div className="relative w-full mt-6 flex justify-center items-end">
//         <div className="relative">
//           {/* The user-provided phone image should be placed at: /assets/images/promo-phone.png */}
//           <img src="/assets/images/promo-phone.png" alt="App phone mock" className="w-56 sm:w-72 md:w-80 drop-shadow-2xl rounded-xl" />

//           {/* Download buttons overlapping the bottom of the phone */}
//           <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4">
//             <a href="YOUR_APP_STORE_LINK_HERE" target="_blank" rel="noopener noreferrer"
//                className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md text-gray-900 bg-white hover:bg-gray-100 transition-colors duration-200 shadow-lg">
//               <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">{/* Apple SVG Path */}</svg>
//               App Store
//             </a>

//             <a href="YOUR_GOOGLE_PLAY_LINK_HERE" target="_blank" rel="noopener noreferrer"
//                className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md text-gray-900 bg-white hover:bg-gray-100 transition-colors duration-200 shadow-lg">
//               <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">{/* Google Play SVG Path */}</svg>
//               Google Play
//             </a>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };