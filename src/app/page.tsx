'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { 
  Github, Linkedin, Mail, MapPin, ExternalLink, Send,
  ChevronDown, ChevronLeft, ChevronRight, Settings, LogOut, Plus, Trash2, Save,
  Brain, Code, Database, Layers, Zap, X, MessageCircle,
  Award, GraduationCap, Briefcase, Lock, Minimize2, Maximize2,
  Volume2, VolumeX, Play, Pause, Trophy, Medal, Target, Sparkles,
  Cpu, Bot, MessageSquare, Download
} from 'lucide-react';
import { toast } from 'sonner';

// Types
interface Profile {
  id: string;
  name: string;
  title: string;
  subtitle: string | null;
  bio: string;
  avatarUrl: string | null;
  resumeUrl: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  twitterUrl: string | null;
  websiteUrl: string | null;
}

interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string | null;
  imageUrl: string | null;
  images: string | null;
  demoUrl: string | null;
  githubUrl: string | null;
  techStack: string;
  category: string | null;
  featured: boolean;
  order: number;
  status: string;
}

interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  iconUrl: string | null;
  color: string | null;
  order: number;
}

interface Experience {
  id: string;
  title: string;
  company: string;
  description: string;
  startDate: string;
  endDate: string | null;
  location: string | null;
  type: string;
  current: boolean;
  order: number;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string | null;
  gpa: string | null;
  startDate: string;
  endDate: string | null;
  description: string | null;
  achievements: string | null;
  order: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  issuer: string | null;
  imageUrl: string | null;
  link: string | null;
  order: number;
}

interface Settings {
  id: string;
  introEnabled: boolean;
  introDuration: number;
  introMessage: string | null;
  assistantName: string;
  assistantType: string;
  theme: string;
  primaryColor: string;
  siteTitle: string;
  siteDescription: string | null;
  showIntro: boolean;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Robot Image Component - using user's uploaded robot character
function RobotIcon({ 
  className = "w-12 h-12", 
  animated = false,
  glow = false 
}: { 
  className?: string; 
  animated?: boolean;
  glow?: boolean;
}) {
  return (
    <div className={`${className} ${animated ? 'animate-robot-bounce' : ''} relative`}>
      {/* Glow effect behind robot */}
      {glow && (
        <div className="absolute inset-0 bg-blue-500/40 rounded-full blur-xl animate-pulse-glow" />
      )}
      <img 
        src="/robot.png" 
        alt="Robo - Portfolio Assistant" 
        className="w-full h-full object-contain relative z-10"
      />
    </div>
  );
}

// AI Facts for Robo's random dialogues
const AI_FACTS = [
  "Did you know? The first AI program was written in 1951! 🤖",
  "GPT-4 has over 1 trillion parameters! That's a lot of brain power 🧠",
  "AI can now generate art, music, and even write code! 🎨",
  "The term 'Artificial Intelligence' was coined in 1956! 📚",
  "Robots like me learn from millions of examples! 📖",
  "AI helps doctors diagnose diseases faster! 🏥",
  "Self-driving cars use AI to navigate roads! 🚗",
  "AI can translate over 100 languages in real-time! 🌍",
  "The first chatbot was created in 1966, named ELIZA! 💬",
  "AI models are trained on billions of words! 📝",
  "Deep learning was inspired by the human brain! 🧬",
  "AI beat the world chess champion in 1997! ♟️",
  "Some AI can create realistic human faces! 👤",
  "AI helps predict weather more accurately! 🌤️",
  "The Singularity might happen by 2045... maybe! 🚀",
  "I process information faster than you can blink! ⚡",
  "AI is helping fight climate change! 🌱",
  "Neural networks have billions of connections! 🔗",
  "Ask me anything about this portfolio! 😊",
];

// Robo Dialogue Component - shows random AI facts
function RoboDialogue() {
  const [factIndex, setFactIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Change fact every 8 seconds
    const factInterval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setFactIndex(prev => (prev + 1) % AI_FACTS.length);
        setIsVisible(true);
      }, 500);
    }, 8000);

    return () => clearInterval(factInterval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 10 }}
      transition={{ duration: 0.5 }}
      className="absolute -top-20 right-0 w-64 bg-gradient-to-br from-blue-900/90 to-blue-950/90 backdrop-blur-sm rounded-xl p-3 border border-blue-500/30 shadow-lg shadow-blue-500/10"
    >
      {/* Speech bubble pointer */}
      <div className="absolute -bottom-2 right-8 w-4 h-4 bg-blue-900/90 rotate-45 border-r border-b border-blue-500/30" />
      
      {/* Robot mini icon */}
      <div className="flex items-start gap-2">
        <img 
          src="/robot.png" 
          alt="Robo" 
          className="w-8 h-8 object-contain shrink-0"
        />
        <p className="text-xs text-blue-100 leading-relaxed">
          {AI_FACTS[factIndex]}
        </p>
      </div>
    </motion.div>
  );
}

// Background Music Player Component - Synthesized Chiptune
function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [showControls, setShowControls] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Chiptune melody sequence (notes as frequencies)
  const melody = [
    { freq: 329.63, duration: 0.15 }, // E4
    { freq: 392.00, duration: 0.15 }, // G4
    { freq: 440.00, duration: 0.15 }, // A4
    { freq: 523.25, duration: 0.3 },  // C5
    { freq: 440.00, duration: 0.15 }, // A4
    { freq: 392.00, duration: 0.15 }, // G4
    { freq: 329.63, duration: 0.3 },  // E4
    { freq: 293.66, duration: 0.15 }, // D4
    { freq: 329.63, duration: 0.15 }, // E4
    { freq: 392.00, duration: 0.3 },  // G4
    { freq: 440.00, duration: 0.15 }, // A4
    { freq: 392.00, duration: 0.15 }, // G4
    { freq: 329.63, duration: 0.15 }, // E4
    { freq: 293.66, duration: 0.15 }, // D4
    { freq: 261.63, duration: 0.3 },  // C4
    { freq: 293.66, duration: 0.15 }, // D4
  ];

  const bassLine = [
    { freq: 130.81, duration: 0.3 }, // C3
    { freq: 164.81, duration: 0.3 }, // E3
    { freq: 196.00, duration: 0.3 }, // G3
    { freq: 164.81, duration: 0.3 }, // E3
  ];

  useEffect(() => {
    return () => {
      stopMusic();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = isMuted ? 0 : volume * 0.3;
    }
  }, [volume, isMuted]);

  const playNote = (frequency: number, startTime: number, duration: number, type: OscillatorType = 'square') => {
    if (!audioContextRef.current || !gainNodeRef.current) return;

    const osc = audioContextRef.current.createOscillator();
    const noteGain = audioContextRef.current.createGain();
    
    osc.type = type;
    osc.frequency.value = frequency;
    
    noteGain.gain.setValueAtTime(0.3, startTime);
    noteGain.gain.exponentialRampToValueAtTime(0.01, startTime + duration - 0.02);
    
    osc.connect(noteGain);
    noteGain.connect(gainNodeRef.current);
    
    osc.start(startTime);
    osc.stop(startTime + duration);
    
    oscillatorsRef.current.push(osc);
  };

  const startMusic = () => {
    // Initialize Audio Context
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
      gainNodeRef.current.gain.value = volume * 0.3;
    }

    // Resume context if suspended
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }

    let noteIndex = 0;
    let bassIndex = 0;
    let currentTime = audioContextRef.current.currentTime;

    const playLoop = () => {
      if (!audioContextRef.current || !gainNodeRef.current) return;
      
      const now = audioContextRef.current.currentTime;
      
      // Play melody
      const note = melody[noteIndex % melody.length];
      playNote(note.freq, now, note.duration, 'square');
      
      // Play bass every other note
      if (noteIndex % 2 === 0) {
        const bass = bassLine[bassIndex % bassLine.length];
        playNote(bass.freq, now, bass.duration * 2, 'sawtooth');
        bassIndex++;
      }
      
      noteIndex++;
    };

    // Play immediately
    playLoop();
    
    // Schedule next notes
    intervalRef.current = setInterval(() => {
      playLoop();
    }, 150); // Match the shortest note duration
  };

  const stopMusic = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    oscillatorsRef.current.forEach(osc => {
      try {
        osc.stop();
      } catch {
        // Already stopped
      }
    });
    oscillatorsRef.current = [];
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => setIsMuted(!isMuted);

  return (
    <div 
      className="fixed bottom-6 left-6 z-40"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5 }}
        className="flex items-center gap-2"
      >
        {/* Volume controls - show on hover */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: showControls ? 1 : 0, x: showControls ? 0 : -10 }}
          className="flex items-center gap-2 bg-card/90 backdrop-blur-sm rounded-lg px-3 py-2 border-4 border-blue-500/30"
          style={{ fontFamily: "'Press Start 2P', cursive" }}
        >
          <button
            onClick={toggleMute}
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-20 h-2 bg-blue-900/50 rounded appearance-none cursor-pointer"
          />
        </motion.div>

        {/* Play/Pause button */}
        <button
          onClick={togglePlay}
          className="flex items-center gap-2 pixel-btn bg-blue-600 hover:bg-blue-500 text-white"
          style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.6rem' }}
        >
          {isPlaying ? (
            <>
              <Pause className="w-3 h-3" />
              <span className="hidden sm:inline">PLAYING</span>
            </>
          ) : (
            <>
              <Play className="w-3 h-3" />
              <span className="hidden sm:inline">MUSIC</span>
            </>
          )}
          
          {/* Sound wave animation when playing */}
          {isPlaying && (
            <div className="flex items-center gap-0.5">
              <motion.div
                animate={{ height: [4, 8, 4] }}
                transition={{ duration: 0.3, repeat: Infinity }}
                className="w-1 bg-white"
              />
              <motion.div
                animate={{ height: [6, 12, 6] }}
                transition={{ duration: 0.3, repeat: Infinity, delay: 0.1 }}
                className="w-1 bg-white"
              />
              <motion.div
                animate={{ height: [4, 6, 4] }}
                transition={{ duration: 0.3, repeat: Infinity, delay: 0.2 }}
                className="w-1 bg-white"
              />
            </div>
          )}
        </button>
      </motion.div>
    </div>
  );
}

// Floating Robot Button - robot with glow and sparkles
function FloatingRobotButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Robo Dialogue - shows random AI facts */}
      <RoboDialogue />
      
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200 }}
        onClick={onClick}
        className="group cursor-pointer relative"
      >
        {/* Pulsing glow rings */}
        <div className="absolute inset-0 scale-[1.5]">
          <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-lg animate-pulse" />
          <div className="absolute inset-4 bg-blue-400/30 rounded-full blur-md animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>
        
        {/* Robot image - floating animation */}
        <motion.div
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
          animate={{ y: [0, -10, 0] }}
          transition={{ 
            y: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
            scale: { duration: 0.2 }
          }}
          className="relative z-10"
        >
          <img 
            src="/robot.png" 
            alt="Open Chat" 
            className="w-36 h-36 object-contain drop-shadow-[0_0_25px_rgba(59,130,246,0.5)] group-hover:drop-shadow-[0_0_40px_rgba(59,130,246,0.8)] transition-all duration-300"
          />
        </motion.div>
        
        {/* Sparkle effects */}
        <motion.div
          className="absolute -top-1 -right-1 w-1.5 h-1.5"
          animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
        >
          <div className="w-full h-full bg-blue-400 rounded-full" />
        </motion.div>
        <motion.div
          className="absolute top-3 -right-2 w-1 h-1"
          animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
        >
          <div className="w-full h-full bg-blue-300 rounded-full" />
        </motion.div>
        <motion.div
          className="absolute -top-2 right-2 w-1 h-1"
          animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
        >
          <div className="w-full h-full bg-cyan-300 rounded-full" />
        </motion.div>
        <motion.div
          className="absolute top-0 -left-2 w-1 h-1"
          animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.7 }}
        >
          <div className="w-full h-full bg-blue-200 rounded-full" />
        </motion.div>
      </motion.button>
    </div>
  );
}

// Intro Portal Component
function IntroPortal({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stages = [
      { delay: 500, progress: 15, text: 'Initializing portal...' },
      { delay: 1000, progress: 35, text: 'Loading dimensions...' },
      { delay: 1500, progress: 55, text: 'Preparing your experience...' },
      { delay: 1000, progress: 75, text: 'Almost there...' },
      { delay: 1000, progress: 100, text: 'Welcome!' },
    ];

    let currentDelay = 0;
    const timers: NodeJS.Timeout[] = [];
    
    stages.forEach((s, i) => {
      currentDelay += s.delay;
      const timer = setTimeout(() => {
        setStage(i);
        setProgress(s.progress);
        if (i === stages.length - 1) {
          setTimeout(onComplete, 800);
        }
      }, currentDelay);
      timers.push(timer);
    });

    return () => timers.forEach(t => clearTimeout(t));
  }, [onComplete]);

  const stageTexts = [
    'Initializing portal...',
    'Loading dimensions...',
    'Preparing your experience...',
    'Almost there...',
    'Welcome!'
  ];

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at center, oklch(0.1 0.03 250), oklch(0.05 0 0))' }}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full"
            initial={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), 
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
              opacity: 0 
            }}
            animate={{ 
              y: [null, Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800)],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      {/* Portal circles */}
      <div className="relative">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-blue-400/30"
            style={{
              width: 150 + i * 80,
              height: 150 + i * 80,
              left: `calc(50% - ${75 + i * 40}px)`,
              top: `calc(50% - ${75 + i * 40}px)`,
            }}
            animate={{ rotate: 360, scale: [1, 1.1, 1] }}
            transition={{ 
              rotate: { duration: 10 + i * 2, repeat: Infinity, ease: 'linear' },
              scale: { duration: 2, repeat: Infinity, delay: i * 0.2 }
            }}
          />
        ))}

        {/* Center glow */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full"
          style={{
            background: 'radial-gradient(circle, oklch(0.5 0.2 250), transparent)',
            filter: 'blur(20px)',
          }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Center icon - robot floating with glow */}
        <motion.div
          className="relative z-10 flex flex-col items-center"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          {/* Glow effect */}
          <div className="absolute inset-0 scale-[1.8]">
            <motion.div 
              className="absolute inset-0 bg-blue-500/30 rounded-full blur-2xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.7, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          
          {/* Robot image */}
          <img 
            src="/robot.png" 
            alt="Robo" 
            className="w-52 h-52 object-contain relative z-10 drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]"
          />
          
          {/* Sparkle particles around robot */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-blue-300 rounded-full"
              style={{
                top: `${35 + Math.sin(i * 60 * Math.PI / 180) * 50}%`,
                left: `${50 + Math.cos(i * 60 * Math.PI / 180) * 50}%`,
              }}
              animate={{ 
                scale: [0, 1, 0], 
                opacity: [0, 1, 0],
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                delay: i * 0.3 
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Loading text and progress */}
      <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 text-center">
        <motion.p
          key={stage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-blue-400 font-mono mb-4"
        >
          {stageTexts[stage]}
        </motion.p>
        <div className="w-64 h-1 bg-blue-900/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-400 to-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-blue-600 text-sm mt-2 font-mono">{progress}%</p>
      </div>

      {/* Skip button */}
      <button
        onClick={onComplete}
        className="absolute bottom-8 right-8 text-blue-600 hover:text-blue-400 transition-colors font-mono text-sm"
      >
        Skip Intro →
      </button>
    </motion.div>
  );
}

// Chatbot Component
function Chatbot({ 
  assistantName, 
  profile,
  settings 
}: { 
  assistantName: string; 
  profile: Profile | null;
  settings: Settings | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setShowWelcome(false);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: messages,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I had trouble processing that. Please try again!' }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Oops! Something went wrong. Please try again later.' }]);
    }

    setIsLoading(false);
  };

  const quickQuestions = [
    "Tell me about the projects",
    "What skills does he have?",
    "Tell me about his experience",
    "What achievements does he have?",
  ];

  return (
    <>
      {/* Floating robot button */}
      {!isOpen && <FloatingRobotButton onClick={() => setIsOpen(true)} />}

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className={`fixed z-50 ${isMinimized ? 'bottom-6 right-6 w-72' : 'bottom-6 right-6 w-96 max-w-[calc(100vw-2rem)]'} transition-all duration-300`}
          >
            <Card className="border-blue-500/30 glass overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-blue-500/20 bg-gradient-to-r from-blue-600 to-blue-700">
                <div className="flex items-center gap-3">
                  {/* Robot avatar with glow */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-400/30 rounded-full blur-lg scale-125" />
                    <img 
                      src="/robot.png" 
                      alt="Robo" 
                      className="w-14 h-14 object-contain relative z-10"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{assistantName}</h3>
                    <p className="text-xs text-blue-200">Portfolio Assistant</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
                  >
                    {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Chat content */}
              {!isMinimized && (
                <>
                  <ScrollArea className="h-80 p-4" ref={scrollRef}>
                    {/* Welcome message */}
                    {showWelcome && messages.length === 0 && (
                      <div className="text-center py-8">
                        <motion.div
                          animate={{ y: [0, -6, 0] }}
                          transition={{ duration: 2.5, repeat: Infinity }}
                          className="relative w-28 h-28 mx-auto mb-4"
                        >
                          {/* Glow */}
                          <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-xl scale-[1.5] animate-pulse" />
                          <img 
                            src="/robot.png" 
                            alt="Robo" 
                            className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                          />
                          
                          {/* Sparkles */}
                          <motion.div
                            className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-blue-300 rounded-full"
                            animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                          />
                          <motion.div
                            className="absolute -top-2 right-2 w-1 h-1 bg-cyan-300 rounded-full"
                            animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                          />
                        </motion.div>
                        <h4 className="font-bold mb-2">Hi, I&apos;m {assistantName}! 👋</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Ask me anything about {profile?.name?.split(' ')[0] || 'the portfolio'}!
                        </p>
                        <div className="grid grid-cols-1 gap-2">
                          {quickQuestions.map((q, i) => (
                            <Button
                              key={i}
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setInput(q);
                              }}
                              className="text-xs border-blue-500/30 hover:bg-blue-500/10 justify-start"
                            >
                              {q}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Messages */}
                    {messages.map((msg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-3 mb-4 ${msg.role === 'user' ? 'justify-end' : ''}`}
                      >
                        {msg.role === 'assistant' && (
                          <div className="relative shrink-0">
                            <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-md scale-110" />
                            <img 
                              src="/robot.png" 
                              alt="Robo" 
                              className="w-12 h-12 object-contain relative z-10"
                            />
                          </div>
                        )}
                        <div className={`rounded-2xl px-4 py-2 max-w-[80%] ${
                          msg.role === 'user' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-muted'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      </motion.div>
                    ))}

                    {/* Typing indicator */}
                    {isLoading && (
                      <div className="flex gap-3">
                        <div className="relative shrink-0">
                          <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-md scale-110 animate-pulse" />
                          <img 
                            src="/robot.png" 
                            alt="Robo" 
                            className="w-12 h-12 object-contain relative z-10"
                          />
                        </div>
                        <div className="rounded-2xl px-4 py-2 bg-muted">
                          <p className="text-sm text-muted-foreground typing-indicator">Thinking</p>
                        </div>
                      </div>
                    )}
                  </ScrollArea>

                  {/* Input */}
                  <div className="p-4 border-t border-blue-500/20">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        sendMessage();
                      }}
                      className="flex gap-2"
                    >
                      <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask me anything..."
                        className="border-blue-500/30 focus:border-blue-500"
                        disabled={isLoading}
                      />
                      <Button 
                        type="submit" 
                        size="icon"
                        disabled={!input.trim() || isLoading}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </form>
                  </div>
                </>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Admin Panel Component (simplified for brevity - same as before)
function AdminPanel({ 
  isOpen, 
  onClose, 
  profile, 
  projects, 
  skills, 
  experiences,
  educations,
  settings,
  onDataRefresh 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  profile: Profile | null;
  projects: Project[];
  skills: Skill[];
  experiences: Experience[];
  educations: Education[];
  achievements: Achievement[];
  settings: Settings | null;
  onDataRefresh: () => void;
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [activeTab, setActiveTab] = useState('profile');

  const [profileForm, setProfileForm] = useState({
    name: '', title: '', subtitle: '', bio: '', email: '', phone: '', location: '', githubUrl: '', linkedinUrl: '',
  });

  const [projectForm, setProjectForm] = useState({
    title: '', description: '', demoUrl: '', githubUrl: '', techStack: '', category: '', featured: false,
  });

  const [skillForm, setSkillForm] = useState({
    name: '', category: '', proficiency: 80,
  });

  const [settingsForm, setSettingsForm] = useState({
    introEnabled: true, introDuration: 6000, introMessage: '', assistantName: 'Robo', showIntro: true,
  });

  const profileData = useMemo(() => profile, [profile]);
  const settingsData = useMemo(() => settings, [settings]);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (profileData) {
      setProfileForm({
        name: profileData.name || '', title: profileData.title || '', subtitle: profileData.subtitle || '',
        bio: profileData.bio || '', email: profileData.email || '', phone: profileData.phone || '',
        location: profileData.location || '', githubUrl: profileData.githubUrl || '', linkedinUrl: profileData.linkedinUrl || '',
      });
    }
  }, [profileData]);

  useEffect(() => {
    if (settingsData) {
      setSettingsForm({
        introEnabled: settingsData.introEnabled, introDuration: settingsData.introDuration,
        introMessage: settingsData.introMessage || '', assistantName: settingsData.assistantName, showIntro: settingsData.showIntro,
      });
    }
  }, [settingsData]);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    fetch('/api/auth/me').then(res => res.json()).then(data => { if (data.authenticated) setIsLoggedIn(true); });
  }, []);

  const handleLogin = async () => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });
      const data = await res.json();
      if (data.success) { setIsLoggedIn(true); toast.success('Logged in!'); }
      else toast.error(data.error || 'Login failed');
    } catch { toast.error('Login failed'); }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setIsLoggedIn(false); onClose();
  };

  const handleSaveProfile = async () => {
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm),
      });
      if (res.ok) { toast.success('Profile saved!'); onDataRefresh(); }
    } catch { toast.error('Failed to save'); }
  };

  const handleAddProject = async () => {
    try {
      const res = await fetch('/api/projects', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...projectForm, techStack: projectForm.techStack.split(',').map(t => t.trim()) }),
      });
      if (res.ok) { toast.success('Project added!'); setProjectForm({ title: '', description: '', demoUrl: '', githubUrl: '', techStack: '', category: '', featured: false }); onDataRefresh(); }
    } catch { toast.error('Failed to add'); }
  };

  const handleDeleteProject = async (id: string) => {
    try { await fetch(`/api/projects?id=${id}`, { method: 'DELETE' }); toast.success('Deleted'); onDataRefresh(); }
    catch { toast.error('Failed to delete'); }
  };

  const handleAddSkill = async () => {
    try {
      const res = await fetch('/api/skills', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(skillForm),
      });
      if (res.ok) { toast.success('Skill added!'); setSkillForm({ name: '', category: '', proficiency: 80 }); onDataRefresh(); }
    } catch { toast.error('Failed to add'); }
  };

  const handleDeleteSkill = async (id: string) => {
    try { await fetch(`/api/skills?id=${id}`, { method: 'DELETE' }); toast.success('Deleted'); onDataRefresh(); }
    catch { toast.error('Failed to delete'); }
  };

  const handleSaveSettings = async () => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsForm),
      });
      if (res.ok) { toast.success('Settings saved!'); onDataRefresh(); }
    } catch { toast.error('Failed to save'); }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2"><Settings className="w-5 h-5 text-blue-400" /> Admin Panel</span>
            {isLoggedIn && <Button variant="ghost" size="sm" onClick={handleLogout}><LogOut className="w-4 h-4 mr-2" /> Logout</Button>}
          </DialogTitle>
        </DialogHeader>
        {!isLoggedIn ? (
          <div className="p-8 max-w-md mx-auto">
            <div className="text-center mb-6">
              <Lock className="w-12 h-12 mx-auto mb-4 text-blue-400" />
              <p className="text-muted-foreground">Enter admin credentials</p>
              <p className="text-xs text-muted-foreground mt-2">Default: admin / admin123</p>
            </div>
            <div className="space-y-4">
              <div><Label>Username</Label><Input value={loginForm.username} onChange={e => setLoginForm({ ...loginForm, username: e.target.value })} placeholder="admin" /></div>
              <div><Label>Password</Label><Input type="password" value={loginForm.password} onChange={e => setLoginForm({ ...loginForm, password: e.target.value })} placeholder="••••••••" /></div>
              <Button onClick={handleLogin} className="w-full bg-blue-600 hover:bg-blue-700">Login</Button>
            </div>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="grid grid-cols-6 mb-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <ScrollArea className="h-[60vh]">
              <TabsContent value="profile" className="space-y-4 p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Name</Label><Input value={profileForm.name} onChange={e => setProfileForm({ ...profileForm, name: e.target.value })} /></div>
                  <div><Label>Title</Label><Input value={profileForm.title} onChange={e => setProfileForm({ ...profileForm, title: e.target.value })} /></div>
                  <div><Label>Subtitle</Label><Input value={profileForm.subtitle} onChange={e => setProfileForm({ ...profileForm, subtitle: e.target.value })} /></div>
                  <div><Label>Email</Label><Input value={profileForm.email} onChange={e => setProfileForm({ ...profileForm, email: e.target.value })} /></div>
                  <div><Label>Phone</Label><Input value={profileForm.phone} onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })} /></div>
                  <div><Label>Location</Label><Input value={profileForm.location} onChange={e => setProfileForm({ ...profileForm, location: e.target.value })} /></div>
                  <div><Label>GitHub URL</Label><Input value={profileForm.githubUrl} onChange={e => setProfileForm({ ...profileForm, githubUrl: e.target.value })} /></div>
                  <div><Label>LinkedIn URL</Label><Input value={profileForm.linkedinUrl} onChange={e => setProfileForm({ ...profileForm, linkedinUrl: e.target.value })} /></div>
                </div>
                <div><Label>Bio</Label><Textarea value={profileForm.bio} onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })} rows={4} /></div>
                <Button onClick={handleSaveProfile} className="bg-blue-600 hover:bg-blue-700"><Save className="w-4 h-4 mr-2" /> Save Profile</Button>
              </TabsContent>
              <TabsContent value="projects" className="space-y-4 p-4">
                <Card className="p-4 border-border">
                  <h4 className="font-semibold mb-4">Add New Project</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Title</Label><Input value={projectForm.title} onChange={e => setProjectForm({ ...projectForm, title: e.target.value })} /></div>
                    <div><Label>Category</Label><Input value={projectForm.category} onChange={e => setProjectForm({ ...projectForm, category: e.target.value })} placeholder="web, mobile, ai..." /></div>
                    <div><Label>Demo URL</Label><Input value={projectForm.demoUrl} onChange={e => setProjectForm({ ...projectForm, demoUrl: e.target.value })} /></div>
                    <div><Label>GitHub URL</Label><Input value={projectForm.githubUrl} onChange={e => setProjectForm({ ...projectForm, githubUrl: e.target.value })} /></div>
                  </div>
                  <div className="mt-4"><Label>Description</Label><Textarea value={projectForm.description} onChange={e => setProjectForm({ ...projectForm, description: e.target.value })} /></div>
                  <div className="mt-4"><Label>Tech Stack (comma-separated)</Label><Input value={projectForm.techStack} onChange={e => setProjectForm({ ...projectForm, techStack: e.target.value })} placeholder="React, Node.js, PostgreSQL" /></div>
                  <div className="flex items-center gap-2 mt-4"><Switch checked={projectForm.featured} onCheckedChange={checked => setProjectForm({ ...projectForm, featured: checked })} /><Label>Featured</Label></div>
                  <Button onClick={handleAddProject} className="mt-4 bg-blue-600 hover:bg-blue-700"><Plus className="w-4 h-4 mr-2" /> Add Project</Button>
                </Card>
                <div className="space-y-2">
                  {projects.map(project => (
                    <Card key={project.id} className="p-4 flex justify-between items-center border-border">
                      <div><h4 className="font-semibold">{project.title}</h4><p className="text-sm text-muted-foreground">{project.description}</p></div>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteProject(project.id)}><Trash2 className="w-4 h-4 text-red-400" /></Button>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="skills" className="space-y-4 p-4">
                <Card className="p-4 border-border">
                  <h4 className="font-semibold mb-4">Add New Skill</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div><Label>Name</Label><Input value={skillForm.name} onChange={e => setSkillForm({ ...skillForm, name: e.target.value })} /></div>
                    <div><Label>Category</Label><Input value={skillForm.category} onChange={e => setSkillForm({ ...skillForm, category: e.target.value })} placeholder="Frontend, Backend, AI..." /></div>
                    <div><Label>Proficiency: {skillForm.proficiency}%</Label><Input type="range" min="0" max="100" value={skillForm.proficiency} onChange={e => setSkillForm({ ...skillForm, proficiency: parseInt(e.target.value) })} /></div>
                  </div>
                  <Button onClick={handleAddSkill} className="mt-4 bg-blue-600 hover:bg-blue-700"><Plus className="w-4 h-4 mr-2" /> Add Skill</Button>
                </Card>
                <div className="space-y-2">
                  {skills.map(skill => (
                    <Card key={skill.id} className="p-4 flex justify-between items-center border-border">
                      <div className="flex items-center gap-4"><span className="font-semibold">{skill.name}</span><Badge variant="secondary">{skill.category}</Badge><Progress value={skill.proficiency} className="w-24" /></div>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteSkill(skill.id)}><Trash2 className="w-4 h-4 text-red-400" /></Button>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="experience" className="p-4">
                <div className="space-y-2">
                  {experiences.map(exp => (
                    <Card key={exp.id} className="p-4 border-border">
                      <h4 className="font-semibold">{exp.title}</h4>
                      <p className="text-sm text-blue-400">{exp.company}</p>
                      <p className="text-xs text-muted-foreground">{exp.startDate} - {exp.endDate || 'Present'}</p>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="education" className="p-4">
                <div className="space-y-2">
                  {educations.map(edu => (
                    <Card key={edu.id} className="p-4 border-border">
                      <h4 className="font-semibold">{edu.institution}</h4>
                      <p className="text-sm text-blue-400">{edu.degree}</p>
                      {edu.gpa && <p className="text-xs text-muted-foreground">GPA: {edu.gpa}</p>}
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="settings" className="space-y-4 p-4">
                <Card className="p-4 border-border">
                  <h4 className="font-semibold mb-4">Intro & Chatbot Settings</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between"><Label>Show Intro Animation</Label><Switch checked={settingsForm.showIntro} onCheckedChange={checked => setSettingsForm({ ...settingsForm, showIntro: checked })} /></div>
                    <div className="flex items-center justify-between"><Label>Enable Chatbot</Label><Switch checked={settingsForm.introEnabled} onCheckedChange={checked => setSettingsForm({ ...settingsForm, introEnabled: checked })} /></div>
                    <div><Label>Chatbot Name</Label><Input value={settingsForm.assistantName} onChange={e => setSettingsForm({ ...settingsForm, assistantName: e.target.value })} /></div>
                    <div><Label>Intro Message</Label><Textarea value={settingsForm.introMessage} onChange={e => setSettingsForm({ ...settingsForm, introMessage: e.target.value })} rows={3} /></div>
                    <Button onClick={handleSaveSettings} className="bg-blue-600 hover:bg-blue-700"><Save className="w-4 h-4 mr-2" /> Save Settings</Button>
                  </div>
                </Card>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Contact Form Component
function ContactForm({ profile }: { profile: Profile | null }) {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success('Message sent successfully!');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        toast.error('Failed to send message');
      }
    } catch {
      toast.error('Failed to send message');
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            placeholder="Your name"
            required
            className="border-blue-500/30 focus:border-blue-500"
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            placeholder="your@email.com"
            required
            className="border-blue-500/30 focus:border-blue-500"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          value={formData.subject}
          onChange={e => setFormData({ ...formData, subject: e.target.value })}
          placeholder="What's this about?"
          className="border-blue-500/30 focus:border-blue-500"
        />
      </div>
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={e => setFormData({ ...formData, message: e.target.value })}
          placeholder="Your message..."
          rows={5}
          required
          className="border-blue-500/30 focus:border-blue-500"
        />
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700">
        {isSubmitting ? (
          'Sending...'
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            Send Message
          </>
        )}
      </Button>
    </form>
  );
}

// AI Model data for AIDiscoverySection
const AI_MODELS = [
  {
    name: 'Claude',
    provider: 'Anthropic',
    description: 'Advanced reasoning AI with extended thinking capabilities. Powers Claude Code for agentic coding.',
    specialty: 'Complex reasoning & code generation',
    color: 'orange',
    logoUrl: 'https://www.google.com/s2/favicons?domain=anthropic.com&sz=128'
  },
  {
    name: 'Gemini Pro',
    provider: 'Google DeepMind',
    description: 'Multimodal AI excelling at text, image, and code understanding with massive context windows.',
    specialty: 'Multimodal & long context',
    color: 'blue',
    logoUrl: 'https://www.google.com/s2/favicons?domain=deepmind.google&sz=128'
  },
  {
    name: 'DeepSeek',
    provider: 'DeepSeek AI',
    description: 'Open-source AI with chain-of-thought reasoning. DeepSeek R1 rivals top proprietary models.',
    specialty: 'Open-source reasoning',
    color: 'cyan',
    logoUrl: 'https://www.google.com/s2/favicons?domain=deepseek.com&sz=128'
  },
  {
    name: 'Grok',
    provider: 'xAI',
    description: 'Real-time knowledge AI with X/Twitter integration. Known for wit and current information.',
    specialty: 'Real-time knowledge',
    color: 'purple',
    logoUrl: 'https://www.google.com/s2/favicons?domain=x.ai&sz=128'
  },
  {
    name: 'GLM (ChatGLM)',
    provider: 'Zhipu AI',
    description: 'Bilingual Chinese-English model with strong code and math capabilities.',
    specialty: 'Bilingual & code',
    color: 'green',
    logoUrl: 'https://www.google.com/s2/favicons?domain=zhipuai.cn&sz=128'
  },
  {
    name: 'Kilo Code',
    provider: 'Kilo AI',
    description: 'Open-source agentic coding assistant. VS Code extension for code generation and refactoring.',
    specialty: 'Agentic code generation',
    color: 'yellow',
    logoUrl: 'https://www.google.com/s2/favicons?domain=kilo.gg&sz=128'
  },
  {
    name: 'Lovable',
    provider: 'Lovable',
    description: 'AI-powered full-stack app builder. Natural language to production-ready React applications.',
    specialty: 'Full-stack app generation',
    color: 'pink',
    logoUrl: 'https://www.google.com/s2/favicons?domain=lovable.dev&sz=128'
  },
  {
    name: 'Antigravity',
    provider: 'Google',
    description: 'Google\'s agentic development platform for AI-assisted coding and project scaffolding.',
    specialty: 'Agentic development',
    color: 'cyan',
    logoUrl: 'https://www.google.com/s2/favicons?domain=google.com&sz=128'
  },
  {
    name: 'Replit Agent',
    provider: 'Replit',
    description: 'AI coding assistant that builds, deploys, and iterates on full applications in the cloud.',
    specialty: 'Cloud-based app builder',
    color: 'red',
    logoUrl: 'https://www.google.com/s2/favicons?domain=replit.com&sz=128'
  },
  {
    name: 'n8n',
    provider: 'Workflow Automation',
    description: 'Fair-code licensed workflow automation tool. Extensible and highly customizable.',
    specialty: 'Node-based Workflows',
    color: 'orange',
    logoUrl: 'https://n8n.io/favicon.ico'
  },
  {
    name: 'Manus',
    provider: 'Manus AI',
    description: 'AI-first development and agentic workforce platform capabilities.',
    specialty: 'Agentic Intelligence',
    color: 'cyan',
    logoUrl: 'https://www.google.com/s2/favicons?domain=manus.im&sz=128'
  },
  {
    name: 'MiniMax',
    provider: 'MiniMax AI',
    description: 'Advanced Chinese-English bilingual AI models with strong generation skills.',
    specialty: 'Generative Models',
    color: 'pink',
    logoUrl: 'https://www.google.com/s2/favicons?domain=minimaxi.com&sz=128'
  }
];

// Color mappings for AI models
const COLOR_MAP: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  orange: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30', glow: 'shadow-orange-500/20' },
  blue: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30', glow: 'shadow-blue-500/20' },
  cyan: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/30', glow: 'shadow-cyan-500/20' },
  purple: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30', glow: 'shadow-purple-500/20' },
  green: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30', glow: 'shadow-green-500/20' },
  yellow: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30', glow: 'shadow-yellow-500/20' },
  pink: { bg: 'bg-pink-500/20', text: 'text-pink-400', border: 'border-pink-500/30', glow: 'shadow-pink-500/20' },

  red: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', glow: 'shadow-red-500/20' },
};

// AI Discovery Section Component
function AIDiscoverySection() {
  return (
    <section id="ai-discovery" className="py-20 px-6 bg-card/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-12 flex items-center pixel-title" style={{ fontFamily: "'Press Start 2P', cursive", fontSize: 'clamp(1rem, 3vw, 1.5rem)' }}>
          <span className="text-blue-400 mr-3 text-sm">05.</span>AI Discovery<span className="section-line" />
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AI_MODELS.map((model, index) => {
            const colors = COLOR_MAP[model.color];
            return (
              <motion.div
                key={model.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`h-full border-4 ${colors.border} glass card-hover overflow-hidden group hover:${colors.glow} hover:shadow-lg transition-all duration-300`}>
                  <CardContent className="p-6">
                    {/* Header with logo badge */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-lg ${colors.bg} ${colors.border} border-2 flex items-center justify-center p-1 overflow-hidden`}>
                        {model.logoUrl ? (
                          <img src={model.logoUrl} alt={`${model.name} logo`} className="w-8 h-8 object-contain" />
                        ) : (
                          <Bot className={`w-6 h-6 ${colors.text}`} />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{model.name}</h3>
                        <p className={`text-xs ${colors.text}`}>{model.provider}</p>
                      </div>
                    </div>
                    
                    {/* Description */}
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                      {model.description}
                    </p>
                    
                    {/* Specialty badge */}
                    <div className="flex items-center gap-2">
                      <Sparkles className={`w-4 h-4 ${colors.text}`} />
                      <Badge variant="secondary" className={`${colors.bg} ${colors.text} border ${colors.border}`}>
                        {model.specialty}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
        
        {/* Philosophy note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <Card className="inline-block border-4 border-blue-500/30 glass p-6">
            <div className="flex items-center gap-3">
              <Cpu className="w-6 h-6 text-blue-400" />
              <p className="text-muted-foreground italic pixel-text">
                &quot;In an era of AI-assisted development, I prioritize clean system architecture and security-first design.&quot;
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}



// Main Portfolio Component
export default function Portfolio() {
  const [introComplete, setIntroComplete] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  
  const [visitorChatbotEnabled, setVisitorChatbotEnabled] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('visitor_chatbot');
    if (saved !== null) {
      setVisitorChatbotEnabled(saved === 'true');
    }
  }, []);

  const toggleVisitorChatbot = (checked: boolean) => {
    setVisitorChatbotEnabled(checked);
    localStorage.setItem('visitor_chatbot', String(checked));
  };

  const fetchData = async () => {
    try {
      const [profileRes, projectsRes, skillsRes, expRes, eduRes, achRes, settingsRes] = await Promise.all([
        fetch('/api/profile'), fetch('/api/projects'), fetch('/api/skills'),
        fetch('/api/experience'), fetch('/api/education'), fetch('/api/achievements'), fetch('/api/settings'),
      ]);
      setProfile(await profileRes.json());
      setProjects(await projectsRes.json());
      setSkills(await skillsRes.json());
      setExperiences(await expRes.json());
      setEducations(await eduRes.json());
      setAchievements(await achRes.json());
      setSettings(await settingsRes.json());
      setHasFetched(true);
    } catch (error) { console.error('Error fetching data:', error); }
  };

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!hasFetched) fetchData();
  }, [hasFetched]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const shouldShowIntro = settings?.showIntro ?? true;

  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const parseTechStack = (techStack: string) => {
    try { return JSON.parse(techStack); }
    catch { return techStack.split(',').map(t => t.trim()); }
  };

  // Parse images from JSON string
  const parseImages = (images: string | null, fallbackUrl: string | null): string[] => {
    if (images) {
      try {
        const parsed = JSON.parse(images);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {
        // Fall through to fallback
      }
    }
    if (fallbackUrl) {
      return [fallbackUrl];
    }
    return [];
  };

  // Project Image Carousel Component
  function ProjectCarousel({ 
    images, 
    title,
    statusBadge 
  }: { 
    images: string[]; 
    title: string;
    statusBadge: React.ReactNode;
  }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const slideVariants = {
      enter: (direction: number) => ({
        x: direction > 0 ? 300 : -300,
        opacity: 0,
      }),
      center: {
        zIndex: 1,
        x: 0,
        opacity: 1,
      },
      exit: (direction: number) => ({
        zIndex: 0,
        x: direction < 0 ? 300 : -300,
        opacity: 0,
      }),
    };

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset: number, velocity: number) => {
      return Math.abs(offset) * velocity;
    };

    const paginate = (newDirection: number) => {
      setDirection(newDirection);
      setCurrentIndex((prevIndex) => (prevIndex + newDirection + images.length) % images.length);
    };

    if (images.length === 0) {
      return (
        <div className="relative aspect-video md:aspect-auto md:min-h-[320px] overflow-hidden bg-gradient-to-br from-blue-900/30 to-purple-900/30">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-3 rounded-lg bg-blue-500/20 border-2 border-blue-500/30 flex items-center justify-center" style={{ boxShadow: '4px 4px 0 rgba(59, 130, 246, 0.3)' }}>
                <Code className="w-10 h-10 text-blue-400" />
              </div>
              <span className="text-xs text-blue-400/50" style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.5rem' }}>PROJECT</span>
            </div>
          </div>
          <div className="absolute top-3 left-3">{statusBadge}</div>
        </div>
      );
    }

    if (images.length === 1) {
      return (
        <div className="relative aspect-video md:aspect-auto md:min-h-[320px] overflow-hidden bg-gradient-to-br from-blue-900/20 to-purple-900/20">
          <img 
            src={images[0]} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent md:bg-gradient-to-r" />
          <div className="absolute top-3 left-3">{statusBadge}</div>
        </div>
      );
    }

    return (
      <div className="relative aspect-video md:aspect-auto md:min-h-[320px] overflow-hidden bg-gradient-to-br from-blue-900/20 to-purple-900/20">
        {/* Status Badge */}
        <div className="absolute top-3 left-3 z-20">{statusBadge}</div>
        
        {/* Image Counter */}
        <div className="absolute top-3 right-3 z-20 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full text-xs text-white font-mono">
          {currentIndex + 1} / {images.length}
        </div>
        
        {/* Carousel Images */}
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`${title} - Image ${currentIndex + 1}`}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className="absolute inset-0 w-full h-full object-cover cursor-grab active:cursor-grabbing"
          />
        </AnimatePresence>
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent md:bg-gradient-to-r pointer-events-none" />
        
        {/* Navigation Arrows */}
        <button
          onClick={() => paginate(-1)}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => paginate(1)}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
          aria-label="Next image"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        
        {/* Dots Indicator */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-white w-4' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-background text-foreground scanlines">
      {/* Intro Portal */}
      <AnimatePresence>
        {shouldShowIntro && !introComplete && settings && (
          <IntroPortal onComplete={() => setIntroComplete(true)} />
        )}
      </AnimatePresence>

      {/* Main Content */}
      {(!shouldShowIntro || introComplete) && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col min-h-screen">
          {/* Navigation */}
          <nav className="fixed top-0 left-0 right-0 z-40 glass">
            <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
              <a href="#" className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-lg hover:bg-blue-500/30 transition-colors">
                  {profile?.name?.charAt(0) || 'B'}
                </div>
                <span className="font-bold gradient-text hidden sm:block">{profile?.name || 'Portfolio'}</span>
              </a>
              <div className="flex items-center gap-6">
                <div className="hidden md:flex gap-6">
                  <a href="#education" className="text-muted-foreground hover:text-blue-400 transition-colors font-mono text-sm"><span className="text-blue-400">01.</span> Education</a>
                  <a href="#experience" className="text-muted-foreground hover:text-blue-400 transition-colors font-mono text-sm"><span className="text-blue-400">02.</span> Experience</a>
                  <a href="#projects" className="text-muted-foreground hover:text-blue-400 transition-colors font-mono text-sm"><span className="text-blue-400">03.</span> Projects</a>
                  <a href="#certificates" className="text-muted-foreground hover:text-blue-400 transition-colors font-mono text-sm"><span className="text-blue-400">04.</span> Certificates</a>
                  <a href="#ai-discovery" className="text-muted-foreground hover:text-blue-400 transition-colors font-mono text-sm"><span className="text-blue-400">05.</span> AI</a>
                  <a href="#contact" className="text-muted-foreground hover:text-blue-400 transition-colors font-mono text-sm"><span className="text-blue-400">06.</span> Contact</a>
                </div>
                <div className="flex items-center gap-4 border-l border-blue-500/20 pl-4">
                  <div className="hidden sm:flex items-center gap-2">
                    <Label className="text-xs text-muted-foreground flex items-center gap-1 cursor-pointer font-mono" onClick={() => toggleVisitorChatbot(!visitorChatbotEnabled)}>
                      <Bot className="w-3 h-3 text-blue-400" /> AI
                    </Label>
                    <Switch 
                      checked={visitorChatbotEnabled} 
                      onCheckedChange={toggleVisitorChatbot}
                      className="scale-75"
                    />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setShowAdmin(true)} className="text-muted-foreground hover:text-blue-400"><Settings className="w-5 h-5" /></Button>
                  {profile?.githubUrl && <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-blue-400 transition-colors"><Github className="w-5 h-5" /></a>}
                </div>
              </div>
            </div>
          </nav>

          {/* Hero Section */}
          <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-[128px] animate-pulse-glow" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full filter blur-[128px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
            </div>
            
            <div className="relative z-10 max-w-6xl w-full mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
              {/* Left side - Text content */}
              <div className="flex-1 text-center md:text-left">
                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-blue-400 mb-4 pixel-text text-xl">Hello, I am</motion.p>
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-4xl md:text-6xl font-bold mb-4 pixel-title" style={{ fontFamily: "'Press Start 2P', cursive" }}>
                  {profile?.name || 'Your Name'}<span className="animate-pixel-blink text-blue-400">_</span>
                </motion.h1>
                <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-xl md:text-2xl font-bold text-muted-foreground mb-6 pixel-text">
                  {profile?.title || 'Your Title'}<br /><span className="gradient-text">{profile?.subtitle || 'Your Subtitle'}</span>
                </motion.h2>
                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-muted-foreground max-w-xl mb-8 leading-relaxed pixel-text text-lg">
                  {profile?.bio || 'Your bio will appear here...'}
                </motion.p>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <a href="#projects"><Button size="lg" className="pixel-btn bg-blue-600 hover:bg-blue-700">View Projects<ExternalLink className="w-4 h-4 ml-2" /></Button></a>
                  <a href="/resume.pdf" download><Button variant="outline" size="lg" className="pixel-btn border-blue-500/30 hover:bg-blue-500/10"><Download className="w-4 h-4 mr-2" />Resume</Button></a>
                  {profile?.githubUrl && <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer"><Button variant="outline" size="lg" className="pixel-btn border-blue-500/30 hover:bg-blue-500/10"><Github className="w-4 h-4 mr-2" />GitHub</Button></a>}
                  {profile?.linkedinUrl && <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer"><Button variant="outline" size="lg" className="pixel-btn border-blue-500/30 hover:bg-blue-500/10"><Linkedin className="w-4 h-4 mr-2" />LinkedIn</Button></a>}
                </motion.div>
              </div>
              
              {/* Right side - Photo */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ delay: 0.5, duration: 0.5 }}
                className="flex-shrink-0"
              >
                <div className="relative">
                  {/* Glow effect behind photo */}
                  <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl scale-110 animate-pulse" />
                  
                  {/* Photo container */}
                  <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full border-4 border-blue-500/50 overflow-hidden bg-gradient-to-br from-blue-900/50 to-blue-950/50">
                    {/* Actual photo */}
                    <img 
                      src="/myself.jpeg" 
                      alt={profile?.name || 'Profile Photo'} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Decorative ring */}
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-blue-400/20 animate-spin" style={{ animationDuration: '20s' }} />
                </div>
              </motion.div>
            </div>
            
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="absolute bottom-8 left-1/2 -translate-x-1/2"><ChevronDown className="w-6 h-6 text-blue-400 animate-bounce" /></motion.div>
          </section>

          {/* Education Section */}
          <section id="education" className="py-20 px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-12 flex items-center pixel-title" style={{ fontFamily: "'Press Start 2P', cursive", fontSize: 'clamp(1rem, 3vw, 1.5rem)' }}><span className="text-blue-400 mr-3 text-sm">01.</span>Education<span className="section-line" /></h2>
              <div className="space-y-6">
                {educations.map((edu, index) => (
                  <motion.div 
                    key={edu.id} 
                    initial={{ opacity: 0, y: 20 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true }} 
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-6 border-border glass card-hover border-l-4 border-l-blue-500">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0">
                          <GraduationCap className="w-6 h-6 text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg">{edu.institution}</h3>
                          <p className="text-blue-400 font-semibold">{edu.degree}</p>
                          {edu.field && <p className="text-muted-foreground text-sm">{edu.field}</p>}
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span className="text-muted-foreground">{edu.startDate} - {edu.endDate || 'Present'}</span>
                            {edu.gpa && <span className="text-blue-400 font-mono px-2 py-0.5 bg-blue-500/10 rounded">GPA: {edu.gpa}</span>}
                          </div>
                          {edu.achievements && (
                            <p className="text-muted-foreground text-sm mt-2 italic">{edu.achievements}</p>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Experience Section */}
          <section id="experience" className="py-20 px-6 bg-card/30">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-12 flex items-center pixel-title" style={{ fontFamily: "'Press Start 2P', cursive", fontSize: 'clamp(1rem, 3vw, 1.5rem)' }}><span className="text-blue-400 mr-3 text-sm">02.</span>Experience<span className="section-line" /></h2>
              <div className="space-y-12">
                {experiences.map((exp, index) => {
                  const isEven = index % 2 === 0;
                  const expImg = exp.company.includes('Loca') 
                    ? 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1000&auto=format&fit=crop'
                    : exp.company.includes('Madani') 
                      ? '/upload/projects/Madani IT Solution/photo_2026-03-28_00-16-09.jpg'
                      : 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000&auto=format&fit=crop';
                      
                  return (
                    <motion.div key={exp.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }}>
                      <Card className="overflow-hidden border-border glass bg-card/40 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
                        <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} h-full`}>
                          {/* Image Side */}
                          <div className="w-full lg:w-1/2 relative min-h-[300px] lg:min-h-[400px] bg-black/50 overflow-hidden group">
                            <img
                              src={expImg}
                              alt={exp.company}
                              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                            />
                            {/* Overlay tag */}
                            <div className="absolute top-4 left-4 z-10">
                              <Badge className="bg-black/80 backdrop-blur-md text-blue-400 border border-blue-500/30 font-mono">
                                {exp.type.toUpperCase()}
                              </Badge>
                            </div>
                          </div>

                          {/* Content Side */}
                          <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-transparent pointer-events-none" />
                            <div className="relative z-10">
                              <h3 className="text-2xl md:text-3xl font-bold mb-2 flex flex-wrap items-center gap-3">
                                {exp.title}
                                {exp.current && <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">Current</Badge>}
                              </h3>
                              
                              <p className="text-xl text-blue-400 font-semibold mb-6 flex items-center gap-2">
                                <Briefcase className="w-5 h-5 inline-block" /> {exp.company}
                              </p>

                              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-muted-foreground bg-black/30 w-full md:w-max px-4 py-2 rounded-lg border border-white/5">
                                <span className="flex items-center gap-2">
                                  <span>{exp.startDate} - {exp.endDate || 'Present'}</span>
                                </span>
                                {exp.location && (
                                  <>
                                    <span className="hidden md:inline-block w-px h-4 bg-border" />
                                    <span className="flex items-center gap-2">
                                      <MapPin className="w-4 h-4 text-blue-400/70" /> {exp.location}
                                    </span>
                                  </>
                                )}
                              </div>

                              <div className="text-muted-foreground leading-relaxed text-sm lg:text-base border-l-2 border-blue-500/20 pl-4">
                                {exp.description}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>


          {/* Projects Section */}
          <section id="projects" className="py-20 px-6 bg-card/30">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-12 flex items-center pixel-title" style={{ fontFamily: "'Press Start 2P', cursive", fontSize: 'clamp(1rem, 3vw, 1.5rem)' }}><span className="text-blue-400 mr-3 text-sm">03.</span>Projects<span className="section-line" /></h2>
              {/* Project Cards with Zig-Zag Layout and Carousel */}
              <div className="space-y-12">
                {projects.map((project, index) => {
                  // Get status badge styling
                  const getStatusStyles = () => {
                    if (project.status === 'Competition Winner' || project.title?.includes('ClaRity')) {
                      return { badge: '🥇 Gold Medal', bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/50' };
                    }
                    if (project.status === 'Live Demo' || project.demoUrl) {
                      return { badge: '🔴 Live', bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' };
                    }
                    if (project.status === 'Coming Soon') {
                      return { badge: '⏳ Coming Soon', bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' };
                    }
                    return { badge: '✓ Complete', bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/30' };
                  };
                  
                  const status = getStatusStyles();
                  const isFeatured = project.featured || project.title?.includes('ClaRity');
                  const isEven = index % 2 === 0;
                  const projectImages = parseImages(project.images, project.imageUrl);
                  
                  // Status badge component
                  const StatusBadge = (
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${status.bg} ${status.text} border ${status.border}`} style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.5rem' }}>
                      {status.badge}
                    </span>
                  );
                  
                  return (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.15, duration: 0.5 }}
                    >
                      <Card className={`overflow-hidden group transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 ${isFeatured ? 'border-2 border-yellow-500/50 bg-gradient-to-br from-yellow-500/5 to-transparent' : 'border-border hover:border-blue-500/30'}`}
                        style={{ boxShadow: isFeatured ? '0 0 30px rgba(234, 179, 8, 0.1)' : undefined }}>
                        
                        <div className={`grid md:grid-cols-2 gap-0`}>
                          {/* Project Image Carousel - Zig-Zag Position */}
                          <div className={`${isEven ? '' : 'md:order-2'}`}>
                            <ProjectCarousel 
                              images={projectImages}
                              title={project.title}
                              statusBadge={StatusBadge}
                            />
                          </div>
                          
                          {/* Project Content - Zig-Zag Position */}
                          <CardContent className={`p-6 flex flex-col justify-between ${isEven ? '' : 'md:order-1'}`}>
                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <h3 className="font-bold text-xl group-hover:text-blue-400 transition-colors" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                  {project.title}
                                </h3>
                                {projectImages.length === 0 && StatusBadge}
                              </div>
                              
                              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                                {project.longDescription || project.description}
                              </p>
                              
                              {/* Tech Stack */}
                              <div className="flex flex-wrap gap-2 mb-4">
                                {parseTechStack(project.techStack).map((tech: string, i: number) => (
                                  <span 
                                    key={i} 
                                    className="px-2 py-1 text-xs rounded bg-blue-500/10 text-blue-300 border border-blue-500/20"
                                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-2">
                              {project.demoUrl && (
                                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                                  <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-500 text-white pixel-btn" style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.5rem' }}>
                                    <ExternalLink className="w-3 h-3 mr-2" />Live Demo
                                  </Button>
                                </a>
                              )}
                              {project.githubUrl && (
                                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                  <Button size="sm" variant="outline" className="border-blue-500/30 hover:bg-blue-500/10 text-blue-400">
                                    <Github className="w-4 h-4 mr-1" />Code
                                  </Button>
                                </a>
                              )}
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>



          {/* Certificates Section */}
          <section id="certificates" className="py-20 px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-12 flex items-center pixel-title" style={{ fontFamily: "'Press Start 2P', cursive", fontSize: 'clamp(1rem, 3vw, 1.5rem)' }}><span className="text-blue-400 mr-3 text-sm">04.</span>Certificates<span className="section-line" /></h2>
              <div className="grid md:grid-cols-2 gap-6 mb-12">
                {achievements.map((cert, index) => (
                  <motion.div
                    key={cert.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full border-4 border-blue-500/30 glass card-hover overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
                      <CardContent className="p-0 flex flex-col h-full">
                        {cert.imageUrl && (
                           <div className="aspect-[4/3] relative overflow-hidden bg-blue-900/20 border-b-2 border-blue-500/20">
                             {cert.imageUrl.endsWith('.pdf') ? (
                               <div className="absolute inset-0 flex flex-col items-center justify-center bg-blue-900/30">
                                 <Award className="w-12 h-12 text-blue-400 mb-2" />
                                 <span className="text-sm font-bold text-blue-300">PDF Document</span>
                                 <a href={cert.imageUrl} target="_blank" rel="noopener noreferrer" className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-2 rounded text-xs pixel-btn" style={{ fontFamily: "'Press Start 2P', cursive" }}>View PDF</a>
                               </div>
                             ) : (
                               <img src={cert.imageUrl} alt={cert.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                             )}
                           </div>
                        )}
                        <div className="p-6 flex-1 flex flex-col">
                          <h3 className="font-bold text-lg mb-1">{cert.title}</h3>
                          {cert.issuer && <p className="text-blue-400 font-semibold text-sm mb-2">{cert.issuer}</p>}
                          <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">
                            {cert.description}
                          </p>
                          <div className="flex justify-between items-center text-xs text-muted-foreground pt-4 border-t border-blue-500/10">
                            <span className="flex items-center gap-1 font-mono">{cert.date}</span>
                            {cert.link && (
                              <a href={cert.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline flex items-center gap-1">
                                View Credential <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* AI Discovery Section */}
          <AIDiscoverySection />

          {/* Contact Section */}
          <section id="contact" className="py-20 px-6 bg-card/30">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center pixel-title" style={{ fontFamily: "'Press Start 2P', cursive", fontSize: 'clamp(1rem, 3vw, 1.5rem)' }}><span className="text-blue-400 mr-3 text-sm">06.</span>Get In Touch</h2>
              <p className="text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
                I&apos;m currently looking for new opportunities. Feel free to reach out!
              </p>
              <ContactForm profile={profile} />
              
              {/* Contact Links */}
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <a href="mailto:mohdbukhari03@gmail.com">
                  <Button variant="outline" className="border-blue-500/30 hover:bg-blue-500/10">
                    <Mail className="w-4 h-4 mr-2" />mohdbukhari03@gmail.com
                  </Button>
                </a>
                {profile?.location && (
                  <Button variant="ghost" className="text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2" />{profile.location}
                  </Button>
                )}
              </div>
              
              {/* Social Links */}
              <div className="flex justify-center gap-4 mt-4">
                <a href="https://github.com/Bukhhh" target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-blue-400">
                    <Github className="w-5 h-5" />
                  </Button>
                </a>
                <a href="https://www.linkedin.com/in/bukhtech/" target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-blue-400">
                    <Linkedin className="w-5 h-5" />
                  </Button>
                </a>
                <a href="https://bukhari.dev" target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-blue-400">
                    <ExternalLink className="w-5 h-5" />
                  </Button>
                </a>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="py-8 px-6 border-t border-border mt-auto">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-center md:text-left">
                  <p className="text-muted-foreground text-sm">
                    Built with <span className="text-blue-400">Next.js</span>, <span className="text-blue-400">TypeScript</span>, and <span className="text-blue-400">❤</span>
                  </p>
                  <p className="text-muted-foreground text-sm mt-1">
                    © {new Date().getFullYear()} {profile?.name || 'Portfolio'}. All rights reserved.
                  </p>
                </div>
                
                {/* Footer Contact Links */}
                <div className="flex items-center gap-4">
                  <a href="mailto:mohdbukhari03@gmail.com" className="text-muted-foreground hover:text-blue-400 transition-colors">
                    <Mail className="w-5 h-5" />
                  </a>
                  <a href="https://github.com/Bukhhh" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-blue-400 transition-colors">
                    <Github className="w-5 h-5" />
                  </a>
                  <a href="https://www.linkedin.com/in/bukhtech/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-blue-400 transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a href="https://bukhari.dev" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-blue-400 transition-colors">
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </motion.div>
      )}

      {/* Chatbot */}
      {settings?.introEnabled && visitorChatbotEnabled && <Chatbot assistantName={settings.assistantName} profile={profile} settings={settings} />}

      {/* Background Music Player */}
      <MusicPlayer />

      {/* Admin Panel */}
      <AdminPanel isOpen={showAdmin} onClose={() => setShowAdmin(false)} profile={profile} projects={projects} skills={skills} experiences={experiences} educations={educations} achievements={achievements} settings={settings} onDataRefresh={fetchData} />
    </main>
  );
}
