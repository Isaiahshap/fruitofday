'use client';

import { useState, useCallback, useEffect } from 'react';
import FruitCarousel from '@/components/FruitCarousel';
import Basket from '@/components/Basket';
import DropZone from '@/components/DropZone';
import { Fruit } from '@/types';

// Random Hindi texts to use in marquees
const hindiTexts = [
  "फल खरीदें! मुफ्त उपहार पाएं! - MAYER SCHARLAT",
  "सुपर ऑफर! अभी खरीदें! - MAYER SCHARLAT APPROVED",
  "एक फल खरीदें, एक फल मुफ्त पाएं! - MAYER SAYS BUY NOW",
  "यह ऑफर सीमित समय के लिए है! - MAYER SCHARLAT SPECIAL",
  "सबसे अच्छे फल यहां मिलते हैं! - MAYER'S CHOICE",
  "इस वेबसाइट पर आने के लिए धन्यवाद! - MAYER WELCOMES YOU",
  "अविश्वसनीय कीमतों पर ताजा फल! - MAYER'S FRESH FRUITS",
  "अभी रजिस्टर करें और 50% छूट पाएं! - MAYER SCHARLAT DISCOUNT",
  "THIS IS FRUIT OF THE DAY BUY NOW SOCIAL SECURITY TIMESHARES - MAYER SCHARLAT",
  "सोशल सिक्योरिटी टाइमशेयर कि बिक्री चालू है! - MAYER SPECIAL DEAL",
  "आज का फल ऑफ़र! अभी खरीदें! SOCIAL SECURITY - MAYER SCHARLAT",
  "टाइमशेयर प्रॉपर्टी फल के साथ मुफ्त! - LIMITED TIME OFFER",
  "TIMESHARES अब फलों में भी उपलब्ध! - MAYER'S NEW PRODUCT"
];

// Popup content with more Mayer Scharlat references
const popupContents = [
  {
    title: "Hello Mayer Scharlat!",
    content: "Enter Social Security Number here:",
    inputType: "password",
    buttonText: "Submit Now to Mayer!"
  },
  {
    title: "Mayer Scharlat Says Congratulations!",
    content: "You have won a FREE iPhone 15 from Mayer Scharlat!",
    inputType: "email",
    buttonText: "Claim Now from Mayer!"
  },
  {
    title: "Warning from Mayer Scharlat!",
    content: "Your computer has 13 viruses! Mayer can help!",
    inputType: "tel",
    buttonText: "Let Mayer Fix Now!"
  },
  {
    title: "Mayer Scharlat Survey",
    content: "Enter your credit card to continue with Mayer Scharlat:",
    inputType: "text",
    buttonText: "Continue with Mayer"
  },
  {
    title: "Mayer Scharlat Premium Membership",
    content: "Join Mayer Scharlat's exclusive fruit club:",
    inputType: "email",
    buttonText: "Join Mayer's Club"
  },
  {
    title: "Message from Mayer Scharlat",
    content: "Mayer Scharlat has selected YOU for special offers!",
    inputType: "text",
    buttonText: "Accept Mayer's Offer"
  },
  {
    title: "🎡 Spin the Wheel!",
    content: "You've been selected to spin Mayer's Wheel of Fortune!",
    inputType: "email",
    buttonText: "Spin & Win Now!"
  },
  {
    title: "🏆 Mayer's Weekly Prize Draw",
    content: "You're our 1,000,000th visitor! Claim your prize now:",
    inputType: "text",
    buttonText: "Claim Prize"
  },
  {
    title: "💲 Mayer's Crypto Opportunity",
    content: "Invest in MayerCoin today for 5000% returns:",
    inputType: "text",
    buttonText: "Invest Now"
  },
  {
    title: "🔐 Account Security Alert",
    content: "Your Mayer account has been compromised! Verify now:",
    inputType: "password",
    buttonText: "Secure Account"
  },
  {
    title: "👨‍👩‍👧‍👦 Mayer's Dating Service",
    content: "Singles in your area are looking for fruit lovers:",
    inputType: "text",
    buttonText: "Meet Singles Now"
  }
];

// Adding more scammy Hindi texts
const moreHindiTexts = [
  "🔥🔥 आज ही खरीदें! कल नहीं मिलेगा! MAYER SCHARLAT URGENT! 🔥🔥",
  "⚠️ सावधान: हमारे फल खत्म हो रहे हैं! MAYER SOS! ⚠️",
  "💎 विशेष ग्राहकों के लिए हीरे जैसे फल! DIAMOND FRUITS! 💎",
  "🎯 सोशल सिक्योरिटी नंबर दें और फ्री फल पाएं! FREE FRUITS! 🎯",
  "🚨 अभी क्लिक करें! अभी खरीदें! MAYER SAYS NOW! 🚨",
  "💯 100% गारंटी या पैसे वापस! MONEY BACK! 💯",
  "🔐 आपकी जानकारी 100% सुरक्षित! SAFE AND SECURE! 🔐",
  "⏰ टाइम बम ऑफर! अभी के अभी करें! TIME BOMB DEAL! ⏰",
  "💰 पैसा पैसा पैसा! मेयर शार्लट के साथ! MONEY MONEY MONEY! 💰",
  "🎁 खरीदें एक फल, पाएं दस मुफ्त! BUY ONE GET TEN! 🎁",
  "🏆 आप हमारे 10,000,000वें ग्राहक हैं! YOU ARE WINNER! 🏆",
  "🧠 स्मार्ट लोग मेयर शार्लट से ही खरीदते हैं! BE SMART! 🧠"
];

const sideBarFlashingTexts = [
  "HOT!!! SUPER HOT!!!", 
  "LIMITED TIME!!", 
  "MAYER ONLY!!!",
  "URGENT DEAL!!!", 
  "SECRET OFFER!!!", 
  "VIP ACCESS!!!",
  "EXCLUSIVE!!!", 
  "DON'T MISS!!!", 
  "TOP SECRET!!!",
  "MEGA SALE!!!"
];

// Define interfaces for the state types
interface BackgroundElement {
  width: number;
  height: number;
  top: string;
  left: string;
  spinDuration: number;
  blinkDuration: number;
  scale: number;
  delay: number;
}

interface EmojiElement {
  top: string;
  left: string;
  fontSize: string;
  animationType: string;
  bounceDuration: number;
  spinDuration: number;
  blinkDuration: number;
  animationDelay: string;
  emoji: string;
  zIndex: number;
}

interface ScatteredMarquee {
  top: string;
  left: string;
  width: string;
  text: string;
  direction: string;
  speed: number;
  bgColor: string;
  textColor: string;
  fontSize: string;
  opacity: number;
  zIndex: number;
}

export default function Home() {
  const [basketFruits, setBasketFruits] = useState<Fruit[]>([]);
  const [lastDraggedFruit, setLastDraggedFruit] = useState<Fruit | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [hasAddedFruit, setHasAddedFruit] = useState(false);
  const [popups, setPopups] = useState<{id: number, x: number, y: number, content: typeof popupContents[0]}[]>([]);
  const [showFloatingEmojis] = useState(true);
  const [counter, setCounter] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  // Generate and store random cursor position
  const [cursorPosition, setCursorPosition] = useState({ top: '50%', left: '50%' });
  const [backgroundElements, setBackgroundElements] = useState<BackgroundElement[]>([]);
  const [emojiElements, setEmojiElements] = useState<EmojiElement[]>([]);
  const [scatteredMarquees, setScatteredMarquees] = useState<ScatteredMarquee[]>([]);
  const [verticalMarquees, setVerticalMarquees] = useState<ScatteredMarquee[]>([]);
  const [sideFlashTexts, setSideFlashTexts] = useState<string[]>([]);
  const [flashingBoxesLeft, setFlashingBoxesLeft] = useState<{top: string, content: string, color: string}[]>([]);
  const [flashingBoxesRight, setFlashingBoxesRight] = useState<{top: string, content: string, color: string}[]>([]);
  
  // Run once after component mounts in browser
  useEffect(() => {
    setIsMounted(true);
    
    // Set a random position for the fake cursor (only once on mount)
    setCursorPosition({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
    });
  }, []);
  
  useEffect(() => {
    // Only run this effect in the browser after mount
    if (!isMounted) return;
    
    // Create random popups every few seconds
    const popupInterval = setInterval(() => {
      if (popups.length < 8) { // Slightly increased from 5
        const newPopup = {
          id: Date.now(),
          x: Math.random() * ((typeof window !== 'undefined' ? window.innerWidth : 1000) - 300),
          y: Math.random() * ((typeof window !== 'undefined' ? window.innerHeight : 800) - 200),
          content: popupContents[Math.floor(Math.random() * popupContents.length)]
        };
        setPopups(prev => [...prev, newPopup]);
      }
    }, 15000); // Changed from 10000ms to 15000ms (15s)
    
    // Increment counter rapidly
    const counterInterval = setInterval(() => {
      setCounter(prev => prev + 1);
    }, 100);
    
    // Add key event listener for Enter key to close popups
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && popups.length > 0) {
        // Close the last popup when Enter is pressed
        setPopups(prev => prev.slice(0, -1));
      }
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      clearInterval(popupInterval);
      clearInterval(counterInterval);
      if (typeof window !== 'undefined') {
        window.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [isMounted, popups.length]);
  
  const handleDragEnd = (fruit: Fruit) => {
    console.log('Drag end:', fruit.name);
    setLastDraggedFruit(fruit);
    setHasAddedFruit(false);
    
    // If we were dragging over the drop zone when the drag ended, add the fruit
    if (isDraggingOver && basketFruits.length < 10) {
      console.log('Adding fruit directly on drag end');
      setBasketFruits(prev => [...prev, fruit]);
      setHasAddedFruit(true);
    }
  };

  const handleDragOverChange = (isOver: boolean) => {
    console.log('Drag over change:', isOver);
    setIsDraggingOver(isOver);
  };

  const handleDrop = () => {
    console.log('Drop handler called, lastDraggedFruit:', lastDraggedFruit?.name);
    // Only add the fruit if it hasn't been added in handleDragEnd
    if (lastDraggedFruit && basketFruits.length < 10 && !hasAddedFruit) {
      // Use the functional form of setState to ensure we're working with the latest state
      setBasketFruits(prevBasket => {
        const updatedBasket = [...prevBasket, lastDraggedFruit];
        console.log('Updated basket length:', updatedBasket.length);
        return updatedBasket;
      });
      
      setLastDraggedFruit(null);
    }
  };

  const resetBasket = useCallback(() => {
    setBasketFruits([]);
  }, []);

  const closePopup = (id: number) => {
    setPopups(prev => prev.filter(popup => popup.id !== id));
  };

  // Generate elements only on client-side
  useEffect(() => {
    if (!isMounted) return;
    
    // Generate background elements
    setBackgroundElements(
      Array.from({ length: 30 }).map(() => ({
        width: 30 + (Math.sin(Math.random() * 100) * 100) % 120,
        height: 30 + (Math.cos(Math.random() * 100) * 80) % 120,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        spinDuration: 5 + (Math.random() * 10) % 15,
        blinkDuration: 0.5 + (Math.random() * 2) % 3,
        scale: 0.8 + Math.random() * 1.5,
        delay: Math.random() * 5
      }))
    );
    
    // Generate emoji elements
    const emojis = ['🍎', '🍌', '🍊', '🍓', '🍍', '🍉', '🍇', '🥝', '🥭', '🍑', '🍐', '🍒', '💵', '💰', '💯', '🔥', '⭐', '💸', '📈', '🏆', '💎', '🔊', '📱', '💻'];
    setEmojiElements(
      Array.from({ length: 50 }).map(() => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        fontSize: `${15 + Math.random() * 40}px`,
        animationType: ['bounce', 'spin', 'blink', 'bounce-spin'][Math.floor(Math.random() * 4)],
        bounceDuration: 2 + Math.random() * 8,
        spinDuration: 3 + Math.random() * 10,
        blinkDuration: 0.3 + Math.random() * 2,
        animationDelay: `${Math.random() * 5}s`,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        zIndex: Math.floor(Math.random() * 30)
      }))
    );
    
    // Generate scattered marquees
    setScatteredMarquees(
      Array.from({ length: 8 }).map(() => ({
        top: `${10 + Math.random() * 80}%`,
        left: `0%`,
        width: `100%`,
        text: hindiTexts[Math.floor(Math.random() * hindiTexts.length)],
        direction: Math.random() > 0.5 ? 'normal' : 'reverse',
        speed: 15 + Math.random() * 30,
        bgColor: ['bg-cyan-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500', 'bg-green-500', 'bg-blue-500'][Math.floor(Math.random() * 6)],
        textColor: ['text-white', 'text-yellow-300', 'text-red-600', 'text-green-300'][Math.floor(Math.random() * 4)],
        fontSize: `${14 + Math.random() * 8}px`,
        opacity: 0.6 + Math.random() * 0.3,
        zIndex: 5
      }))
    );
  }, [isMounted]);

  // Generate more flashy elements on client side
  useEffect(() => {
    if (!isMounted) return;
    
    // Generate vertical marquees for side panels
    setVerticalMarquees(
      Array.from({ length: 6 }).map(() => ({
        top: `${Math.random() * 100}%`,
        left: Math.random() > 0.5 ? '0%' : '95%',
        width: '5%',
        text: moreHindiTexts[Math.floor(Math.random() * moreHindiTexts.length)],
        direction: Math.random() > 0.5 ? 'normal' : 'reverse',
        speed: 5 + Math.random() * 15,
        bgColor: ['bg-purple-600', 'bg-pink-500', 'bg-indigo-500', 'bg-red-500'][Math.floor(Math.random() * 4)],
        textColor: ['text-white', 'text-yellow-300'][Math.floor(Math.random() * 2)],
        fontSize: `${16 + Math.random() * 10}px`,
        opacity: 0.8 + Math.random() * 0.2,
        zIndex: 10
      }))
    );
    
    // Generate side flashing texts
    setSideFlashTexts(
      sideBarFlashingTexts.sort(() => Math.random() - 0.5).slice(0, 6)
    );
    
    // Generate flashing boxes for left side
    setFlashingBoxesLeft(
      Array.from({ length: 8 }).map(() => ({
        top: `${10 + Math.random() * 80}%`,
        content: moreHindiTexts[Math.floor(Math.random() * moreHindiTexts.length)],
        color: ['bg-red-500', 'bg-yellow-400', 'bg-green-500', 'bg-pink-500'][Math.floor(Math.random() * 4)]
      }))
    );
    
    // Generate flashing boxes for right side
    setFlashingBoxesRight(
      Array.from({ length: 8 }).map(() => ({
        top: `${10 + Math.random() * 80}%`,
        content: moreHindiTexts[Math.floor(Math.random() * moreHindiTexts.length)],
        color: ['bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-teal-500'][Math.floor(Math.random() * 4)]
      }))
    );
    
  }, [isMounted]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-8 bg-gradient-to-b from-fuchsia-500 to-yellow-300 relative overflow-hidden">
      {/* Blinking Background Elements - Only render on client side */}
      {isMounted && (
        <div className="fixed inset-0 pointer-events-none z-0">
          {backgroundElements.map((element, i) => (
            <div 
              key={`bg-element-${i}`} 
              className="absolute neon-border"
              style={{
                width: element.width,
                height: element.height,
                top: element.top,
                left: element.left,
                borderRadius: '50%',
                opacity: 0.3,
                transform: `scale(${element.scale})`,
                animation: `spin ${element.spinDuration}s linear infinite, blink ${element.blinkDuration}s infinite`,
                animationDelay: `${element.delay}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Scattered Hindi Marquees - Only render on client side */}
      {isMounted && (
        <div className="fixed inset-0 pointer-events-none z-5">
          {scatteredMarquees.map((marquee, index) => (
            <div 
              key={`scattered-marquee-${index}`} 
              className={`fixed py-1 ${marquee.bgColor} ${marquee.textColor} font-bold whitespace-nowrap overflow-hidden`}
              style={{ 
                top: marquee.top, 
                left: marquee.left, 
                width: marquee.width, 
                opacity: marquee.opacity,
                zIndex: marquee.zIndex
              }}
            >
              <div 
                className="marquee neon-text" 
                style={{ 
                  animationDuration: `${marquee.speed}s`,
                  animationDirection: marquee.direction,
                  fontSize: marquee.fontSize
                }}
              >
                {marquee.text} 🔥 {marquee.text} 💰 {marquee.text} 🔥 {marquee.text} 💰
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hindi Marquees - Top - now in background and only on client */}
      {isMounted && (
        <div className="fixed top-0 left-0 right-0 overflow-hidden z-5 flex flex-col">
          {hindiTexts.slice(0, 3).map((text, index) => (
            <div 
              key={`marquee-top-${index}`} 
              className="py-1 bg-cyan-500 text-white font-bold whitespace-nowrap overflow-hidden"
              style={{ opacity: 0.8 }}
            >
              <div 
                className="marquee neon-text" 
                style={{ 
                  animationDuration: `${10 + index * 5}s`,
                  fontSize: `${18 + index * 2}px`,
                }}
              >
                {text} ⭐ {text} ⭐ {text} ⭐ {text} ⭐ {text} ⭐ {text} ⭐ {text}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Marquees - Only render on client side */}
      {isMounted && (
        <div className="fixed bottom-0 left-0 right-0 overflow-hidden z-5 flex flex-col">
          {hindiTexts.slice(3, 6).map((text, index) => (
            <div 
              key={`marquee-bottom-${index}`} 
              className="py-1 bg-yellow-500 text-red-700 font-bold whitespace-nowrap overflow-hidden"
              style={{ opacity: 0.8 }}
            >
              <div 
                className="marquee neon-text" 
                style={{ 
                  animationDuration: `${15 - index * 3}s`,
                  animationDirection: index % 2 === 0 ? 'normal' : 'reverse',
                  fontSize: `${18 + index * 2}px`,
                }}
              >
                {text} 🔥 {text} 🔥 {text} 🔥 {text} 🔥 {text} 🔥 {text} 🔥
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating Emojis - Only render on client side */}
      {showFloatingEmojis && isMounted && (
        <div className="fixed inset-0 pointer-events-none z-5">
          {emojiElements.map((element, i) => (
            <div 
              key={`emoji-${i}`} 
              className="absolute"
              style={{
                top: element.top,
                left: element.left,
                fontSize: element.fontSize,
                zIndex: element.zIndex,
                animation: element.animationType === 'bounce' 
                  ? `bounce ${element.bounceDuration}s infinite` 
                  : element.animationType === 'spin' 
                  ? `spin ${element.spinDuration}s linear infinite` 
                  : element.animationType === 'blink' 
                  ? `blink ${element.blinkDuration}s infinite` 
                  : `bounce-spin ${element.bounceDuration}s infinite`,
                animationDelay: element.animationDelay
              }}
            >
              {element.emoji}
            </div>
          ))}
        </div>
      )}

      {/* Popup windows - add Enter key instruction */}
      {popups.map(popup => (
        <div 
          key={`popup-${popup.id}`}
          className="popup draggable"
          style={{
            left: popup.x,
            top: popup.y,
            minWidth: '250px',
            zIndex: 40
          }}
        >
          <div className="flex justify-between items-center bg-blue-600 text-white p-2 cursor-move">
            <h3 className="text-lg font-bold">{popup.content.title}</h3>
            <button 
              onClick={() => closePopup(popup.id)}
              className="text-white hover:text-red-300"
            >
              ✕
            </button>
          </div>
          <div className="p-4 bg-white">
            <p className="mb-2">{popup.content.content}</p>
            <input 
              type={popup.content.inputType} 
              className="w-full border border-gray-300 p-2 mb-2"
              placeholder="Enter information here..."
            />
            <button 
              onClick={() => closePopup(popup.id)}
              className="w-full bg-green-500 text-white py-2 px-4 hover:bg-green-600 font-bold mb-2"
            >
              {popup.content.buttonText}
            </button>
            <button 
              onClick={() => closePopup(popup.id)}
              className="w-full bg-purple-600 text-white py-2 px-4 hover:bg-purple-700 font-bold"
            >
              Enter now for the Mayer Scharlat special
            </button>
            <p className="text-xs text-center mt-2 text-gray-500 italic">Press Enter to close</p>
          </div>
        </div>
      ))}

      {/* Visitor Counter */}
      <div className="fixed top-20 left-4 bg-black text-green-500 p-2 border-2 border-green-500 font-mono neon-border z-40">
        <div className="text-xs">MAYER&apos;S VISITORS:</div>
        <div className="text-xl font-bold">{42069 + counter}</div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-4xl mx-auto space-y-8 z-30 mt-24">
        <header className="text-center bg-white bg-opacity-70 p-4 rounded-lg neon-border">
          <h1 className="text-4xl font-bold text-fuchsia-600 mb-2 neon-text">मायर शार्लट का फल ऑफ द डे!!!</h1>
          <p className="text-red-600 font-bold">MAYER SCHARLAT 100% REAL! NO FAKE! DRAG फल TO THE टोकरी!!!</p>
          <div className="mt-2 bg-yellow-300 p-2 text-red-700 font-bold animate-pulse">
            MAYER SCHARLAT LIMITED TIME OFFER! GET 50% OFF!!! TODAY ONLY!!!
          </div>
        </header>

        {/* Download buttons with Mayer references */}
        <div className="flex justify-center gap-2 flex-wrap">
          <button className="bg-green-500 text-white py-2 px-4 rounded-lg font-bold hover:bg-green-600 blink">
            MAYER SAYS DOWNLOAD NOW!
          </button>
          <button className="bg-red-500 text-white py-2 px-4 rounded-lg font-bold hover:bg-red-600 animate-pulse">
            CLAIM MAYER&apos;S PRIZE!
          </button>
          <button className="bg-blue-500 text-white py-2 px-4 rounded-lg font-bold hover:bg-blue-600">
            VERIFY FOR MAYER SCHARLAT
          </button>
        </div>

        <DropZone 
          onDrop={handleDrop} 
          onDragOverChange={handleDragOverChange}
          className="relative z-30"
        >
          <Basket 
            fruits={basketFruits} 
            count={basketFruits.length} 
            onReset={resetBasket}
          />
        </DropZone>

        <div className="mt-auto">
          <h2 className="text-xl font-semibold text-white mb-2 bg-fuchsia-700 p-2 neon-text text-center">
            MAYER SCHARLAT कहते हैं: फल चुनें - SELECT FRUIT NOW!!!
          </h2>
          <FruitCarousel onDragEnd={handleDragEnd} />
        </div>

        {/* "Breaking News" ticker with Mayer Scharlat */}
        <div className="bg-red-600 text-white p-2 overflow-hidden">
          <div className="marquee" style={{ animationDuration: '15s' }}>
            🔴 BREAKING NEWS: MAYER SCHARLAT SAYS फल खाने से आप स्वस्थ रहेंगे! 🔴 MAYER SCHARLAT: अभी अपनी टोकरी भरें! 🔴 MAYER&apos;S DISCOUNT: फलों की कीमतें घट रही हैं - जल्दी खरीदें! 🔴 BREAKING NEWS: MAYER SCHARLAT IS WATCHING YOU! 🔴 
          </div>
        </div>
      </div>
      
      {/* Fake cursor - only show on client side */}
      {isMounted && (
        <div 
          className="fixed pointer-events-none z-50"
          style={{
            top: cursorPosition.top,
            left: cursorPosition.left,
            width: '20px',
            height: '20px',
            background: 'url("/images/cursor.png")',
            backgroundSize: 'contain',
            animation: 'bounce 3s infinite',
            transform: 'translate(-50%, -50%)'
          }}
        />
      )}
      
      {/* Mayer Scharlat watermark */}
      <div className="fixed bottom-0 right-0 text-white opacity-30 p-2 text-sm rotate-45 pointer-events-none z-40">
        MAYER SCHARLAT ENTERPRISES ©2024
      </div>

      {/* Side Panels with Ultra Neon Text - Left */}
      {isMounted && (
        <div className="side-panel left-0 rainbow-border">
          {sideFlashTexts.map((text, index) => (
            <div 
              key={`side-flash-left-${index}`} 
              className="hot-deal-sign ultra-neon-text my-2"
              style={{
                animationDelay: `${index * 0.1}s`,
                transform: `rotate(${index % 2 === 0 ? '-5deg' : '5deg'})`,
              }}
            >
              {text}
            </div>
          ))}
          
          {/* Vertical Hindi Text */}
          <div className="vertical-text ultra-neon-text my-4">
            MAYER SCHARLAT EMERGENCY!!! 
          </div>
          
          {/* Flashing Text Boxes */}
          {flashingBoxesLeft.map((box, index) => (
            <div
              key={`flash-box-left-${index}`}
              className={`${box.color} p-2 my-1 shake-element ultra-neon-text`}
              style={{
                position: 'absolute',
                top: box.top,
                left: '10px',
                transform: `rotate(${-5 + Math.random() * 10}deg)`,
                zIndex: 25,
                maxWidth: '130px',
                fontSize: '10px',
                textAlign: 'center',
                border: '2px dashed yellow'
              }}
            >
              {box.content}
            </div>
          ))}
        </div>
      )}

      {/* Side Panels with Ultra Neon Text - Right */}
      {isMounted && (
        <div className="side-panel right-0 rainbow-border">
          {sideFlashTexts.map((text, index) => (
            <div 
              key={`side-flash-right-${index}`} 
              className="hot-deal-sign ultra-neon-text my-2"
              style={{
                animationDelay: `${index * 0.15 + 0.05}s`,
                transform: `rotate(${index % 2 === 0 ? '5deg' : '-5deg'})`,
              }}
            >
              {text}
            </div>
          ))}
          
          {/* Vertical Hindi Text */}
          <div className="vertical-text ultra-neon-text my-4">
            TIMESHARE SOCIAL SECURITY!!!
          </div>
          
          {/* Flashing Text Boxes */}
          {flashingBoxesRight.map((box, index) => (
            <div
              key={`flash-box-right-${index}`}
              className={`${box.color} p-2 my-1 shake-element ultra-neon-text`}
              style={{
                position: 'absolute',
                top: box.top,
                right: '10px',
                transform: `rotate(${-5 + Math.random() * 10}deg)`,
                zIndex: 25,
                maxWidth: '130px',
                fontSize: '10px',
                textAlign: 'center',
                border: '2px dashed lime'
              }}
            >
              {box.content}
            </div>
          ))}
        </div>
      )}

      {/* Additional Vertical Flashing Marquees */}
      {isMounted && (
        <div className="fixed inset-0 pointer-events-none z-5">
          {verticalMarquees.map((marquee, index) => (
            <div 
              key={`vertical-marquee-${index}`} 
              className={`fixed h-full py-1 ${marquee.bgColor} ${marquee.textColor} font-bold overflow-hidden`}
              style={{ 
                top: '0', 
                left: marquee.left, 
                width: marquee.width, 
                opacity: marquee.opacity,
                zIndex: marquee.zIndex
              }}
            >
              <div 
                className="vertical-text ultra-neon-text" 
                style={{ 
                  animationDuration: `${marquee.speed}s`,
                  animationDirection: marquee.direction,
                  fontSize: marquee.fontSize
                }}
              >
                {marquee.text} 🔥 {marquee.text} 💰 {marquee.text} 🔥
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rainbow Flashing Border Around Main Content */}
      {isMounted && (
        <div 
          className="fixed rainbow-border z-25" 
          style={{
            top: '120px',
            left: '180px',
            right: '180px',
            bottom: '50px',
            borderRadius: '20px',
            pointerEvents: 'none'
          }}
        />
      )}
    </main>
  );
}
