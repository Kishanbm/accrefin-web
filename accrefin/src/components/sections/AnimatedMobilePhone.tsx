// import React from 'react';

// export const AnimatedMobilePhone = (): JSX.Element => {
//   return (
//     // ⭐️ 1. Animation Styles (CSS Keyframes) ⭐️
//     <>
//       <style>{`
//         /* Define the floating animation */
//         @keyframes float {
//             0% { transform: translateY(0px); }
//             50% { transform: translateY(-10px); } /* Moves the phone up by 10 pixels */
//             100% { transform: translateY(0px); }
//         }
//         .animate-float {
//             animation: float 4s ease-in-out infinite; /* 4 second loop */
//         }
//       `}</style>

//       {/* ⭐️ 2. Mobile Phone JSX Structure ⭐️ */}
//       <div className="relative mx-auto w-64 h-[400px] shadow-2xl rounded-[3rem]">
//         {/* Outermost container with animation applied */}
//         <div 
//           className="absolute inset-0 border-[5px] border-gray-900 bg-gray-900 rounded-[3rem] animate-float transform origin-bottom"
//           style={{ 
//             boxShadow: '0 10px 20px rgba(0, 0, 0, 0.4), 0 0 0 1px #e5e7eb' // Soft glow/shadow
//           }}
//         >
//           {/* Inner Screen/Display Area */}
//           <div className="absolute inset-2 bg-white rounded-[2.5rem] overflow-hidden">
//             {/* Inner Content Placeholder (Header/App Screen Top) */}
//             <div className="bg-[#0050B2] h-16 flex items-center justify-center">
//               <span className="text-white font-bold text-lg">ACCREFIN App</span>
//             </div>
            
//             {/* Mock Content */}
//             <div className="p-4 text-center text-gray-500">
//               <p className="font-semibold mb-2">Track Your Loans</p>
//               <div className="h-6 w-full bg-gray-200 rounded-full mb-1"></div>
//               <div className="h-6 w-full bg-gray-200 rounded-full"></div>
//             </div>

//             {/* Home Loan Card Mock */}
//             <div className="bg-blue-100 p-3 m-4 rounded-lg shadow-md">
//                 <p className="text-sm font-semibold text-[#0050B2]">Loan Offer Ready</p>
//             </div>
            
//             {/* Scroll Bar Mock */}
//             <div className="absolute right-0 top-24 h-64 w-1 bg-gray-300 rounded-full">
//                 <div className="h-10 w-1 bg-gray-500 rounded-full transform translate-y-1/2"></div>
//             </div>

//           </div>
//         </div>
        
//         {/* Top Camera/Speaker Notch Mock */}
//         <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-3 bg-gray-900 rounded-b-lg z-10"></div>
//       </div>
//     </>
//   );
// };