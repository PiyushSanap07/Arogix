import React, { useState, useRef, useEffect } from 'react';
import { 
  User, Calendar, FileText, MessageSquare, Video, CreditCard, Activity, 
  Clock, Edit, Plus, Menu, X, Bot, Send, Download, Loader2
} from 'lucide-react';
import { jsPDF } from "jspdf";
import { Doctor, Message } from '../types';
import { sendMessageToAi } from '../services/geminiService';

// Real Indian Doctors
const MOCK_DOCTORS: Doctor[] = [
  { id: '1', name: 'Dr. Aarav Patel', specialty: 'Cardiologist', rating: 4.9, experience: '12 years', available: true, image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=300&q=80' },
  { id: '2', name: 'Dr. Priya Sharma', specialty: 'Dermatologist', rating: 4.8, experience: '8 years', available: true, image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=300&q=80' },
  { id: '3', name: 'Dr. Rohan Gupta', specialty: 'General Physician', rating: 4.7, experience: '15 years', available: false, image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=300&q=80' },
  { id: '4', name: 'Dr. Ananya Singh', specialty: 'Pediatrician', rating: 5.0, experience: '10 years', available: true, image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80' },
];

const MOCK_APPOINTMENTS = [
  { id: 1, doctor: 'Dr. Aarav Patel', date: '2023-10-25', time: '10:00 AM', status: 'Upcoming' },
  { id: 2, doctor: 'Dr. Priya Sharma', date: '2023-10-28', time: '02:00 PM', status: 'Pending' },
];

const MOCK_PRESCRIPTIONS = [
  { id: 1, doctor: 'Dr. Aarav Patel', date: '2023-09-15', meds: ['Aspirin 75mg', 'Atorvastatin 10mg'] },
  { id: 2, doctor: 'Dr. Rohan Gupta', date: '2023-08-01', meds: ['Paracetamol 500mg'] },
];

type PatientTab = 'profile' | 'appointments' | 'prescriptions' | 'symptom_checker' | 'chat' | 'video' | 'payments' | 'insights';

export const PatientDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PatientTab>('profile');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS);
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // AI Symptom Checker State
  const [chatMessages, setChatMessages] = useState<Message[]>([
    { id: '0', role: 'model', text: 'Namaste! I am your Arogix Health Assistant. Please describe your symptoms, and I will help you understand what they might mean and which specialist to consult.', timestamp: new Date() }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Profile State
  const [profile, setProfile] = useState({
    name: 'Vikram Malhotra',
    age: '32',
    gender: 'Male',
    contact: '+91 98765 43210',
    history: 'Hypertension, Dust Allergy',
  });

  useEffect(() => {
    if (activeTab === 'symptom_checker') {
      scrollToBottom();
    }
  }, [chatMessages, activeTab]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Simple Booking Logic
  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const doctor = (form.elements.namedItem('doctor') as HTMLSelectElement).value;
    const date = (form.elements.namedItem('date') as HTMLInputElement).value;
    const time = (form.elements.namedItem('time') as HTMLInputElement).value;
    
    setAppointments([...appointments, { id: Date.now(), doctor, date, time, status: 'Upcoming' }]);
    setBookModalOpen(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsAiLoading(true);

    const responseText = await sendMessageToAi(inputMessage);

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, aiMsg]);
    setIsAiLoading(false);
  };

  const handleDownloadPDF = (prescription: typeof MOCK_PRESCRIPTIONS[0]) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(13, 148, 136); // Teal color
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("Arogix Telemedicine", 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text("Digital Prescription", 105, 30, { align: 'center' });

    // Doctor Info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text(`Doctor: ${prescription.doctor}`, 20, 60);
    doc.text(`Date: ${prescription.date}`, 150, 60);

    // Patient Info
    doc.text(`Patient: ${profile.name}`, 20, 70);
    doc.text(`Age: ${profile.age}`, 20, 80);

    doc.setLineWidth(0.5);
    doc.line(20, 85, 190, 85);

    // Medicines
    doc.setFontSize(16);
    doc.text("Prescribed Medications:", 20, 100);
    
    doc.setFontSize(12);
    let yPos = 110;
    prescription.meds.forEach((med) => {
      doc.text(`• ${med}`, 25, yPos);
      yPos += 10;
    });

    // Disclaimer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("This is a digital prescription generated via Arogix Telemedicine Platform.", 105, 280, { align: 'center' });
    doc.text("Valid for 30 days from date of issue.", 105, 285, { align: 'center' });

    doc.save(`Prescription_${prescription.date}.pdf`);
  };

  const SidebarItem = ({ id, icon: Icon, label, soon = false }: { id: PatientTab, icon: any, label: string, soon?: boolean }) => (
    <button
      onClick={() => {
        setActiveTab(id);
        setIsSidebarOpen(false);
      }}
      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 group ${
        activeTab === id 
          ? 'bg-teal-50 text-teal-700 font-semibold shadow-sm border border-teal-100 dark:bg-teal-900/20 dark:text-teal-400 dark:border-teal-800' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
      }`}
    >
      <div className="flex items-center gap-3 text-left">
        <Icon size={20} className={activeTab === id ? 'text-teal-600 dark:text-teal-400' : 'text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300'} />
        <span>{label}</span>
      </div>
      {soon && <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded dark:bg-gray-800 dark:text-gray-400">Soon</span>}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 pt-24 transition-colors duration-300 relative">
      
      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed top-[72px] bottom-0 left-0 z-40 w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 overflow-y-auto px-4 py-6 shadow-xl lg:shadow-none transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:fixed lg:inset-y-0 lg:top-24 lg:left-0 lg:z-10 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-6 px-2 flex justify-between items-center lg:hidden">
          <span className="font-bold text-gray-900 dark:text-white">Menu</span>
          <button onClick={() => setIsSidebarOpen(false)} className="text-gray-500">
            <X size={20} />
          </button>
        </div>

        <div className="mb-6 px-2">
           <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Menu</h3>
           <div className="space-y-1">
             <SidebarItem id="profile" icon={User} label="My Profile" />
             <SidebarItem id="appointments" icon={Calendar} label="Appointments" />
             <SidebarItem id="prescriptions" icon={FileText} label="Prescriptions" />
             <SidebarItem id="chat" icon={MessageSquare} label="Doctor Chat" />
             <SidebarItem id="symptom_checker" icon={Bot} label="AI Symptom Checker" />
           </div>
        </div>
        
        <div className="mb-6 px-2">
           <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Developing</h3>
           <div className="space-y-1">
             <SidebarItem id="video" icon={Video} label="Video Consult" soon />
             <SidebarItem id="payments" icon={CreditCard} label="Payments" soon />
             <SidebarItem id="insights" icon={Activity} label="Health Insights" soon />
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 p-6 lg:p-10 max-w-5xl mx-auto w-full">
        {/* Mobile Sidebar Toggle */}
        <div className="lg:hidden mb-6">
           <button 
             onClick={() => setIsSidebarOpen(!isSidebarOpen)}
             className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-semibold bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
           >
             <Menu size={20} />
             <span>Dashboard Menu</span>
           </button>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Namaste, {profile.name}!</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Welcome to your patient dashboard.</p>

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 max-w-2xl animate-fade-in transition-colors">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">My Profile</h2>
              <button 
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 flex items-center gap-2 text-sm font-medium"
              >
                <Edit size={16} /> {isEditingProfile ? 'Save Changes' : 'Edit Profile'}
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center gap-6 mb-6">
                <div className="w-20 h-20 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center text-teal-600 dark:text-teal-400 text-2xl font-bold">
                  {profile.name.charAt(0)}
                </div>
                <div>
                   <h3 className="font-bold text-lg text-gray-900 dark:text-white">{profile.name}</h3>
                   <p className="text-gray-500 dark:text-gray-400">Patient ID: #PAT-8832</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Full Name</label>
                  {isEditingProfile ? (
                    <input type="text" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none" />
                  ) : <p className="font-medium text-gray-900 dark:text-gray-200">{profile.name}</p>}
                </div>
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Age</label>
                  {isEditingProfile ? (
                    <input type="text" value={profile.age} onChange={(e) => setProfile({...profile, age: e.target.value})} className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none" />
                  ) : <p className="font-medium text-gray-900 dark:text-gray-200">{profile.age}</p>}
                </div>
                 <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Gender</label>
                  {isEditingProfile ? (
                    <input type="text" value={profile.gender} onChange={(e) => setProfile({...profile, gender: e.target.value})} className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none" />
                  ) : <p className="font-medium text-gray-900 dark:text-gray-200">{profile.gender}</p>}
                </div>
                 <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Contact</label>
                  {isEditingProfile ? (
                    <input type="text" value={profile.contact} onChange={(e) => setProfile({...profile, contact: e.target.value})} className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none" />
                  ) : <p className="font-medium text-gray-900 dark:text-gray-200">{profile.contact}</p>}
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Medical History</label>
                {isEditingProfile ? (
                    <textarea value={profile.history} onChange={(e) => setProfile({...profile, history: e.target.value})} className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none" />
                  ) : <p className="font-medium text-gray-900 dark:text-gray-200">{profile.history}</p>}
              </div>
            </div>
          </div>
        )}

        {/* AI SYMPTOM CHECKER TAB */}
        {activeTab === 'symptom_checker' && (
           <div className="h-[650px] flex flex-col bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden animate-fade-in transition-colors">
              <div className="bg-gradient-to-r from-teal-600 to-teal-800 p-4 text-white flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                      <Bot size={24} className="text-white" />
                   </div>
                   <div>
                     <h2 className="font-bold text-lg">AI Health Assistant</h2>
                     <p className="text-xs text-teal-100">Powered by Gemini AI • Always verify with a doctor</p>
                   </div>
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-950/50">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                     <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                       msg.role === 'user' 
                         ? 'bg-teal-600 text-white rounded-br-none' 
                         : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-bl-none'
                     }`}>
                        {msg.role === 'model' && (
                          <div className="flex items-center gap-2 mb-2 border-b border-gray-100 dark:border-gray-700 pb-2">
                             <Bot size={14} className="text-teal-600 dark:text-teal-400" />
                             <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase">Arogix AI</span>
                          </div>
                        )}
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                        <span className={`text-[10px] block mt-2 opacity-70 ${msg.role === 'user' ? 'text-teal-100' : 'text-gray-400'}`}>
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                     </div>
                  </div>
                ))}
                {isAiLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-bl-none border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-2">
                       <Loader2 size={16} className="animate-spin text-teal-600" />
                       <span className="text-sm text-gray-500 dark:text-gray-400">Analyzing symptoms...</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                 <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input 
                      type="text" 
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Describe your symptoms (e.g., 'I have a severe headache and nausea')..." 
                      className="flex-1 p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <button 
                      type="submit" 
                      disabled={isAiLoading || !inputMessage.trim()}
                      className="bg-teal-600 text-white p-3 rounded-xl hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send size={20} />
                    </button>
                 </form>
                 <p className="text-xs text-center text-gray-400 mt-2">
                   Disclaimer: AI responses are for informational purposes only and do not constitute a medical diagnosis. In emergencies, call 112 immediately.
                 </p>
              </div>
           </div>
        )}

        {/* APPOINTMENTS TAB */}
        {activeTab === 'appointments' && (
          <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">My Appointments</h2>
                <button 
                  onClick={() => setBookModalOpen(true)}
                  className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-teal-700 transition-colors shadow-lg shadow-teal-500/20"
                >
                  <Plus size={18} /> Book New
                </button>
             </div>

             {/* Appointment List */}
             <div className="grid gap-4">
               {appointments.map(apt => (
                 <div key={apt.id} className="bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="bg-teal-50 dark:bg-teal-900/30 p-3 rounded-lg text-teal-600 dark:text-teal-400">
                        <Calendar size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">{apt.doctor}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                           <Clock size={14}/> {apt.date} at {apt.time}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${apt.status === 'Upcoming' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                      {apt.status}
                    </span>
                 </div>
               ))}
             </div>

             {/* Simple Booking Modal */}
             {bookModalOpen && (
               <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                 <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-700">
                   <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Book Appointment</h3>
                   <form onSubmit={handleBook} className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Select Doctor</label>
                        <select name="doctor" className="w-full p-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                          {MOCK_DOCTORS.map(d => <option key={d.id} value={d.name}>{d.name} ({d.specialty})</option>)}
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Date</label>
                          <input type="date" name="date" required className="w-full p-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500" />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Time</label>
                          <input type="time" name="time" required className="w-full p-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500" />
                        </div>
                      </div>
                      <div className="flex gap-3 pt-4">
                        <button type="button" onClick={() => setBookModalOpen(false)} className="flex-1 py-2 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cancel</button>
                        <button type="submit" className="flex-1 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">Confirm</button>
                      </div>
                   </form>
                 </div>
               </div>
             )}
          </div>
        )}

        {/* PRESCRIPTIONS TAB */}
        {activeTab === 'prescriptions' && (
          <div className="space-y-6 animate-fade-in">
             <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">My Prescriptions</h2>
             <div className="grid gap-4">
               {MOCK_PRESCRIPTIONS.map(pre => (
                 <div key={pre.id} className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
                    <div className="flex justify-between items-start mb-4">
                       <div>
                         <h3 className="font-bold text-gray-900 dark:text-white">{pre.doctor}</h3>
                         <p className="text-sm text-gray-500 dark:text-gray-400">Prescribed on: {pre.date}</p>
                       </div>
                       <FileText className="text-teal-600 dark:text-teal-400" />
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Medications</p>
                      <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
                        {pre.meds.map((m, i) => <li key={i}>{m}</li>)}
                      </ul>
                    </div>
                    <button 
                      onClick={() => handleDownloadPDF(pre)}
                      className="mt-4 text-teal-600 dark:text-teal-400 text-sm font-medium hover:underline flex items-center gap-1"
                    >
                      <Download size={14} /> Download PDF
                    </button>
                 </div>
               ))}
             </div>
          </div>
        )}

        {/* CHAT TAB */}
        {activeTab === 'chat' && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 h-[600px] flex flex-col animate-fade-in transition-colors">
             <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 rounded-t-2xl">
               <h2 className="font-bold text-gray-800 dark:text-white">Doctor Chat</h2>
               <p className="text-xs text-gray-500 dark:text-gray-400">Direct message your specialists</p>
             </div>
             <div className="flex-1 p-6 flex items-center justify-center flex-col text-center">
                <div className="bg-teal-50 dark:bg-teal-900/30 p-4 rounded-full mb-4">
                   <MessageSquare size={32} className="text-teal-600 dark:text-teal-400" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white">Start a Conversation</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-xs mb-6">Select a doctor from your appointment history to start a secure chat.</p>
                
                <div className="w-full max-w-sm space-y-3">
                   {MOCK_DOCTORS.slice(0, 2).map(d => (
                     <button key={d.id} className="w-full flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left bg-white dark:bg-gray-900">
                        <img src={d.image} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                           <p className="font-semibold text-sm text-gray-900 dark:text-white">{d.name}</p>
                           <p className="text-xs text-teal-600 dark:text-teal-400">{d.specialty}</p>
                        </div>
                        <span className="ml-auto text-green-500 text-xs">● Online</span>
                     </button>
                   ))}
                </div>
             </div>
          </div>
        )}

        {/* COMING SOON TABS */}
        {(['video', 'payments', 'insights'] as const).includes(activeTab as any) && (
          <div className="flex flex-col items-center justify-center h-96 text-center animate-fade-in">
             <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-4 transition-colors">
               {activeTab === 'video' && <Video size={48} className="text-gray-400 dark:text-gray-500" />}
               {activeTab === 'payments' && <CreditCard size={48} className="text-gray-400 dark:text-gray-500" />}
               {activeTab === 'insights' && <Activity size={48} className="text-gray-400 dark:text-gray-500" />}
             </div>
             <h2 className="text-xl font-bold text-gray-800 dark:text-white">Coming Soon</h2>
             <p className="text-gray-500 dark:text-gray-400 max-w-md">The {activeTab} feature is currently under development. Stay tuned for updates!</p>
          </div>
        )}

      </main>
    </div>
  );
};