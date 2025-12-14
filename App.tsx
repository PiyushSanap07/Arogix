import React, { useState, useEffect, useRef } from 'react';
import { ViewState, UserRole } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { PatientDashboard } from './components/PatientDashboard';
import { DoctorDashboard } from './components/DoctorDashboard';
import { Video, ShieldCheck, Stethoscope, Clock, CheckCircle, User, Quote, HeartPulse, Building2, Globe } from 'lucide-react';

/* =========================
   TYPEWRITER HOOK (LOOP)
========================= */
const useTypewriter = (
  words: string[],
  typingSpeed = 100,
  deletingSpeed = 60,
  delayBetweenWords = 2000
) => {
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex];
    let timeout: number;

    if (!isDeleting) {
      timeout = window.setTimeout(() => {
        setText(currentWord.slice(0, text.length + 1));
        if (text === currentWord) {
          setTimeout(() => setIsDeleting(true), delayBetweenWords);
        }
      }, typingSpeed);
    } else {
      timeout = window.setTimeout(() => {
        setText(currentWord.slice(0, text.length - 1));
        if (text === '') {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      }, deletingSpeed);
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, delayBetweenWords]);

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
    {/* Reduced overlay opacity in light mode to make aurora more visible */}
    <div className="absolute inset-0 bg-white/10 dark:bg-gray-950/60 backdrop-blur-[1px]" />
  </div>
);

const ParticleBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear previous
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
      const size = Math.random() * 3 + 2; // 2px - 5px
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const moveDuration = Math.random() * 30 + 30; // 30s - 60s
      const blinkDuration = Math.random() * 10 + 10; // 10s - 20s
      const delay = Math.random() * 20; // 0s - 20s
      const xMove = Math.random() * 20 - 10; // -10vw to +10vw
      const yMove = Math.random() * 20 - 10; // -10vh to +10vh

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

    return () => {
      // Cleanup handled by innerHTML clear on re-mount
    };
  }, []);

  // Use fixed positioning to cover the whole viewport regardless of scroll
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
   LANDING PAGE COMPONENT
========================= */
interface LandingPageProps {
  headline: string;
  onLogin: (role: UserRole) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ headline, onLogin }) => (
  <div className="relative min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 dark:from-gray-900 dark:to-teal-950 transition-colors duration-500" id="home">
    <AuroraBackground />
    <ParticleBackground />

    {/* HERO SECTION */}
    <section className="pt-32 pb-16 relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="text-center lg:text-left z-10">
          <div className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-wider text-teal-700 dark:text-teal-300 uppercase bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-teal-100 dark:border-teal-900 rounded-full shadow-sm">
            ✨ The Future of Telehealth
          </div>
          
          <h1 className="h-20 md:h-24 text-5xl md:text-6xl lg:text-7xl font-extrabold text-teal-900 dark:text-teal-50 font-['Poppins'] tracking-tight">
            {headline}
            <span className="ml-1 text-teal-500 animate-pulse">|</span>
          </h1>

          <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-lg mx-auto lg:mx-0 leading-relaxed">
            Seamless telemedicine with AI-powered insights, trusted doctors,
            and secure digital care. Experience healthcare reimagined.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button
              onClick={() => onLogin(UserRole.PATIENT)}
              className="px-8 py-4 bg-teal-600 text-white rounded-xl font-bold shadow-lg shadow-teal-500/20 hover:scale-105 hover:bg-teal-700 transition-all duration-300"
            >
              Consult Now
            </button>
            <button
              onClick={() => onLogin(UserRole.PATIENT)}
              className="glass-card px-8 py-4 text-gray-700 dark:text-gray-200 rounded-xl font-bold hover:bg-white/80 dark:hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Stethoscope size={20} className="text-teal-600 dark:text-teal-400" /> 
              Check Symptoms
            </button>
          </div>

          {/* Trusted By / Partners Strip */}
          <div className="mt-12 pt-8 border-t border-gray-200/50 dark:border-gray-800/50">
             <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">Trusted by industry leaders</p>
             <div className="flex flex-wrap justify-center lg:justify-start gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="flex items-center gap-2">
                   <Building2 size={24} className="text-gray-700 dark:text-gray-300" />
                   <span className="font-bold text-gray-700 dark:text-gray-300">MediCare</span>
                </div>
                <div className="flex items-center gap-2">
                   <Globe size={24} className="text-gray-700 dark:text-gray-300" />
                   <span className="font-bold text-gray-700 dark:text-gray-300">GlobalHealth</span>
                </div>
                <div className="flex items-center gap-2">
                   <HeartPulse size={24} className="text-gray-700 dark:text-gray-300" />
                   <span className="font-bold text-gray-700 dark:text-gray-300">PharmaPlus</span>
                </div>
             </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="relative mx-auto lg:mx-0 max-w-lg mt-12 lg:mt-0">
          <div className="relative rounded-3xl shadow-2xl overflow-hidden border border-white/20 dark:border-gray-700 group h-[400px] w-full">
             <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10"></div>
            {/* Indian Medical Team */}
            <img
              src="https://images.unsplash.com/photo-1629904853893-c2c8981a1dc5?auto=format&fit=crop&w=800&q=80"
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              alt="Indian Medical Team"
            />
            
            <div className="absolute bottom-6 left-6 z-20 glass-card p-4 rounded-xl shadow-lg flex items-center gap-3 max-w-[240px]">
              <div className="flex -space-x-3">
                  <img className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 object-cover" src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop" alt="Doc 1" />
                  <img className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 object-cover" src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=100&h=100&fit=crop" alt="Doc 2" />
                  <img className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 object-cover" src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=100&h=100&fit=crop" alt="Doc 3" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Expert Doctors</p>
                <p className="text-xs text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> 50+ Top Specialists
                </p>
              </div>
            </div>

            <div className="absolute top-6 right-6 z-20 glass-card p-3 rounded-xl shadow-lg flex items-center gap-2">
              <div className="bg-blue-100 dark:bg-blue-900/50 p-1.5 rounded-full">
                <ShieldCheck className="text-blue-600 dark:text-blue-400" size={16} />
              </div>
              <span className="text-xs font-bold text-gray-800 dark:text-gray-200">100% Secure</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* TESTIMONIALS TICKER */}
    <section className="py-12 border-y border-white/20 dark:border-gray-800 bg-white/30 dark:bg-gray-900/30 backdrop-blur-md overflow-hidden relative z-20">
      <div className="max-w-full flex animate-scroll hover:pause-animation">
        <div className="flex gap-6 px-4">
          {[...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
            <div key={i} className="glass-card w-80 p-5 rounded-2xl flex-shrink-0 hover:scale-105 transition-transform duration-300 border border-white/40 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold shadow-md ring-2 ring-white dark:ring-gray-800">
                  <User size={18} />
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

    {/* LOGIN SELECTION */}
    <section className="py-24 relative z-20" id="login-section">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          <div 
            onClick={() => onLogin(UserRole.DOCTOR)}
            className="group cursor-pointer rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden h-[320px] flex flex-col justify-end p-8 border border-white/30"
          >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
               <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Doctor Login" />
               <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/60 to-transparent"></div>
            </div>

            <div className="relative z-10 text-center">
              <div className="w-16 h-16 mx-auto bg-blue-500/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 ring-2 ring-blue-400/50">
                <Stethoscope size={32} className="text-blue-100" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Doctor Login</h3>
              <p className="text-blue-100 mb-6 text-sm">Manage patients, consultations & digital prescriptions.</p>
              <span className="inline-flex items-center justify-center bg-blue-600/80 backdrop-blur-sm px-6 py-2 rounded-full text-white font-bold group-hover:bg-blue-600 transition-colors w-full">
                Access Dashboard <User size={16} className="ml-2"/>
              </span>
            </div>
          </div>

          <div 
            onClick={() => onLogin(UserRole.PATIENT)}
            className="group cursor-pointer rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden h-[320px] flex flex-col justify-end p-8 border border-white/30"
          >
             {/* Background Image with Overlay */}
             <div className="absolute inset-0 z-0">
               <img src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Patient Login" />
               <div className="absolute inset-0 bg-gradient-to-t from-teal-900/90 via-teal-900/60 to-transparent"></div>
            </div>

            <div className="relative z-10 text-center">
              <div className="w-16 h-16 mx-auto bg-teal-500/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 ring-2 ring-teal-400/50">
                <ShieldCheck size={32} className="text-teal-100" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Patient Login</h3>
              <p className="text-teal-100 mb-6 text-sm">Consult doctors, check symptoms & track health.</p>
              <span className="inline-flex items-center justify-center bg-teal-600/80 backdrop-blur-sm px-6 py-2 rounded-full text-white font-bold group-hover:bg-teal-600 transition-colors w-full">
                Enter Portal <User size={16} className="ml-2"/>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* FEATURES / SERVICES */}
    <section className="py-20 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md transition-colors duration-500" id="features">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 font-['Poppins']">Why Choose Arogix?</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">We combine advanced technology with compassionate care to bring you the best medical experience.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { 
              title: 'Video Consultations', 
              desc: 'High-quality secure video calls with specialists from home.', 
              icon: Video, 
              color: 'text-blue-600 dark:text-blue-400', 
              bg: 'bg-blue-50 dark:bg-blue-900/20',
              img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=400&q=80'
            },
            { 
              title: 'Doctor Chat', 
              desc: 'Connect instantly with trusted doctors for quick advice.', 
              icon: ShieldCheck, 
              color: 'text-teal-600 dark:text-teal-400', 
              bg: 'bg-teal-50 dark:bg-teal-900/20',
              img: 'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&w=400&q=80'
            },
            { 
              title: 'Digital Records', 
              desc: 'Access your prescriptions and medical history anytime.', 
              icon: Clock, 
              color: 'text-purple-600 dark:text-purple-400', 
              bg: 'bg-purple-50 dark:bg-purple-900/20',
              img: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=400&q=80'
            },
          ].map((f, i) => (
            <div key={i} className="glass-card rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col">
              <div className="h-40 overflow-hidden relative">
                 <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors z-10"></div>
                 <img src={f.img} alt={f.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <div className={`w-14 h-14 ${f.bg} rounded-xl flex items-center justify-center mb-6 -mt-14 relative z-20 shadow-lg`}>
                  <f.icon className={f.color} size={28} />
                </div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{f.title}</h4>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm flex-1">{f.desc}</p>
                <button className="mt-4 text-sm font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 flex items-center gap-1 group/btn">
                  Learn more <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ABOUT SECTION */}
    <section className="py-24 bg-teal-50/50 dark:bg-gray-900/80 transition-colors duration-500" id="about">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
         <div>
           <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 font-['Poppins']">About Arogix</h2>
           <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
             Arogix is a pioneering telemedicine platform rooted in the values of trust and accessibility. We believe healthcare should be simple, transparent, and available to everyone, regardless of location.
           </p>
           <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
             Our team of dedicated professionals works around the clock to ensure you receive the best possible care through secure digital channels.
           </p>
           <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 font-bold">
             <HeartPulse className="animate-pulse" />
             <span>Caring for you, always.</span>
           </div>
         </div>
         <div className="relative h-[400px]">
            <div className="absolute top-0 right-0 w-3/4 h-3/4 rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800 z-10 transform translate-x-4 -translate-y-4">
               {/* Indian Doctor Consultation */}
               <img 
                 src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80" 
                 alt="Indian Doctor Consultation"
                 className="w-full h-full object-cover"
               />
               <div className="absolute inset-0 bg-teal-900/10"></div>
            </div>
            <div className="absolute bottom-0 left-0 w-3/4 h-3/4 rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800 z-20 transform -translate-x-4 translate-y-4">
               {/* Professional Hospital */}
               <img 
                 src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80" 
                 alt="Professional Hospital"
                 className="w-full h-full object-cover"
               />
               <div className="absolute inset-0 bg-blue-900/10"></div>
            </div>
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
  ]);

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setCurrentView(
      role === UserRole.PATIENT
        ? ViewState.PATIENT_DASHBOARD
        : ViewState.DOCTOR_DASHBOARD
    );
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentView(ViewState.LANDING);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-500">
      <Navbar onNavigate={setCurrentView} isLoggedIn={!!userRole} onLogout={handleLogout} />

      {currentView === ViewState.LANDING && (
        <LandingPage headline={headline} onLogin={handleLogin} />
      )}
      
      {currentView === ViewState.PATIENT_DASHBOARD && <PatientDashboard />}
      {currentView === ViewState.DOCTOR_DASHBOARD && <DoctorDashboard />}

      {currentView === ViewState.LANDING && <Footer />}
    </div>
  );
}

export default App;