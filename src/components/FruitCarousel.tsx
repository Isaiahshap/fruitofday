'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Fruit } from '@/types';
import { fruits } from '@/data/fruits';
import Image from 'next/image';

interface FruitCarouselProps {
  onDragEnd: (fruit: Fruit) => void;
}

// Hindi fruit names
const hindiFruitNames: Record<string, string> = {
  'Apple': 'सेब',
  'Banana': 'केला',
  'Orange': 'संतरा',
  'Strawberry': 'स्ट्रॉबेरी',
  'Pineapple': 'अनानास',
  'Watermelon': 'तरबूज',
  'Grapes': 'अंगूर',
  'Kiwi': 'कीवी',
  'Mango': 'आम',
  'Peach': 'आड़ू',
  'Pear': 'नाशपाती',
  'Cherry': 'चेरी',
};

// Random discount percentages
const discounts = ['10% OFF', '25% OFF', '50% OFF', '90% OFF', 'BUY 1 GET 1', 'ALMOST FREE'];

// Fixed prices to avoid hydration mismatches
const fruitPrices = {
  '1': 5, '2': 3, '3': 4, '4': 7, '5': 8, '6': 9,
  '7': 6, '8': 4, '9': 7, '10': 5, '11': 4, '12': 6
};

export default function FruitCarousel({ onDragEnd }: FruitCarouselProps) {
  const [isDragging, setIsDragging] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [activeSpam, setActiveSpam] = useState(-1);
  const [showFlash, setShowFlash] = useState(false);
  const [showSpinWheel, setShowSpinWheel] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  // Track client-side rendering
  const [isClient, setIsClient] = useState(false);
  const [randomRotations, setRandomRotations] = useState<Record<string, number>>({});
  const [randomDiscounts, setRandomDiscounts] = useState<Record<string, string>>({});
  // Touch event state
  const [touchDragging, setTouchDragging] = useState<Fruit | null>(null);
  const [touchStartPos, setTouchStartPos] = useState({ x: 0, y: 0 });
  const [touchCurrentPos, setTouchCurrentPos] = useState({ x: 0, y: 0 });
  // Add state for potential drag fruit
  const [potentialDragFruit, setPotentialDragFruit] = useState<Fruit | null>(null);

  // Set client-side flag after initial render
  useEffect(() => {
    setIsClient(true);
    
    // Generate random rotations and prices for each fruit once on client
    const rotations: Record<string, number> = {};
    const discountSelections: Record<string, string> = {};
    
    fruits.forEach(fruit => {
      rotations[fruit.id] = Math.random() * 20 - 10;
      discountSelections[fruit.id] = discounts[Math.floor(Math.random() * discounts.length)];
    });
    
    setRandomRotations(rotations);
    setRandomDiscounts(discountSelections);
  }, []);

  // Handle manual scrolling
  const handleMouseDown = (e: React.MouseEvent) => {
    if (carouselRef.current) {
      setIsScrolling(true);
      setStartX(e.pageX - carouselRef.current.offsetLeft);
      setScrollLeft(carouselRef.current.scrollLeft);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isScrolling) return;
    e.preventDefault();
    if (carouselRef.current) {
      const x = e.pageX - carouselRef.current.offsetLeft;
      const walk = (x - startX) * 2;
      carouselRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUp = () => {
    setIsScrolling(false);
  };

  // Auto-scrolling effect with faster speed
  useEffect(() => {
    // Skip effects during SSR
    if (!isClient) return;
    
    const carousel = carouselRef.current;
    if (!carousel) return;

    const autoScroll = () => {
      if (carousel && !isScrolling && !isDragging) {
        carousel.scrollLeft += 3; // Faster scrolling
        if (carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth) {
          carousel.scrollLeft = 0;
        }
      }
    };

    const interval = setInterval(autoScroll, 20); // More frequent updates
    
    // Random flash of full-screen ad
    const flashInterval = setInterval(() => {
      if (Math.random() > 0.9) { // 10% chance to show flash ad
        setShowFlash(true);
        setTimeout(() => setShowFlash(false), 800);
      }
    }, 10000);
    
    // Change active spam banner
    const spamInterval = setInterval(() => {
      setActiveSpam(Math.floor(Math.random() * fruits.length));
    }, 1500);
    
    // Show spin the wheel popup occasionally
    const spinWheelInterval = setInterval(() => {
      if (Math.random() > 0.85 && !showSpinWheel) { // 15% chance
        setShowSpinWheel(true);
      }
    }, 30000); // Check every 30 seconds
    
    return () => {
      clearInterval(interval);
      clearInterval(flashInterval);
      clearInterval(spamInterval);
      clearInterval(spinWheelInterval);
    };
  }, [isScrolling, isDragging, showSpinWheel, isClient]);

  // Add the spin wheel effect
  const handleSpinWheel = () => {
    // Generate random rotation between 1080 and 2160 degrees (3-6 full rotations)
    const rotation = 1080 + Math.random() * 1080;
    setWheelRotation(rotation);
    
    // Hide after animation completes
    setTimeout(() => {
      setShowSpinWheel(false);
      setWheelRotation(0);
    }, 3000);
  };

  // Handle touch events for mobile drag and drop
  const handleTouchStart = (e: React.TouchEvent, fruit: Fruit) => {
    const touch = e.touches[0];
    setTouchStartPos({ x: touch.clientX, y: touch.clientY });
    setTouchCurrentPos({ x: touch.clientX, y: touch.clientY });
    setPotentialDragFruit(fruit);
    
    // Don't start dragging immediately - wait to see if it's a scroll or drag
    // We'll determine this in the touch move handler
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const currentX = touch.clientX;
    const currentY = touch.clientY;
    
    // If we're not already dragging a fruit, check if this should start a drag
    if (!touchDragging && potentialDragFruit) {
      // Calculate distance moved
      const deltaX = Math.abs(currentX - touchStartPos.x);
      const deltaY = Math.abs(currentY - touchStartPos.y);
      
      // If moved more vertically than horizontally by at least 10px, 
      // consider it a drag rather than a scroll
      if (deltaY > deltaX && deltaY > 10) {
        setTouchDragging(potentialDragFruit);
        setIsDragging(true);
        e.preventDefault(); // Prevent scrolling while dragging
      }
    } else if (touchDragging) {
      // Already dragging, update position
      e.preventDefault(); // Prevent scrolling while dragging
      setTouchCurrentPos({ x: currentX, y: currentY });
    }
  };

  const handleTouchEnd = () => {
    if (touchDragging) {
      setIsDragging(false);
      // Notify parent component about the drag end
      onDragEnd(touchDragging);
      setTouchDragging(null);
    }
    setPotentialDragFruit(null);
  };

  return (
    <div className="relative">
      {/* Moving background patterns */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -inset-4 bg-gradient-to-r from-yellow-300 via-orange-500 to-yellow-300 opacity-50"
             style={{ animation: 'marquee 20s linear infinite' }}></div>
      </div>
      
      {/* Flash ad - only show on client */}
      {isClient && showFlash && (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
          <div className="text-center p-8 bg-yellow-300 rounded-lg shadow-lg border-4 border-red-600">
            <p className="text-3xl font-bold text-red-600 mb-2">⚡ FLASH SALE! ⚡</p>
            <p className="text-xl font-bold mb-4">LIMITED TIME OFFER!</p>
            <button className="bg-red-600 text-white font-bold py-3 px-6 rounded-lg text-xl animate-pulse">
              CLAIM NOW!
            </button>
          </div>
        </div>
      )}
    
      <div 
        className="w-full overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-lg shadow-inner relative"
      >
        {/* Scrolling warning banner */}
        <div className="absolute top-0 left-0 right-0 bg-red-600 text-white text-xs py-1 px-2 text-center font-bold">
          <div className="marquee" style={{ animationDuration: '10s' }}>
            ⚠️ WARNING: फल खरीदने से पहले अपने डॉक्टर से परामर्श करें! ⚠️ LOW STOCK! ⚠️ BUY NOW OR MISS OUT! ⚠️
          </div>
        </div>
      
        <div 
          ref={carouselRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide py-8 pt-10"
          style={{ scrollBehavior: 'smooth' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Duplicate fruits multiple times for infinite scroll effect */}
          {[...fruits, ...fruits, ...fruits].map((fruit, index) => (
            <motion.div
              key={`${fruit.id}-${index}`}
              data-fruit-id={fruit.id}
              drag
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              dragElastic={1}
              className="flex-shrink-0 cursor-grab relative"
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileDrag={{ 
                scale: 1.3, 
                zIndex: 10, 
                rotate: isClient ? randomRotations[fruit.id] || 0 : 0 
              }}
              animate={{ 
                y: [0, -5, 0, 5, 0], 
                rotate: [0, 2, 0, -2, 0],
              }}
              transition={{ 
                y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 3, repeat: Infinity, ease: "easeInOut" },
              }}
              onDragStart={(e) => {
                setIsDragging(true);
                // Set data transfer to make HTML5 drag and drop work
                if ('dataTransfer' in e) {
                  const dt = (e as DragEvent).dataTransfer!;
                  dt.setData('text/plain', fruit.id);
                  dt.effectAllowed = 'move';
                }
              }}
              onDragEnd={() => {
                setIsDragging(false);
                console.log(`Dragged fruit: ${fruit.name}`);
                onDragEnd(fruit);
              }}
              draggable="true"
              onTouchStart={(e) => handleTouchStart(e, fruit)}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className="relative w-20 h-20 md:w-24 md:h-24 bg-white bg-opacity-80 p-2 rounded-lg shadow-md border-2 border-yellow-400">
                {/* Random sale badges - only shown client-side */}
                {isClient && activeSpam === index % fruits.length && (
                  <div className="absolute -top-4 -right-4 bg-red-600 text-white text-xs p-1 rounded-full font-bold rotate-12 shadow-lg z-10 transform-gpu animate-bounce">
                    {randomDiscounts[fruit.id] || '10% OFF'}
                  </div>
                )}
                
                <Image 
                  src={fruit.image} 
                  alt={fruit.name}
                  width={100}
                  height={100}
                  className="w-full h-full object-contain"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-yellow-300 to-yellow-500 p-1 text-center">
                  <p className="text-center text-xs font-bold text-red-700">
                    {hindiFruitNames[fruit.name] || fruit.name}
                  </p>
                </div>
                
                {/* Fixed price tag instead of random */}
                <div className="absolute -bottom-3 -right-3 bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold shadow-lg transform-gpu">
                  ${fruitPrices[fruit.id as keyof typeof fruitPrices]}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Bouncing arrow indicator */}
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 text-2xl text-white animate-bounce">
          ➜
        </div>
        <div className="absolute top-1/2 left-4 transform -translate-y-1/2 text-2xl text-white animate-bounce rotate-180">
          ➜
        </div>
        
        {/* Bottom banner */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-red-600 via-yellow-500 to-red-600 py-1 text-center">
          <p className="text-xs font-bold text-white animate-pulse">
            ⚡ अभी ड्रैग करें! जल्दी करें! सीमित स्टॉक! ⚡
          </p>
        </div>
      </div>
      
      {/* Animated badges */}
      <div className="absolute -top-4 left-4 bg-red-600 text-white text-xs p-2 rounded-full animate-pulse">
        HOT ITEMS!
      </div>
      <div className="absolute -top-4 right-4 bg-green-600 text-white text-xs p-2 rounded-full animate-pulse">
        NEW STOCK!
      </div>
      
      {/* Spin the Wheel Popup - only show on client */}
      {isClient && showSpinWheel && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 text-center relative">
            <button 
              onClick={() => setShowSpinWheel(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            
            <div className="text-2xl font-bold text-purple-600 mb-4">
              🎡 SPIN THE WHEEL! 🎡
            </div>
            
            <p className="mb-4">Congratulations! You&apos;ve been selected to spin Mayer Scharlat&apos;s Wheel of Fortune!</p>
            
            {/* Wheel of Fortune */}
            <div className="relative w-64 h-64 mx-auto my-4">
              <div 
                className="w-full h-full rounded-full border-8 border-yellow-400 overflow-hidden"
                style={{
                  transform: `rotate(${wheelRotation}deg)`,
                  transition: wheelRotation ? 'transform 3s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none',
                  backgroundImage: 'conic-gradient(red, orange, yellow, green, blue, indigo, violet, red)',
                }}
              />
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-5xl">
                ▼
              </div>
            </div>
            
            <p className="mb-4 text-green-600 font-bold">You could win an iPhone, cash prizes, or a NEW CAR!</p>
            
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter your email to claim prize"
                className="flex-1 border border-gray-300 p-2 rounded-l-lg"
              />
              <button 
                onClick={handleSpinWheel}
                className="bg-red-600 text-white font-bold py-2 px-4 rounded-r-lg hover:bg-red-700"
              >
                SPIN NOW!
              </button>
            </div>
            
            <p className="mt-4 text-xs text-gray-500">
              * By spinning, you agree to receive daily marketing emails from Mayer Scharlat and 
              partners. Your data may be sold to third parties. Standard text rates apply.
            </p>
          </div>
        </div>
      )}

      {/* Touch drag ghost element */}
      {touchDragging && (
        <div 
          className="fixed pointer-events-none z-50"
          style={{
            left: touchCurrentPos.x - 40,
            top: touchCurrentPos.y - 40,
            width: 80,
            height: 80,
            opacity: 0.8,
          }}
        >
          <Image 
            src={touchDragging.image} 
            alt={touchDragging.name}
            width={80}
            height={80}
            className="w-full h-full object-contain"
          />
        </div>
      )}
    </div>
  );
} 