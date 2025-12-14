import React, { useState } from 'react';
import { 
  Users, Calendar, FileText, ClipboardList, Video, CreditCard, 
  CheckCircle, Menu, X
} from 'lucide-react';

interface ScheduleItem {
  id: number;
  patient: string;
  time: string;
  type: string;
  status: string;
  date?: string;
}

const MOCK_SCHEDULE: ScheduleItem[] = [
  { id: 1, patient: 'Rahul Verma', time: '09:00 AM', type: 'Video', status: 'Upcoming' },
  { id: 2, patient: 'Sarah Khan', time: '10:30 AM', type: 'In-Person', status: 'Pending' },
  { id: 3, patient: 'Amit Singh', time: '11:45 AM', type: 'Video', status: 'Upcoming' },
];

const MOCK_PATIENTS = [
  { id: 1, name: 'Rahul Verma', age: 34, condition: 'Fever' },
  { id: 2, name: 'Sarah Khan', age: 28, condition: 'Skin Allergy' },
];

type DoctorTab = 'schedule' | 'appointments' | 'create-prescription' | 'patients' | 'video' | 'payments';

export const DoctorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DoctorTab>('schedule');
  const [schedule, setSchedule] = useState<ScheduleItem[]>(MOCK_SCHEDULE);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleAction = (id: number, action: 'Accept' | 'Decline') => {
    // Mock logic
    if (action === 'Decline') {
      setSchedule(schedule.filter(s => s.id !== id));
    } else {
      setSchedule(schedule.map(s => s.id === id ? {...s, status: 'Upcoming'} : s));
    }
  };

  const SidebarItem = ({ id, icon: Icon, label, soon = false }: { id: DoctorTab, icon: any, label: string, soon?: boolean }) => (
    <button
      onClick={() => {
        setActiveTab(id);
        setIsSidebarOpen(false);
      }}
      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 group ${
        activeTab === id 
          ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm border border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon size={20} className={activeTab === id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300'} />
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
           <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Practice</h3>
           <div className="space-y-1">
             <SidebarItem id="schedule" icon={Calendar} label="My Schedule" />
             <SidebarItem id="appointments" icon={ClipboardList} label="Appointments" />
             <SidebarItem id="create-prescription" icon={FileText} label="Create Prescription" />
             <SidebarItem id="patients" icon={Users} label="My Patients" />
           </div>
        </div>
        
        <div className="mb-6 px-2">
           <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Developing</h3>
           <div className="space-y-1">
             <SidebarItem id="video" icon={Video} label="Video Consult" soon />
             <SidebarItem id="payments" icon={CreditCard} label="Payments" soon />
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

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Doctor Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Manage your practice efficiently.</p>

        {/* SCHEDULE TAB */}
        {activeTab === 'schedule' && (
          <div className="space-y-6 animate-fade-in">
             <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Today's Schedule</h2>
             <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors">
               {schedule.filter(s => s.status === 'Upcoming').length === 0 ? (
                 <p className="p-8 text-center text-gray-500 dark:text-gray-400">No upcoming appointments for today.</p>
               ) : (
                 <div className="divide-y divide-gray-100 dark:divide-gray-800">
                   {schedule.filter(s => s.status === 'Upcoming').map(s => (
                     <div key={s.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-bold">
                             {s.time.split(' ')[0]}
                           </div>
                           <div>
                             <h3 className="font-bold text-gray-900 dark:text-white">{s.patient}</h3>
                             <p className="text-sm text-gray-500 dark:text-gray-400">{s.type} Consultation</p>
                           </div>
                        </div>
                        <button className="text-sm bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors">Start Visit</button>
                     </div>
                   ))}
                 </div>
               )}
             </div>
          </div>
        )}

        {/* APPOINTMENTS (REQUESTS) TAB */}
        {activeTab === 'appointments' && (
          <div className="space-y-6 animate-fade-in">
             <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Appointment Requests</h2>
             <div className="grid gap-4">
                {schedule.filter(s => s.status === 'Pending').map(s => (
                  <div key={s.id} className="bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between transition-colors">
                     <div>
                       <h3 className="font-bold text-gray-900 dark:text-white">{s.patient}</h3>
                       <p className="text-sm text-gray-500 dark:text-gray-400">{s.date || 'Today'} at {s.time}</p>
                       <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded mt-2 inline-block">{s.type}</span>
                     </div>
                     <div className="flex gap-2">
                       <button onClick={() => handleAction(s.id, 'Decline')} className="px-3 py-1.5 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 rounded-lg text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">Decline</button>
                       <button onClick={() => handleAction(s.id, 'Accept')} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">Accept</button>
                     </div>
                  </div>
                ))}
                {schedule.filter(s => s.status === 'Pending').length === 0 && (
                   <div className="bg-white dark:bg-gray-900 p-8 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 text-center text-gray-400 dark:text-gray-500 transition-colors">
                     <CheckCircle size={48} className="mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                     <p>All caught up! No pending requests.</p>
                   </div>
                )}
             </div>
          </div>
        )}

        {/* CREATE PRESCRIPTION TAB */}
        {activeTab === 'create-prescription' && (
          <div className="max-w-2xl bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 animate-fade-in transition-colors">
             <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">Create New Prescription</h2>
             <form className="space-y-5">
               <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Patient Name</label>
                 <select className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                   {MOCK_PATIENTS.map(p => <option key={p.id}>{p.name}</option>)}
                 </select>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Drug Name</label>
                   <input type="text" className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Paracetamol" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dosage</label>
                   <input type="text" className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 500mg" />
                 </div>
               </div>
               
               <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Instructions</label>
                 <textarea className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg h-24 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Take twice a day after meals..."></textarea>
               </div>

               <button type="button" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-colors">
                 Generate & Send
               </button>
             </form>
          </div>
        )}

        {/* PATIENTS TAB */}
        {activeTab === 'patients' && (
           <div className="space-y-6 animate-fade-in">
             <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">My Patients</h2>
             <div className="grid md:grid-cols-2 gap-4">
               {MOCK_PATIENTS.map(p => (
                 <div key={p.id} className="bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold">
                        {p.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">{p.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Age: {p.age}</p>
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 bg-blue-50 dark:bg-blue-900/20 inline-block px-2 py-0.5 rounded">Condition: {p.condition}</p>
                      </div>
                    </div>
                    <button className="w-full mt-4 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 py-2 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">View History</button>
                 </div>
               ))}
             </div>
           </div>
        )}

        {/* COMING SOON */}
        {(['video', 'payments'] as const).includes(activeTab as any) && (
          <div className="flex flex-col items-center justify-center h-96 text-center animate-fade-in">
             <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-4 transition-colors">
               {activeTab === 'video' && <Video size={48} className="text-gray-400 dark:text-gray-500" />}
               {activeTab === 'payments' && <CreditCard size={48} className="text-gray-400 dark:text-gray-500" />}
             </div>
             <h2 className="text-xl font-bold text-gray-800 dark:text-white">Coming Soon</h2>
             <p className="text-gray-500 dark:text-gray-400 max-w-md">The {activeTab} feature is currently under development.</p>
          </div>
        )}

      </main>
    </div>
  );
};