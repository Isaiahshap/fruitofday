'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fruit } from '@/types';
import Image from 'next/image';
import dynamic from 'next/dynamic';

// Dynamically import react-confetti to avoid SSR issues
const ReactConfetti = dynamic(() => import('react-confetti'), {
  ssr: false
});

interface BasketProps {
  fruits: Fruit[];
  count: number;
  onReset: () => void;
}

// Blinking text component
const BlinkingText = ({ children, speed = 500, className = "" }: { children: React.ReactNode, speed?: number, className?: string }) => {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(v => !v);
    }, speed);
    
    return () => clearInterval(interval);
  }, [speed]);
  
  return (
    <span className={className} style={{ visibility: visible ? 'visible' : 'hidden' }}>
      {children}
    </span>
  );
};

// Random Hindi phrases
const hindiPhrases = [
  "अब खरीदो!",
  "हमारे फल सबसे अच्छे हैं!",
  "सुनहरा अवसर!",
  "अभी क्लिक करें!",
  "सीमित समय!",
  "आज ही खरीदें!",
];

// Added scam messages for variety
const scamMessages = [
  {
    title: "⚠️ वायरस चेतावनी! ⚠️",
    heading: "आपके कंप्यूटर में 13 वायरस मिले हैं!",
    description: "कृपया अभी अपने सिस्टम को ठीक करने के लिए हमें कॉल करें:",
    phone: "+1-800-123-4567",
    buttonText: "SCAN NOW"
  },
  {
    title: "🎡 आज का इनाम! 🎡",
    heading: "बधाई हो! आप आज के विजेता हैं!",
    description: "अपने फ्री आईफोन और $1000 का दावा करने के लिए अभी रजिस्टर करें:",
    phone: "+1-833-WIN-PRIZE",
    buttonText: "CLAIM NOW"
  },
  {
    title: "💰 Spin the Wheel! 💰",
    heading: "You could win up to $10,000!",
    description: "Enter your details to spin Mayer's wheel of fortune:",
    phone: "+1-888-SPIN-WIN",
    buttonText: "SPIN NOW"
  },
  {
    title: "🛡️ सुरक्षा अलर्ट! 🛡️",
    heading: "आपका खाता खतरे में है!",
    description: "अपने खाते को सुरक्षित करने के लिए अभी अपने क्रेडिट कार्ड की जानकारी दर्ज करें:",
    phone: "+1-877-SECURE",
    buttonText: "SECURE NOW"
  }
];

export default function Basket({ fruits, count, onReset }: BasketProps) {
  const [showCongrats, setShowCongrats] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [randomMessage, setRandomMessage] = useState(0);
  const [flashingColors, setFlashingColors] = useState(false);
  const [showScam, setShowScam] = useState(false);
  const [currentScam, setCurrentScam] = useState(0);
  
  useEffect(() => {
    setIsClient(true);
    setCurrentScam(Math.floor(Math.random() * scamMessages.length));
    // Set window size for confetti
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });

    // Add window resize listener
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    
    // Change random message every 2 seconds
    const messageInterval = setInterval(() => {
      setRandomMessage(prev => (prev + 1) % hindiPhrases.length);
    }, 2000);
    
    // Toggle flashing every 1 second
    const flashInterval = setInterval(() => {
      setFlashingColors(prev => !prev);
    }, 1000);
    
    // Show scam popup after a longer delay
    const scamTimeout = setTimeout(() => {
      setCurrentScam(Math.floor(Math.random() * scamMessages.length));
      setShowScam(true);
    }, 90000); // Changed from 20000 to 90000 for much less frequency
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(messageInterval);
      clearInterval(flashInterval);
      clearTimeout(scamTimeout);
    };
  }, []);
  
  useEffect(() => {
    if (fruits.length >= 5 && !showCongrats) {
      setShowCongrats(true);
    }
    
    // Log for debugging
    console.log(`Basket component received count: ${count}/10`);
    console.log(`Basket component received fruits:`, fruits.length);
  }, [count, fruits, showCongrats]);

  return (
    <div className="relative w-full max-w-md mx-auto">
      {showCongrats && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={true}
          numberOfPieces={500}
          gravity={0.2}
        />
      )}
      
      <div className={`rounded-lg p-6 shadow-md min-h-[300px] flex flex-col items-center neon-border relative overflow-hidden ${flashingColors ? 'bg-purple-300' : 'bg-amber-100'}`}>
        <div className="absolute -right-5 -top-5 rotate-45 bg-red-600 text-white px-8 py-1 shadow-lg z-10 font-bold text-sm">
          HOT DEAL!
        </div>
        
        <div className="absolute -left-5 -top-5 -rotate-45 bg-green-600 text-white px-8 py-1 shadow-lg z-10 font-bold text-sm">
          50% OFF!
        </div>
        
        <BlinkingText className="text-2xl font-bold mb-4 text-red-600 neon-text" speed={300}>
          फल टोकरी!!! - FRUIT BASKET!!!
        </BlinkingText>
        
        <div className="relative w-full h-48 bg-amber-50 rounded-lg shadow-inner overflow-hidden border-4 border-dashed border-yellow-600">
          {/* Remove basket image background */}
          
          <div className="absolute top-2 left-2 right-2 flex justify-between">
            <div className="bg-red-500 text-white text-xs p-1 rounded">
              <BlinkingText speed={150}>SALE!!!</BlinkingText>
            </div>
            <div className="bg-green-500 text-white text-xs p-1 rounded">
              <BlinkingText speed={150}>HOT!!!</BlinkingText>
            </div>
          </div>
          
          <div className="absolute inset-0 flex flex-wrap content-start gap-2 p-4 pt-8">
            <AnimatePresence>
              {fruits.map((fruit, index) => {
                const rotateVal = isClient ? Math.random() * 360 : 0;
                const xOffset = isClient ? Math.random() * 10 - 5 : 0;
                const yOffset = isClient ? Math.random() * 10 - 5 : 0;
                
                return (
                  <motion.div
                    key={`${fruit.id}-${index}`}
                    initial={{ scale: 0, rotate: 0 }}
                    animate={{ 
                      scale: 1, 
                      rotate: rotateVal,
                      x: xOffset,
                      y: yOffset,
                    }}
                    exit={{ scale: 0 }}
                    className="w-12 h-12"
                  >
                    <Image 
                      src={fruit.image} 
                      alt={fruit.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-contain"
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
          
          {/* Floating text overlay */}
          <div className="absolute bottom-2 left-0 right-0 text-center">
            <div className="bg-yellow-300 bg-opacity-80 p-1 text-xs font-bold text-red-600 marquee">
              {hindiPhrases[randomMessage]} ⭐ BUY NOW! ⭐ {hindiPhrases[randomMessage]} ⭐ BEST DEAL! ⭐
            </div>
          </div>
        </div>
        
        <div className="mt-4 bg-amber-200 px-4 py-2 rounded-full relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-amber-500 opacity-50"></div>
          <motion.p 
            className="text-amber-800 font-bold relative z-10"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            फल: <span className="text-amber-600">{count}</span> / 10
          </motion.p>
        </div>
        
        {/* Random discount badges */}
        <div className="absolute top-1/4 right-4 rotate-12 bg-red-600 text-white rounded-full h-16 w-16 flex items-center justify-center text-center p-1">
          <div className="text-xs font-bold">
            <BlinkingText>
              SAVE<br />70%
            </BlinkingText>
          </div>
        </div>
        
        <div className="absolute bottom-1/4 left-4 -rotate-12 bg-green-600 text-white rounded-full h-16 w-16 flex items-center justify-center text-center p-1">
          <div className="text-xs font-bold">
            <BlinkingText speed={400}>
              FREE<br />GIFT
            </BlinkingText>
          </div>
        </div>
        
        {/* Fake payment methods */}
        <div className="flex gap-2 justify-center mt-3">
          <div className="bg-white p-1 rounded shadow">
            <Image 
              src="/images/visa.png" 
              alt="Visa" 
              width={32} 
              height={20} 
              className="object-contain" 
            />
          </div>
          <div className="bg-white p-1 rounded shadow">
            <Image 
              src="/images/mastercard.png" 
              alt="Mastercard" 
              width={32} 
              height={20} 
              className="object-contain" 
            />
          </div>
          <div className="bg-white p-1 rounded shadow">
            <Image 
              src="/images/paypal.png" 
              alt="PayPal" 
              width={32} 
              height={20} 
              className="object-contain" 
            />
          </div>
        </div>
      </div>

      {/* Congratulations overlay */}
      <AnimatePresence>
        {showCongrats && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-r from-amber-500 to-yellow-500 bg-opacity-90 rounded-lg flex flex-col items-center justify-center z-20"
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ 
                scale: [1, 1.1, 1], 
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                scale: { repeat: Infinity, duration: 2 },
                rotate: { repeat: Infinity, duration: 1.5 }
              }}
              className="bg-white p-6 rounded-xl shadow-lg border-4 border-yellow-400"
            >
              <h3 className="text-2xl font-bold text-amber-600 mb-2 neon-text">अद्भुत सफलता!</h3>
              <p className="text-gray-700">आपने 10 फल इकट्ठा किए हैं!</p>
              <p className="text-green-600 font-bold text-sm mt-2">आपको $500 का गिफ्ट कार्ड मिला!</p>
              
              <div className="mt-2 mb-4">
                <input 
                  type="email" 
                  placeholder="अपना ईमेल दर्ज करें" 
                  className="w-full border border-gray-300 p-2 text-center"
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowCongrats(false);
                    onReset();
                  }}
                  className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors flex-1"
                >
                  <BlinkingText speed={300}>CLAIM NOW</BlinkingText>
                </button>
                <button
                  onClick={() => {
                    setShowCongrats(false);
                    onReset();
                  }}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex-1"
                >
                  <BlinkingText speed={300}>GET $500</BlinkingText>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Fake "Your computer has a virus" popup */}
      <AnimatePresence>
        {showScam && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="fixed inset-0 bg-red-600 flex flex-col items-center justify-center z-50 p-4"
          >
            <div className="bg-white p-6 rounded-lg max-w-md w-full text-center">
              <div className="text-3xl text-red-600 mb-4">{scamMessages[currentScam].title}</div>
              <h2 className="text-xl font-bold mb-2">{scamMessages[currentScam].heading}</h2>
              <p className="mb-4">{scamMessages[currentScam].description}</p>
              <div className="text-2xl font-bold text-red-600 mb-4">
                <BlinkingText>{scamMessages[currentScam].phone}</BlinkingText>
              </div>
              <button 
                onClick={() => setShowScam(false)}
                className="bg-green-500 text-white px-6 py-3 rounded-lg font-bold mb-2 w-full"
              >
                {scamMessages[currentScam].buttonText}
              </button>
              <button 
                onClick={() => setShowScam(false)}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-bold mb-2 w-full"
              >
                Enter now for the Mayer Scharlat special
              </button>
              <button 
                onClick={() => setShowScam(false)}
                className="text-sm text-gray-500"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 