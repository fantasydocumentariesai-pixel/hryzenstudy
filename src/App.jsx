import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  LogIn, LogOut, BookOpen, Sword, Shield, 
  Trophy, Upload, Sparkles, Scroll, ChevronRight, 
  Zap, Heart, Skull, Map, FileText, Loader2,
  Coins, SwordIcon, BrainCircuit
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  signInAnonymously,
  signInWithCustomToken
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  onSnapshot, 
  collection, 
  query 
} from 'firebase/firestore';

// --- FIREBASE CONFIGURATION (Replace with your actual keys) ---
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "hryzen-study.firebaseapp.com",
  projectId: "hryzen-study",
  storageBucket: "hryzen-study.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
const appId = typeof __app_id !== 'undefined' ? __app_id : 'hryzen-study-default';

// --- THEME DATA ---
const ADVENTURE_THEMES = [
  { name: 'Ancient Dungeon', color: 'bg-slate-900', secondary: 'border-slate-700', monster: 'Stone Golem', icon: '🏰' },
  { name: 'Enchanted Forest', color: 'bg-emerald-950', secondary: 'border-emerald-800', monster: 'Bramble Beast', icon: '🌲' },
  { name: 'Frozen Peaks', color: 'bg-cyan-950', secondary: 'border-cyan-800', monster: 'Frost Giant', icon: '❄️' },
  { name: 'Burning Sands', color: 'bg-orange-950', secondary: 'border-orange-800', monster: 'Fire Salamander', icon: '🔥' }
];

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('home'); // home, dashboard, quest, results
  const [stats, setStats] = useState({ xp: 0, gold: 0, level: 1, health: 100 });
  const [currentQuest, setCurrentQuest] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // --- Auth Effect ---
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        }
      } catch (err) {
        console.error("Auth error:", err);
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // --- Firestore Stats Sync ---
  useEffect(() => {
    if (!user) return;
    const statsDoc = doc(db, 'artifacts', appId, 'users', user.uid, 'stats');
    const unsubscribe = onSnapshot(statsDoc, (docSnap) => {
      if (docSnap.exists()) {
        setStats(docSnap.data());
      } else {
        setDoc(statsDoc, { xp: 0, gold: 0, level: 1, health: 100 });
      }
    }, (error) => console.error("Firestore sync error:", error));

    return () => unsubscribe();
  }, [user]);

  // --- Handlers ---
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      setView('dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => signOut(auth).then(() => setView('home'));

  const simulatePDFUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    // Simulate Processing Time
    setTimeout(() => {
      setIsUploading(false);
      startNewAdventure(file.name);
    }, 2500);
  };

  const startNewAdventure = (fileName) => {
    const theme = ADVENTURE_THEMES[Math.floor(Math.random() * ADVENTURE_THEMES.length)];
    const mockQuestions = [
      { q: "What is the primary concept discussed in " + fileName + "?", a: ["Concept A", "Concept B", "Concept C"], correct: 0 },
      { q: "How does the author define the 'Third Stage'?", a: ["Static", "Evolutionary", "Cyclical"], correct: 1 },
      { q: "Which variable is identified as the independent factor?", a: ["Temperature", "Mass", "Velocity"], correct: 2 }
    ];
    
    setCurrentQuest({
      fileName,
      theme,
      questions: mockQuestions,
      currentIdx: 0,
      damageDealt: 0,
      maxHp: 100,
      monsterHp: 100
    });
    setView('quest');
  };

  const handleAnswer = (idx) => {
    if (!currentQuest) return;
    
    const isCorrect = idx === currentQuest.questions[currentQuest.currentIdx].correct;
    
    if (isCorrect) {
      const newMonsterHp = Math.max(0, currentQuest.monsterHp - 34);
      setCurrentQuest(prev => ({ 
        ...prev, 
        monsterHp: newMonsterHp,
        currentIdx: prev.currentIdx + 1
      }));
      
      if (currentQuest.currentIdx >= currentQuest.questions.length - 1) {
        finishQuest(true);
      }
    } else {
      setStats(prev => ({ ...prev, health: Math.max(0, prev.health - 20) }));
      setCurrentQuest(prev => ({ 
        ...prev, 
        currentIdx: prev.currentIdx + 1 
      }));

      if (currentQuest.currentIdx >= currentQuest.questions.length - 1) {
        finishQuest(false);
      }
    }
  };

  const finishQuest = (won) => {
    if (won) {
      const rewardXp = 50;
      const rewardGold = 25;
      const newXp = stats.xp + rewardXp;
      const newLevel = Math.floor(newXp / 100) + 1;
      
      const statsDoc = doc(db, 'artifacts', appId, 'users', user.uid, 'stats');
      setDoc(statsDoc, { 
        ...stats, 
        xp: newXp, 
        gold: stats.gold + rewardGold, 
        level: newLevel 
      });
    }
    setView('results');
  };

  // --- Components ---
  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-indigo-600 w-12 h-12" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 transition-colors duration-500">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
            <div className="bg-indigo-600 p-2 rounded-lg">
              <BrainCircuit className="text-white w-6 h-6" />
            </div>
            <span className="font-bold text-xl tracking-tight">HryzenStudy</span>
          </div>
          
          <div className="flex items-center gap-6">
            {user && (
              <div className="hidden md:flex items-center gap-4 text-sm font-medium text-slate-600">
                <span className="flex items-center gap-1"><Zap className="w-4 h-4 text-amber-500 fill-amber-500" /> LVL {stats.level}</span>
                <span className="flex items-center gap-1"><Coins className="w-4 h-4 text-yellow-500" /> {stats.gold}g</span>
              </div>
            )}
            {user ? (
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            ) : (
              <button 
                onClick={handleLogin}
                className="bg-indigo-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-200"
              >
                <LogIn className="w-4 h-4" /> Get Started
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 py-12">
        
        {/* VIEW: HOME */}
        {view === 'home' && !user && (
          <div className="text-center py-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <h1 className="text-6xl font-black text-slate-900 mb-6 leading-tight">
              Turn your notes into <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Legendary Quests.</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
              HryzenStudy uses AI to transform boring PDFs into DnD adventures. 
              Slay study monsters, level up your character, and master your subjects.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={handleLogin}
                className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-xl shadow-indigo-100 flex items-center gap-3"
              >
                Start Your Journey <Sword className="w-5 h-5" />
              </button>
              <button className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-colors">
                View Demo
              </button>
            </div>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <FeatureCard icon={<Scroll />} title="Drop a PDF" desc="Upload any study guide, textbook chapter, or lecture notes." />
              <FeatureCard icon={<Sparkles />} title="AI Questmaster" desc="Our AI generates a unique DnD campaign based on your content." />
              <FeatureCard icon={<Trophy />} title="Earn Loot" desc="Pass quizzes to earn gold and level up your character profile." />
            </div>
          </div>
        )}

        {/* VIEW: DASHBOARD */}
        {(view === 'dashboard' || (view === 'home' && user)) && (
          <div className="animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Your Library</h2>
              <div className="relative">
                <input 
                  type="file" 
                  accept=".pdf" 
                  onChange={simulatePDFUpload}
                  className="hidden" 
                  id="pdf-upload" 
                  disabled={isUploading}
                />
                <label 
                  htmlFor="pdf-upload"
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold cursor-pointer transition-all ${isUploading ? 'bg-slate-200 text-slate-400' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100'}`}
                >
                  {isUploading ? <Loader2 className="animate-spin w-5 h-5" /> : <Upload className="w-5 h-5" />}
                  {isUploading ? "Reading Tome..." : "New Study Quest"}
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center text-slate-400 group hover:border-indigo-300 transition-colors cursor-pointer">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="w-8 h-8" />
                </div>
                <p className="font-semibold">Drag & Drop PDF here</p>
                <p className="text-xs">Limit 50MB</p>
              </div>
              
              {/* Mock List */}
              <QuestItem title="Biology: Cellular Respiration" date="2 days ago" score="85%" />
              <QuestItem title="World History: Ottoman Empire" date="Yesterday" score="N/A" isNew />
            </div>
          </div>
        )}

        {/* VIEW: QUEST (DND ADVENTURE) */}
        {view === 'quest' && currentQuest && (
          <div className={`fixed inset-0 z-[100] ${currentQuest.theme.color} text-white flex flex-col p-6 animate-in zoom-in-95 duration-500`}>
            <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
              {/* Game Header */}
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-3">
                  <div className="bg-white/10 p-3 rounded-full border border-white/20">
                    <Map className="w-6 h-6 text-indigo-300" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl uppercase tracking-widest">{currentQuest.theme.name}</h3>
                    <p className="text-sm opacity-60">Objective: Defeat the {currentQuest.theme.monster}</p>
                  </div>
                </div>
                <button onClick={() => setView('dashboard')} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Monster Battle Area */}
              <div className="flex-1 flex flex-col items-center justify-center gap-12">
                <div className="relative text-center">
                  <div className="text-9xl mb-4 drop-shadow-2xl animate-bounce">{currentQuest.theme.icon}</div>
                  <h4 className="text-3xl font-black mb-2 uppercase italic">{currentQuest.theme.monster}</h4>
                  
                  {/* Monster HP Bar */}
                  <div className="w-64 h-4 bg-white/10 rounded-full overflow-hidden border border-white/20 mx-auto">
                    <div 
                      className="h-full bg-red-500 transition-all duration-1000 ease-out" 
                      style={{ width: `${currentQuest.monsterHp}%` }}
                    />
                  </div>
                  <p className="text-xs mt-2 font-mono uppercase tracking-tighter opacity-50">Enemy HP: {currentQuest.monsterHp}/100</p>
                </div>

                {/* Question Box */}
                <div className={`w-full max-w-2xl bg-white/5 backdrop-blur-xl border-2 ${currentQuest.theme.secondary} rounded-3xl p-8 shadow-2xl relative`}>
                  <div className="absolute -top-4 left-8 bg-indigo-500 px-4 py-1 rounded-full text-xs font-bold uppercase">Trial {currentQuest.currentIdx + 1} of {currentQuest.questions.length}</div>
                  
                  <h2 className="text-2xl font-bold mb-8 leading-relaxed">
                    {currentQuest.questions[currentQuest.currentIdx].q}
                  </h2>
                  
                  <div className="grid gap-4">
                    {currentQuest.questions[currentQuest.currentIdx].a.map((ans, i) => (
                      <button 
                        key={i}
                        onClick={() => handleAnswer(i)}
                        className="group flex items-center justify-between w-full p-4 rounded-2xl bg-white/10 border border-white/10 hover:bg-white/20 hover:border-white/30 transition-all text-left"
                      >
                        <span className="font-medium">{ans}</span>
                        <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Player Stats Footer */}
              <div className="mt-auto h-20 flex items-center justify-between border-t border-white/10 pt-4">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center border-2 border-white/20 overflow-hidden">
                      <img src={user.photoURL} alt="Hero" className="w-full h-full object-cover" />
                   </div>
                   <div>
                     <p className="font-bold text-sm">{user.displayName}</p>
                     <div className="flex gap-1">
                        {[1,2,3,4,5].map(h => (
                          <Heart key={h} className={`w-4 h-4 ${stats.health >= h * 20 ? 'text-red-500 fill-red-500' : 'text-white/20'}`} />
                        ))}
                     </div>
                   </div>
                </div>
                <div className="flex items-center gap-6">
                   <StatIcon icon={<SwordIcon className="w-4 h-4" />} label="ATK" value="34" />
                   <StatIcon icon={<Shield className="w-4 h-4" />} label="DEF" value="20" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: RESULTS */}
        {view === 'results' && (
          <div className="text-center py-20 animate-in zoom-in-95 duration-500 max-w-md mx-auto">
            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
               <Trophy className="w-12 h-12 text-indigo-600" />
            </div>
            <h2 className="text-4xl font-black mb-2">QUEST COMPLETE!</h2>
            <p className="text-slate-500 mb-10">You have successfully mastered the lore of your study notes.</p>
            
            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <p className="text-xs uppercase font-bold text-slate-400 mb-1">XP Earned</p>
                <p className="text-2xl font-black text-indigo-600">+50</p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <p className="text-xs uppercase font-bold text-slate-400 mb-1">Gold Looted</p>
                <p className="text-2xl font-black text-amber-500">+25</p>
              </div>
            </div>

            <button 
              onClick={() => setView('dashboard')}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all"
            >
              Return to Tavern
            </button>
          </div>
        )}
      </main>

      {/* Decorative Blur */}
      <div className="fixed top-0 right-0 -z-10 w-96 h-96 bg-indigo-200/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="fixed bottom-0 left-0 -z-10 w-96 h-96 bg-violet-200/20 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2" />
    </div>
  );
}

// --- Helper Components ---

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
      <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function QuestItem({ title, date, score, isNew }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group cursor-pointer relative overflow-hidden">
      {isNew && <div className="absolute top-4 right-4 bg-indigo-600 text-[10px] text-white px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">New</div>}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
          <BookOpen className="w-6 h-6 text-slate-400 group-hover:text-indigo-600" />
        </div>
        <div>
          <h4 className="font-bold text-slate-800 line-clamp-1">{title}</h4>
          <p className="text-xs text-slate-400">{date}</p>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between">
        <span className="text-xs font-bold text-slate-400">Score: <span className={score === 'N/A' ? 'text-slate-300' : 'text-indigo-600'}>{score}</span></span>
        <button className="text-indigo-600 font-bold text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">
          Play <PlayCircle className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function StatIcon({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2">
      <div className="text-indigo-400">{icon}</div>
      <div>
        <p className="text-[10px] font-bold uppercase opacity-50 leading-none">{label}</p>
        <p className="text-sm font-black leading-none">{value}</p>
      </div>
    </div>
  );
}

// --- VITE ENTRY POINT ---
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
