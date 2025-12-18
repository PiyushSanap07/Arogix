import React, { useState, useEffect, useRef } from 'react';
import { ViewState, UserRole } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { PatientDashboard } from './components/PatientDashboard';
import { DoctorDashboard } from './components/DoctorDashboard';
import { Video, ShieldCheck, Stethoscope, Clock, CheckCircle, User, Quote, HeartPulse, Building2, Globe } from 'lucide-react';

/* =========================
   TYPEWRITER HOOK (LINE BY LINE LOOP)
========================= */
const useTypewriter = (
  lines: string[],
  typingSpeed = 100,      // ms per character
  deletingSpeed = 50,     // ms per character
  pauseBeforeDelete = 1500 // pause after line is typed
) => {
  const [text, setText] = useState('');
  const [lineIndex, setLineIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentLine = lines[lineIndex];
    let timeout: number;

    if (!isDeleting) {
      // Typing
      timeout = window.setTimeout(() => {
        setText(currentLine.slice(0, text.length + 1));

        if (text.length + 1 === currentLine.length) {
          // Full line typed, wait before deleting
          setTimeout(() => setIsDeleting(true), pauseBeforeDelete);
        }
      }, typingSpeed);
    } else {
      // Deleting
      timeout = window.setTimeout(() => {
        setText(currentLine.slice(0, text.length - 1));

        if (text.length - 1 === 0) {
          // Move to next line
          setIsDeleting(false);
          setLineIndex((prev) => (prev + 1) % lines.length);
        }
      }, deletingSpeed);
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, lineIndex, lines, typingSpeed, deletingSpeed, pauseBeforeDelete]);

  return text;
};

/* =========================
   AURORA & PARTICLE BACKGROUNDS
========================= */

const AuroraBackground = () => (
  <div className="fixed inset-0 overflow-hidden -z-20 pointer-events-none">
    <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-400/30 dark:bg-purple-900/40 blur-3xl rounded-full animate-blob mix-blend-multiply dark:mix-blend-screen" />
    <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-300/30 dark:bg-teal-800/40 blur-3xl rounded-full animate-blob animation-delay-2000 mix-blend-multiply dark:mix-blend-screen" />
    <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-blue-300/30 dark:bg-blue-800/40 blur-3xl rounded-full animate-blob animation-delay-4000 mix-blend-multiply dark:mix-blend-screen" />
    <div className="absolute inset-0 bg-white/10 dark:bg-gray-950/60 backdrop-blur-[1px]" />
  </div>
);

const ParticleBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = '';

    const styleId = 'particle-animations-style';
    let styleTag = document.getElementById(styleId) as HTMLStyleElement;
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }

    let css = '';
    const particleCount = 60;

    for (let i = 0; i < particleCount; i++) {
      const size = Math.random() * 3 + 2;
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const moveDuration = Math.random() * 30 + 30;
      const blinkDuration = Math.random() * 10 + 10;
      const delay = Math.random() * 20;
      const xMove = Math.random() * 20 - 10;
      const yMove = Math.random() * 20 - 10;

      const moveName = `move-${i}`;
      const blinkName = `blink-${i}`;

      css += `
        @keyframes ${moveName} {
          0% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(${xMove}vw, ${yMove}vh, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        @keyframes ${blinkName} {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }
        .particle-${i} {
          position: absolute;
          top: ${top}vh;
          left: ${left}vw;
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          background-color: var(--particle-color);
          animation: ${moveName} ${moveDuration}s linear infinite ${delay}s, ${blinkName} ${blinkDuration}s ease-in-out infinite ${delay}s;
          opacity: 0;
          pointer-events: none;
        }
      `;

      const p = document.createElement('div');
      p.className = `particle-${i}`;
      container.appendChild(p);
    }

    styleTag.innerHTML = css;

    return () => {};
  }, []);

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true" />;
};

const TESTIMONIALS = [
  { name: "Ananya Sharma", role: "Patient", text: "The AI checker was spot on! It guided me to a cardiologist immediately." },
  { name: "Dr. Rajesh K.", role: "Neurologist", text: "Arogix has streamlined my tele-consultations perfectly." },
  { name: "Sarah Jenkins", role: "Patient", text: "Booking an appointment took less than 30 seconds. Amazing UI." },
  { name: "Dr. Meredith Grey", role: "Surgeon", text: "Secure, fast, and reliable. The digital prescription tool is a lifesaver." },
  { name: "Vikram Malhotra", role: "Patient", text: "Video quality was crisp, felt like a real clinic visit." },
];

/* =========================
   LANDING PAGE
========================= */
interface LandingPageProps {
  headline: string;
  onLogin: (role: UserRole) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ headline, onLogin }) => (
  <div className="relative min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 dark:from-gray-900 dark:to-teal-950 transition-colors duration-500" id="home">
    <AuroraBackground />
    <ParticleBackground />
    
    {/* HERO */}
    <section className="pt-32 pb-16 relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        <div className="text-center lg:text-left z-10">
          <div className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-wider text-teal-700 dark:text-teal-300 uppercase bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-teal-100 dark:border-teal-900 rounded-full shadow-sm">
            ✨ The Future of Telehealth
          </div>
          <h1 className="min-h-[5.5rem] md:min-h-[7rem] lg:min-h-[8.5rem] text-5xl md:text-6xl lg:text-7xl font-extrabold text-teal-900 dark:text-teal-50 font-['Poppins'] tracking-tight leading-tight">
            {headline}<span className="ml-1 text-teal-500 animate-pulse">|</span>
          </h1>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-lg mx-auto lg:mx-0 leading-relaxed">
            Seamless telemedicine with AI-powered insights, trusted doctors, and secure digital care. Experience healthcare reimagined.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button onClick={() => onLogin(UserRole.PATIENT)} className="px-8 py-4 bg-teal-600 text-white rounded-xl font-bold shadow-lg shadow-teal-500/20 hover:scale-105 hover:bg-teal-700 transition-all duration-300">
              Consult Now
            </button>
            <button onClick={() => onLogin(UserRole.PATIENT)} className="glass-card px-8 py-4 text-gray-700 dark:text-gray-200 rounded-xl font-bold hover:bg-white/80 dark:hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-2">
              <Stethoscope size={20} className="text-teal-600 dark:text-teal-400" />
              Check Symptoms
            </button>
          </div>
        </div>

        <div className="relative mx-auto lg:mx-0 max-w-lg mt-12 lg:mt-0">
          <div className="relative rounded-3xl shadow-2xl overflow-hidden border border-white/20 dark:border-gray-700 group h-[400px] w-full">
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10"></div>
            <img src="https://images.unsplash.com/photo-1629904853893-c2c8981a1dc5?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" alt="Indian Medical Team"/>
          </div>
        </div>
      </div>
    </section>
    
    {/* TESTIMONIALS */}
    <section className="py-12 border-y border-white/20 dark:border-gray-800 bg-white/30 dark:bg-gray-900/30 backdrop-blur-md overflow-hidden relative z-20">
      <div className="max-w-full flex animate-scroll hover:pause-animation">
        <div className="flex gap-6 px-4">
          {[...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
            <div key={i} className="glass-card w-80 p-5 rounded-2xl flex-shrink-0 hover:scale-105 transition-transform duration-300 border border-white/40 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold shadow-md ring-2 ring-white dark:ring-gray-800">
                  <User size={18}/>
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-sm">{t.name}</p>
                  <p className="text-xs text-teal-700 dark:text-teal-300 font-medium">{t.role}</p>
                </div>
                <Quote size={16} className="ml-auto text-gray-300 dark:text-gray-600" />
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm italic leading-relaxed">"{t.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

/* =========================
   APP
========================= */
function App() {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.LANDING);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  const headline = useTypewriter([
    'Care That Connects',
    'Care That Heals',
    'Care That Understands',
    'Care You Can Trust'
  ], 120, 60, 1500);

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setCurrentView(role === UserRole.PATIENT ? ViewState.PATIENT_DASHBOARD : ViewState.DOCTOR_DASHBOARD);
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentView(ViewState.LANDING);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-500">
      <Navbar onNavigate={setCurrentView} isLoggedIn={!!userRole} onLogout={handleLogout} />

      {currentView === ViewState.LANDING && <LandingPage headline={headline} onLogin={handleLogin} />}
      {currentView === ViewState.PATIENT_DASHBOARD && <PatientDashboard />}
      {currentView === ViewState.DOCTOR_DASHBOARD && <DoctorDashboard />}
      {currentView === ViewState.LANDING && <Footer />}
    </div>
  );
}

export default App;
