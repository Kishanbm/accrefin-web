import React, { useState, useEffect } from "react";
import { Button } from "../../../../components/ui/button";
import { PhoneIcon, MessageCircleIcon, XIcon } from "lucide-react";

export const StickyCTABar = (): JSX.Element => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Show after scrolling 50% of viewport height
      setIsVisible(scrollPosition > windowHeight * 0.5);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ${
      isMinimized ? 'transform translate-y-12' : 'transform translate-y-0'
    }`}>
      <div className="bg-gradient-to-r from-[#0050B2] to-[#003d8a] text-white shadow-2xl">
        <div className="container mx-auto max-w-[1400px] px-6">
          <div className="flex items-center justify-between py-4">
            {/* Left Side - Message */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:block">
                <h3 className="font-semibold text-lg">Need Help? Chat with an Advisor</h3>
                <p className="text-blue-100 text-sm">Get personalized loan advice in minutes</p>
              </div>
              <div className="sm:hidden">
                <h3 className="font-semibold">Need Help?</h3>
              </div>
            </div>

            {/* Right Side - Action Buttons */}
            <div className="flex items-center gap-3">
              <Button 
                size="sm"
                className="bg-white text-[#0050B2] hover:bg-gray-100 font-semibold px-4 py-2 rounded-lg transition-all duration-300"
              >
                <PhoneIcon className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Request Callback</span>
                <span className="sm:hidden">Call</span>
              </Button>

              <Button 
                size="sm"
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300"
              >
                <MessageCircleIcon className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">WhatsApp Chat</span>
                <span className="sm:hidden">Chat</span>
              </Button>

              {/* Minimize Button */}
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300"
              >
                <XIcon className={`w-4 h-4 transition-transform duration-300 ${
                  isMinimized ? 'rotate-45' : 'rotate-0'
                }`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Minimized State */}
      {isMinimized && (
        <div className="bg-[#0050B2] text-white py-2">
          <div className="container mx-auto max-w-[1400px] px-6">
            <div className="flex items-center justify-center">
              <button
                onClick={() => setIsMinimized(false)}
                className="flex items-center gap-2 text-sm font-medium hover:text-blue-200 transition-colors duration-300"
              >
                <PhoneIcon className="w-4 h-4" />
                Need Help? Click to expand
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};