
import React, { useEffect, useState, useRef } from 'react';

interface VisualTimerProps {
  duration: number; // in seconds
  onFinish: () => void;
  color: string;
  characterIcon: string;
}

const VisualTimer: React.FC<VisualTimerProps> = ({ duration, onFinish, color, characterIcon }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const startTimeRef = useRef(Date.now());
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const newTime = Math.max(0, duration - elapsed);
      setTimeLeft(newTime);

      if (newTime <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        onFinish();
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [duration, onFinish]);

  const percentage = (timeLeft / duration) * 100;
  
  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4 sm:p-8">
      {/* Visual Progress Bar (The Path) - Responsivo: h-16 em mobile, h-24 em desktop */}
      <div className="relative w-full h-16 sm:h-24 bg-white/30 rounded-full border-4 border-white overflow-hidden mb-8 sm:mb-12 shadow-inner">
        {/* Fill */}
        <div 
          className={`h-full transition-all duration-1000 ease-linear ${color}`}
          style={{ width: `${percentage}%` }}
        />
        
        {/* The Traveling Character - Responsivo: text-5xl em mobile, text-7xl em desktop */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 text-5xl sm:text-7xl transition-all duration-1000 ease-linear filter drop-shadow-lg"
          style={{ left: `calc(${percentage}% - 30px)` }}
        >
          {percentage > 5 ? characterIcon : '✨'}
        </div>
      </div>

      {/* Large Visual Circle - Responsivo: w-52 h-52 em mobile, w-64 h-64 em desktop */}
      <div className="relative w-52 h-52 sm:w-64 sm:h-64 rounded-full border-8 border-white flex items-center justify-center bg-white/20 shadow-2xl">
        <div 
           className="absolute inset-0 rounded-full border-[12px] sm:border-[16px] border-white/10"
        />
        <div 
          className={`absolute inset-0 rounded-full border-[12px] sm:border-[16px] transition-all duration-1000 ease-linear ${color.replace('bg-', 'border-')}`}
          style={{ 
            clipPath: `inset(${(100 - percentage)}% 0 0 0)`
          }}
        />
        <span className="text-6xl sm:text-8xl font-kids text-white drop-shadow-lg">
          {timeLeft > 60 ? Math.ceil(timeLeft / 60) : timeLeft}
          <span className="text-xl sm:text-2xl block text-center mt-[-5px] sm:mt-[-10px]">
            {timeLeft > 60 ? 'min' : 'seg'}
          </span>
        </span>
      </div>

      <div className="mt-8 sm:mt-12 text-center text-white font-bold text-lg sm:text-2xl uppercase tracking-widest drop-shadow-md animate-pulse px-4">
        {timeLeft > 10 ? 'Aproveite! 🎉' : 'Quase lá! ⏳'}
      </div>
    </div>
  );
};

export default VisualTimer;
