
import React, { useState, useCallback, useRef } from 'react';
import { ACTIVITIES, PRESET_TIMES, CHARACTERS } from './constants';
import { Activity, Character, TimerStatus } from './types';
import VisualTimer from './components/VisualTimer';
import { speakMessage, playFinishSound } from './services/geminiService';

const App: React.FC = () => {
  const [status, setStatus] = useState<TimerStatus>(TimerStatus.IDLE);
  const [selectedActivity, setSelectedActivity] = useState<Activity>(ACTIVITIES[0]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character>(CHARACTERS[0]);
  const [duration, setDuration] = useState(300); // Default 5 mins (em segundos)
  const [showConfig, setShowConfig] = useState(true);

  // Unlock logic for parents (to prevent accidental stops)
  const [holdProgress, setHoldProgress] = useState(0);
  const holdIntervalRef = useRef<number | null>(null);

  const startTimer = () => {
    setStatus(TimerStatus.RUNNING);
    setShowConfig(false);
  };

  const onTimerFinish = useCallback(async () => {
    setStatus(TimerStatus.FINISHED);
    // Toca o som de alerta potente
    await playFinishSound();
    // Pequeno atraso para o som não sobrepor o início da fala fluida
    setTimeout(() => {
      speakMessage(selectedActivity.endMessage);
    }, 1500);
  }, [selectedActivity]);

  const reset = () => {
    setStatus(TimerStatus.IDLE);
    setShowConfig(true);
    setHoldProgress(0);
  };

  const handleHoldStart = () => {
    holdIntervalRef.current = window.setInterval(() => {
      setHoldProgress(prev => {
        if (prev >= 100) {
          if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
          reset();
          return 0;
        }
        return prev + 2;
      });
    }, 20);
  };

  const handleHoldEnd = () => {
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    setHoldProgress(0);
  };

  const adjustMinutes = (delta: number) => {
    setDuration(prev => {
      const newMinutes = (prev / 60) + delta;
      if (newMinutes < 1) return 60; // Mínimo 1 minuto
      if (newMinutes > 120) return 7200; // Máximo 2 horas
      return newMinutes * 60;
    });
  };

  return (
    <div className={`fixed inset-0 transition-colors duration-700 ${showConfig ? 'bg-yellow-50' : selectedActivity.color} flex flex-col items-center overflow-y-auto overflow-x-hidden`}>
      
      {/* --- CONFIGURATION SCREEN --- */}
      {showConfig && (
        <div className="w-full max-w-md px-4 py-6 sm:py-10 animate-in fade-in duration-500">
          <h1 className="text-3xl sm:text-4xl font-kids text-orange-500 text-center mb-6 drop-shadow-sm">
            Cronômetro Mágico ✨
          </h1>

          <div className="bg-white rounded-[2.5rem] p-5 sm:p-8 shadow-xl border-4 border-orange-200">
            <h2 className="text-lg sm:text-xl font-bold text-gray-700 mb-4">1. O que vamos fazer?</h2>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {ACTIVITIES.map((act) => (
                <button
                  key={act.id}
                  onClick={() => setSelectedActivity(act)}
                  className={`p-3 rounded-2xl flex flex-col items-center gap-1 border-4 transition-all ${
                    selectedActivity.id === act.id 
                    ? `${act.color} border-white scale-105 shadow-lg text-white` 
                    : 'bg-gray-100 border-transparent text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  <span className="text-2xl sm:text-3xl">{act.icon}</span>
                  <span className="font-bold text-[10px] sm:text-xs leading-tight">{act.label}</span>
                </button>
              ))}
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-gray-700 mb-4">2. Quem vai marcar o tempo?</h2>
            <div className="flex gap-3 overflow-x-auto pb-4 -mx-1 px-1 scrollbar-hide no-scrollbar touch-pan-x">
              {CHARACTERS.map((char) => (
                <button
                  key={char.id}
                  onClick={() => setSelectedCharacter(char)}
                  className={`min-w-[60px] h-[60px] sm:min-w-[70px] sm:h-[70px] rounded-2xl flex items-center justify-center text-2xl sm:text-3xl border-4 transition-all flex-shrink-0 ${
                    selectedCharacter.id === char.id 
                    ? 'bg-yellow-400 border-white scale-110 shadow-md' 
                    : 'bg-gray-50 border-gray-100 text-gray-400'
                  }`}
                >
                  {char.icon}
                </button>
              ))}
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-gray-700 mt-6 mb-4">3. Quanto tempo?</h2>
            <div className="flex items-center justify-between bg-orange-50 rounded-2xl p-4 mb-4 border-2 border-orange-100">
              <button 
                onClick={() => adjustMinutes(-1)}
                className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white rounded-full shadow-md text-orange-500 text-2xl sm:text-3xl font-bold active:scale-90 transition-transform"
              >
                −
              </button>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-kids text-orange-600">
                  {duration / 60}
                </div>
                <div className="text-[10px] sm:text-xs font-bold text-orange-400 uppercase">minutos</div>
              </div>
              <button 
                onClick={() => adjustMinutes(1)}
                className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white rounded-full shadow-md text-orange-500 text-2xl sm:text-3xl font-bold active:scale-90 transition-transform"
              >
                +
              </button>
            </div>

            <button
              onClick={startTimer}
              className="w-full bg-green-500 text-white py-4 sm:py-5 mt-4 rounded-2xl text-xl sm:text-2xl font-kids shadow-lg active:scale-95 transition-transform border-b-8 border-green-700"
            >
              COMEÇAR! 🚀
            </button>
          </div>
          
          <div className="mt-6 bg-white/50 p-4 rounded-2xl border-2 border-dashed border-orange-200 mb-8">
            <p className="text-center text-orange-800 text-xs sm:text-sm font-medium">
              💡 Para fechar o cronômetro, segure o botão de parar por alguns segundos.
            </p>
          </div>
        </div>
      )}

      {/* --- ACTIVE TIMER SCREEN --- */}
      {status === TimerStatus.RUNNING && (
        <div className="fixed inset-0 flex flex-col animate-in zoom-in duration-500 overflow-hidden z-50">
          <VisualTimer 
            duration={duration} 
            onFinish={onTimerFinish} 
            color={selectedActivity.color} 
            characterIcon={selectedCharacter.icon}
          />
          
          <div className="absolute bottom-6 sm:bottom-10 left-0 right-0 flex justify-center px-6 sm:px-8">
            <button
              onMouseDown={handleHoldStart}
              onMouseUp={handleHoldEnd}
              onTouchStart={handleHoldStart}
              onTouchEnd={handleHoldEnd}
              className="relative w-full max-w-xs h-16 sm:h-20 bg-white/20 rounded-full border-4 border-white/50 overflow-hidden backdrop-blur-sm active:scale-95 transition-transform"
            >
              <div 
                className="absolute inset-0 bg-red-500/50 transition-all duration-75"
                style={{ width: `${holdProgress}%` }}
              />
              <span className="relative text-white font-bold text-sm sm:text-lg uppercase tracking-widest drop-shadow-md">
                Segure para Parar
              </span>
            </button>
          </div>
        </div>
      )}

      {/* --- FINISHED SCREEN --- */}
      {status === TimerStatus.FINISHED && (
        <div className="fixed inset-0 bg-white flex flex-col items-center justify-center p-6 text-center animate-in zoom-in duration-700 z-[60]">
          <div className="text-7xl sm:text-9xl md:text-[12rem] mb-6 sm:mb-8 animate-bounce">
             {selectedActivity.icon}
          </div>
          <h2 className="text-3xl sm:text-5xl font-kids text-orange-500 mb-4 sm:mb-6 leading-tight px-4">
            Acabou o Tempo!
          </h2>
          <p className="text-lg sm:text-2xl text-gray-600 mb-8 sm:mb-12 max-w-sm px-6">
            {selectedActivity.endMessage}
          </p>
          <button
            onClick={reset}
            className="bg-orange-500 text-white px-8 sm:px-12 py-4 sm:py-6 rounded-full text-xl sm:text-3xl font-kids shadow-2xl active:scale-90 transition-transform"
          >
            VOLTAR AO INÍCIO 🏡
          </button>
          
          <div className="absolute inset-0 pointer-events-none opacity-20 flex flex-wrap justify-around items-center overflow-hidden">
             {Array.from({length: 15}).map((_, i) => (
               <span key={i} className={`text-3xl sm:text-4xl animate-bounce`} style={{animationDelay: `${i * 0.2}s`}}>⭐</span>
             ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
