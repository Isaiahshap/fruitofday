'use client';

import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

interface DropZoneProps {
  onDrop: () => void;
  onDragOverChange?: (isOver: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

export default function DropZone({ onDrop, onDragOverChange, children, className = '' }: DropZoneProps) {
  const [isOver, setIsOver] = useState(false);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const [showMayerAlert, setShowMayerAlert] = useState(false);
  const [mayerPosition, setMayerPosition] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (onDragOverChange) {
      onDragOverChange(isOver);
    }
  }, [isOver, onDragOverChange]);

  useEffect(() => {
    if (!isClient) return;

    const mayerInterval = setInterval(() => {
      const shouldShow = Math.random() > 0.9;
      if (shouldShow) {
        setMayerPosition({
          x: Math.random() * 80,
          y: Math.random() * 80,
        });
        setShowMayerAlert(true);
        
        setTimeout(() => {
          setShowMayerAlert(false);
        }, 3000);
      }
    }, 30000);
    
    return () => clearInterval(mayerInterval);
  }, [isClient]);

  useEffect(() => {
    if (!isClient) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        setShowMayerAlert(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isClient]);

  return (
    <motion.div
      ref={dropZoneRef}
      className={`relative rounded-lg transition-colors ${
        isOver ? 'bg-gradient-to-r from-purple-300 to-pink-300 shadow-lg' : 'bg-transparent'
      } ${className}`}
      onDragEnter={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsOver(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsOver(false);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'move';
        if (!isOver) setIsOver(true);
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsOver(false);
        console.log('Drop event triggered');
        onDrop();
      }}
      animate={{
        scale: isOver ? 1.02 : 1,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {children}
      
      {isOver && (
        <div className="absolute inset-0 border-4 border-dashed border-amber-400 rounded-lg pointer-events-none">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center bg-white bg-opacity-80 p-4 rounded-lg shadow-lg">
              <p className="text-lg font-bold text-red-600 neon-text">MAYER SCHARLAT SAYS:</p>
              <p className="text-green-600">DROP HERE FOR SPECIAL BONUS!</p>
            </div>
          </div>
        </div>
      )}
      
      {isClient && showMayerAlert && (
        <div 
          className="absolute z-30 bg-yellow-300 border-2 border-red-600 p-3 rounded-lg shadow-lg neon-border"
          style={{ top: `${mayerPosition.y}%`, left: `${mayerPosition.x}%` }}
        >
          <div className="flex justify-between mb-1">
            <p className="text-sm font-bold text-red-600">MAYER SCHARLAT ALERT!</p>
            <button 
              onClick={() => setShowMayerAlert(false)}
              className="text-xs text-red-600 hover:text-red-800"
            >
              ✕
            </button>
          </div>
          <p className="text-xs">Mayer Scharlat has verified your fruit selection!</p>
          <button 
            onClick={() => setShowMayerAlert(false)}
            className="w-full bg-purple-600 text-white text-xs py-1 px-2 mt-1 rounded hover:bg-purple-700 font-bold"
          >
            Enter now for the Mayer Scharlat special
          </button>
          <p className="text-xs italic mt-1">Press Enter to dismiss</p>
        </div>
      )}
    </motion.div>
  );
} 