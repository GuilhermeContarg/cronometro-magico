
import { Activity, Character } from './types';

export const ACTIVITIES: Activity[] = [
  { 
    id: 'tv', 
    label: 'TV / Desenho', 
    icon: '📺', 
    color: 'bg-blue-400',
    endMessage: 'A TV vai descansar agora. Vamos brincar de outra coisa?'
  },
  { 
    id: 'play', 
    label: 'Brincar', 
    icon: '🧸', 
    color: 'bg-green-400',
    endMessage: 'Hora de guardar os brinquedos! O amiguinho quer dormir.'
  },
  { 
    id: 'tablet', 
    label: 'Celular / Tablet', 
    icon: '📱', 
    color: 'bg-purple-400',
    endMessage: 'O tablet está com sono. Tchau tchau tablet!'
  },
  { 
    id: 'eat', 
    label: 'Comer', 
    icon: '🥣', 
    color: 'bg-orange-400',
    endMessage: 'Hummm! Barriguinha cheia, hora de limpar as mãos.'
  },
  { 
    id: 'sleep', 
    label: 'Soneca', 
    icon: '🌙', 
    color: 'bg-indigo-400',
    endMessage: 'Bom dia! Hora de acordar com um sorriso.'
  },
];

export const CHARACTERS: Character[] = [
  { id: 'dino', icon: '🦖', label: 'Dino' },
  { id: 'car', icon: '🚗', label: 'Carrinho' },
  { id: 'doll', icon: '🪆', label: 'Boneca' },
  { id: 'mouse', icon: '🐭', label: 'Ratinho' },
  { id: 'rabbit', icon: '🐰', label: 'Coelhinho' },
  { id: 'rocket', icon: '🚀', label: 'Foguete' },
  { id: 'unicorn', icon: '🦄', label: 'Unicórnio' },
];

export const PRESET_TIMES = [
  { label: '2 min', value: 120 },
  { label: '5 min', value: 300 },
  { label: '10 min', value: 600 },
  { label: '15 min', value: 900 },
  { label: '20 min', value: 1200 },
  { label: '30 min', value: 1800 },
];
