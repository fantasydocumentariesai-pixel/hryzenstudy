import React, { useState, useEffect, createContext, useContext, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithCustomToken, 
  signInAnonymously, 
  GoogleAuthProvider, 
  signInWithPopup, 
  onAuthStateChanged, 
  signOut 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  onSnapshot, 
  query, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  Timestamp 
} from 'firebase/firestore';
import { 
  BookOpen, 
  Sword, 
  Shield, 
  Upload, 
  User, 
  LogOut, 
  Plus, 
  ChevronRight, 
  Brain, 
  Trophy, 
  FileText,
  Loader2,
  Heart,
  Zap,
  CheckCircle2,
  XCircle,
  Sparkles,
  Map as MapIcon,
  Globe,
  Lock,
  ArrowRight
} from 'lucide-react';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCHEljnX6Jth5aSudsr-TkEj6DGCK547uo",
  authDomain: "hryzenstudy.firebaseapp.com",
  projectId: "hryzenstudy",
  storageBucket: "hryzenstudy.firebasestorage.app",
  messagingSenderId: "407403275300",
  appId: "1:407403275300:web:1daa36c1b726967e1824b1",
  measurementId: "G-ZV1LLLQ4TJ"
};

const PDFJS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
const PDFJS_WORKER_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// --- COMPONENTS ---

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, loading = false }) => {
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 active:scale-[0.98]',
    secondary: 'bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 active:scale-[0.98]',
    danger: 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20',
    ghost: 'hover:bg-white/5 text-slate-400 hover:text-white',
    white: 'bg-white hover:bg-slate-100 text-slate-950 font-semibold'
  };
  
  return (
    <button 
      disabled={disabled || loading}
      onClick={onClick}
      className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 ${variants[variant]} ${className}`}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : children}
    </button>
  );
};

const Card = ({ children, className = "" }) => (
  <div className={`bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 ${className}`}>
    {children}
  </div>
);

// --- VIEWS ---

const Landing = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);

  const handleLoginClick = async () => {
    setLoading(true);
    await onLogin();
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Abstract Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
      </div>

      <div className="relative z-10 w-full max-w-[1000px] grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side: Brand Narrative */}
        <div className="hidden lg:block space-y-8 pr-8">
          <div className="flex items-center gap-3 text-indigo-400">
            <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
              <Brain className="w-6 h-6" />
            </div>
            <span className="font-bold tracking-[0.2em] text-sm uppercase">Neural Learning Protocol</span>
          </div>
          
          <h1 className="text-6xl font-extrabold text-white leading-[1.1] tracking-tight">
            Master your knowledge through <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">active combat.</span>
          </h1>
          
          <p className="text-lg text-slate-400 leading-relaxed max-w-md">
            Hryzen Study utilizes procedural generation to turn your static academic files into dynamic tactical encounters.
          </p>

          <div className="flex items-center gap-6 pt-4">
             <div className="flex flex-col">
                <span className="text-white font-bold text-xl">98%</span>
                <span className="text-slate-500 text-xs uppercase font-semibold">Retention Rate</span>
             </div>
             <div className="w-px h-8 bg-slate-800" />
             <div className="flex flex-col">
                <span className="text-white font-bold text-xl">1.2M+</span>
                <span className="text-slate-500 text-xs uppercase font-semibold">Nodes Cleared</span>
             </div>
          </div>
        </div>

        {/* Right Side: Login Card */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 lg:p-10 shadow-2xl shadow-black/50">
            <div className="text-center space-y-2 mb-10">
              <div className="lg:hidden flex justify-center mb-6">
                <div className="p-3 bg-indigo-600 rounded-2xl">
                  <Brain className="w-10 h-10 text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white">System Access</h2>
              <p className="text-slate-500 text-sm">Please authenticate to access your knowledge vault</p>
            </div>

            <div className="space-y-4">
              <Button 
                onClick={handleLoginClick} 
                variant="white" 
                loading={loading}
                className="w-full py-4 text-base shadow-xl"
              >
                {!loading && <img src="https://www.google.com/favicon.ico" className="w-4 h-4 mr-1" alt="Google" />}
                Sign in with Google
              </Button>
              
              <div className="flex items-center gap-3 py-2">
                <div className="flex-1 h-px bg-slate-800" />
                <span className="text-slate-600 text-[10px] uppercase font-bold tracking-widest">or</span>
                <div className="flex-1 h-px bg-slate-800" />
              </div>

              <Button 
                onClick={handleLoginClick} 
                variant="secondary" 
                className="w-full py-3 opacity-60 hover:opacity-100"
              >
                Continue as Guest
              </Button>
            </div>

            <div className="mt-10 pt-6 border-t border-white/5 space-y-4">
              <div className="flex items-center gap-3 text-slate-500 text-xs">
                <Lock className="w-3 h-3" />
                <span>Encrypted end-to-end synchronization</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500 text-xs">
                <Globe className="w-3 h-3" />
                <span>Global mastery leaderboards</span>
              </div>
            </div>
          </div>
          
          <p className="text-center mt-8 text-slate-600 text-xs uppercase tracking-widest font-semibold">
            V 2.4.0-BETA // HRYZEN SYSTEMS
          </p>
        </div>
      </div>
    </div>
  );
};

const Sidebar = ({ activeTab, setActiveTab, user, onLogout }) => {
  const tabs = [
    { id: 'dashboard', icon: MapIcon, label: 'Dashboard' },
    { id: 'library', icon: BookOpen, label: 'Library' },
    { id: 'quests', icon: Sword, label: 'Quests' },
    { id: 'stats', icon: Trophy, label: 'Progress' }
  ];

  return (
    <aside className="w-64 border-r border-white/5 flex flex-col h-screen bg-[#020617] sticky top-0">
      <div className="p-8 flex items-center gap-3">
        <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-white tracking-tight">Hryzen</span>
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === tab.id ? 'bg-indigo-600/10 text-indigo-400 font-semibold' : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
            }`}
          >
            <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-indigo-400' : 'text-slate-500'}`} />
            <span className="text-sm">{tab.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6">
        <div className="bg-slate-900/50 rounded-2xl p-4 border border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-white/10 overflow-hidden">
              {user?.photoURL ? <img src={user.photoURL} alt="Profile" /> : <User className="w-5 h-5 text-slate-500" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate leading-none mb-1">{user?.displayName || 'Adventurer'}</p>
              <p className="text-[10px] text-slate-500 font-mono tracking-tighter">LVL 04 INITIATE</p>
            </div>
          </div>
          <Button onClick={onLogout} variant="ghost" className="w-full justify-center text-xs py-2 bg-white/5">
            <LogOut className="w-3 h-3" /> Disconnect
          </Button>
        </div>
      </div>
    </aside>
  );
};

const Dashboard = ({ notes, quests, setActiveTab }) => {
  const stats = [
    { label: 'Notes Uploaded', value: notes.length, icon: FileText, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Quests Cleared', value: quests.filter(q => q.status === 'completed').length, icon: Trophy, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    { label: 'Accuracy', value: '88%', icon: Shield, color: 'text-emerald-400', bg: 'bg-emerald-400/10' }
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white tracking-tight">Nexus Center</h1>
          <p className="text-slate-400 font-medium italic">"The library is the mind's armory."</p>
        </div>
        <div className="flex gap-2">
           <div className="px-4 py-2 bg-slate-900 rounded-xl border border-white/5 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-300">CORE STATUS: STABLE</span>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="flex flex-col gap-4 border-white/5">
            <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
              <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <Zap className="w-5 h-5 text-indigo-400" />
            Recent Artifacts
          </h2>
          <Button variant="ghost" className="text-xs font-bold uppercase" onClick={() => setActiveTab('library')}>Enter Vault</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.slice(0, 3).map((note) => (
            <Card key={note.id} className="group hover:border-indigo-500/30 transition-all cursor-pointer relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="flex items-start justify-between">
                <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                  <FileText className="w-6 h-6 text-indigo-400" />
                </div>
              </div>
              <h3 className="mt-4 font-bold text-white group-hover:text-indigo-400 transition-colors">{note.name}</h3>
              <p className="text-sm text-slate-500 mt-2 line-clamp-2 leading-relaxed">{note.excerpt || "No description available."}</p>
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-black px-2 py-1 bg-slate-800 text-slate-400 rounded-md uppercase tracking-wider">
                  {note.type || 'PDF'}
                </span>
                <span className="text-[10px] font-mono text-slate-600">
                  {note.createdAt?.toDate().toLocaleDateString()}
                </span>
              </div>
            </Card>
          ))}
          {notes.length === 0 && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-3xl text-slate-500 bg-slate-900/20">
              <Upload className="w-12 h-12 mb-4 opacity-20" />
              <p className="font-medium">The vault is currently empty.</p>
              <Button onClick={() => setActiveTab('library')} variant="secondary" className="mt-6 px-8">Process First PDF</Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

const Library = ({ notes, user, onUpload }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.includes('pdf')) return;
    
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const typedArray = new Uint8Array(event.target.result);
        if (!window.pdfjsLib) {
          const script = document.createElement('script');
          script.src = PDFJS_URL;
          document.head.appendChild(script);
          await new Promise(r => script.onload = r);
        }
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
        const pdf = await window.pdfjsLib.getDocument(typedArray).promise;
        let fullText = "";
        const maxPages = Math.min(pdf.numPages, 5);
        for (let i = 1; i <= maxPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          fullText += content.items.map(item => item.str).join(" ") + " ";
        }
        const questions = generateQuestionsFromText(fullText);
        await onUpload({
          name: file.name,
          content: fullText,
          questions: questions,
          excerpt: fullText.substring(0, 150) + "...",
          createdAt: Timestamp.now()
        });
        setUploading(false);
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  const generateQuestionsFromText = (text) => {
    const sentences = text.split(/[.!?]/).filter(s => s.length > 30);
    const mockQuestions = sentences.slice(0, 10).map((s, i) => {
      const words = s.trim().split(' ');
      const subject = words[0];
      return {
        id: `q-${i}`,
        type: 'multiple-choice',
        question: `Based on the data provided, what is the significance of: "...${words.slice(0, 5).join(' ')}..."?`,
        options: [
          `It defines the core logic of ${words[Math.floor(words.length/2)]}`,
          `It serves as a prerequisite for ${subject}`,
          `It represents an edge case in the dataset`,
          `Information insufficient for synthesis`
        ],
        answer: 0,
        difficulty: i % 3 === 0 ? 'hard' : 'normal'
      };
    });
    return mockQuestions;
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Artifact Vault</h1>
          <p className="text-slate-400 mt-2 font-medium">Manage and synchronize your knowledge sources.</p>
        </div>
        <div className="relative group">
          <input
            type="file"
            accept=".pdf"
            className="absolute inset-0 opacity-0 cursor-pointer z-10"
            onChange={handleFileChange}
            disabled={uploading}
          />
          <Button loading={uploading} variant="primary" className="px-8 shadow-indigo-500/20">
            <Plus className="w-5 h-5" /> Import Artifact
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {notes.map((note) => (
          <Card key={note.id} className="flex flex-col sm:flex-row items-center justify-between gap-6 hover:bg-white/[0.03] transition-colors border-white/5">
            <div className="flex items-center gap-6 w-full">
              <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-indigo-400">
                <FileText className="w-8 h-8" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-lg text-white truncate">{note.name}</h3>
                <div className="flex items-center gap-3 mt-1">
                   <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest">{note.questions?.length || 0} DATA NODES</span>
                   <div className="w-1 h-1 rounded-full bg-slate-700" />
                   <span className="text-[10px] font-mono text-slate-500">{note.createdAt?.toDate().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button onClick={() => window.startQuest(note)} className="bg-emerald-600 hover:bg-emerald-500 flex-1 sm:flex-none px-8">
                <Sword className="w-4 h-4" /> BATTLE
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const QuestMode = ({ note, onExit }) => {
  const [step, setStep] = useState(0); 
  const [hp, setHp] = useState(100);
  const [progress, setProgress] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const template = useMemo(() => QUEST_TEMPLATES[Math.floor(Math.random() * QUEST_TEMPLATES.length)], []);
  const monsterName = useMemo(() => {
    const p = MONSTER_PREFIXES[Math.floor(Math.random() * MONSTER_PREFIXES.length)];
    const t = MONSTER_TYPES[Math.floor(Math.random() * MONSTER_TYPES.length)];
    return `${p} ${t}`;
  }, []);

  const totalQuestions = Math.min(note.questions?.length || 5, 5);
  const currentQuestion = note.questions?.[currentQuestionIndex] || { question: "Processing challenge...", options: ["A", "B", "C", "D"], answer: 0 };

  const handleAnswer = (index) => {
    if (feedback) return;
    setSelectedAnswer(index);
    const isCorrect = index === currentQuestion.answer;
    
    if (isCorrect) {
      setFeedback({ correct: true, message: "Critical Strike! Node neutralized." });
      setProgress(prev => prev + (100 / totalQuestions));
    } else {
      setFeedback({ correct: false, message: "Data Corruption! Encounter failed." });
      setHp(prev => Math.max(0, prev - 25));
    }

    setTimeout(() => {
      if (hp <= 25 && !isCorrect) setStep(2);
      else if (currentQuestionIndex + 1 >= totalQuestions) setStep(2);
      else {
        setFeedback(null);
        setSelectedAnswer(null);
        setCurrentQuestionIndex(prev => prev + 1);
      }
    }, 1500);
  };

  if (step === 0) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-12 animate-in zoom-in-95 duration-500">
        <div className="space-y-4">
          <div className="inline-block p-4 bg-indigo-500/10 rounded-full border border-indigo-500/30 mb-4">
            <Sword className="w-12 h-12 text-indigo-400" />
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase">{template.name}</h1>
          <p className="text-xl text-slate-500 font-medium leading-relaxed italic">"{template.description}"</p>
        </div>
        
        <Card className="bg-[#0f172a] border-white/5 p-8">
          <h3 className="text-indigo-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-4">Tactical Briefing</h3>
          <p className="text-white text-xl font-bold">Neutralize the <span className="text-rose-500 underline decoration-rose-500/30 underline-offset-8 decoration-2">{monsterName}</span> by synthesizing {totalQuestions} knowledge nodes.</p>
        </Card>

        <Button onClick={() => setStep(1)} className="px-16 py-5 text-xl font-black tracking-widest uppercase rounded-2xl">
          Initialize Sync
        </Button>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-500">
              <span className="text-rose-500 flex items-center gap-2"><Heart className="w-4 h-4" /> Integrity</span>
              <span className="text-white">{hp}%</span>
            </div>
            <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5">
              <div 
                className={`h-full transition-all duration-700 ${hp > 50 ? 'bg-rose-500' : 'bg-orange-500'}`} 
                style={{ width: `${hp}%` }} 
              />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-500">
              <span className="text-indigo-500 flex items-center gap-2"><Zap className="w-4 h-4" /> Sync</span>
              <span className="text-white">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-indigo-500 transition-all duration-700 shadow-[0_0_15px_rgba(99,102,241,0.5)]" 
                style={{ width: `${progress}%` }} 
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-8">
          <div className="flex flex-col items-center">
             <div className="relative w-64 h-64 flex items-center justify-center">
                <div className="absolute inset-0 bg-indigo-500/10 blur-[60px] rounded-full animate-pulse" />
                <div className="relative w-48 h-48 bg-[#0f172a] border-8 border-white/5 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                  <Shield className="w-24 h-24 text-rose-500/20 absolute" />
                  <div className="w-32 h-32 bg-slate-900 rounded-full flex items-center justify-center border-4 border-slate-800">
                    <span className="text-5xl">👾</span>
                  </div>
                </div>
             </div>
             <h3 className="text-2xl font-black text-white mt-8 tracking-widest uppercase">{monsterName}</h3>
             <p className="text-slate-500 font-mono text-sm uppercase tracking-tighter">LVL {currentQuestionIndex + 1} ENTITY</p>
          </div>

          <div className="space-y-8">
            <Card className="bg-[#0f172a]/80 border-indigo-500/20">
              <span className="text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-4 block">Node Encounter {currentQuestionIndex + 1}</span>
              <h2 className="text-2xl font-bold text-white leading-relaxed italic">
                "{currentQuestion.question}"
              </h2>
            </Card>

            <div className="grid grid-cols-1 gap-4">
              {currentQuestion.options.map((opt, i) => (
                <button
                  key={i}
                  disabled={!!feedback}
                  onClick={() => handleAnswer(i)}
                  className={`p-5 rounded-2xl text-left border transition-all duration-300 flex items-center gap-6 ${
                    selectedAnswer === i 
                      ? (feedback?.correct ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'bg-rose-500/10 border-rose-500 text-rose-400')
                      : 'bg-[#0f172a] border-white/5 text-slate-400 hover:border-indigo-500/30 hover:bg-indigo-500/5'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black border ${selectedAnswer === i ? 'bg-current text-slate-950 border-transparent' : 'bg-slate-800 border-white/10'}`}>
                    {String.fromCharCode(65 + i)}
                  </div>
                  <span className="flex-1 font-bold">{opt}</span>
                </button>
              ))}
            </div>

            {feedback && (
              <div className={`p-6 rounded-2xl flex items-center gap-4 animate-in slide-in-from-right-8 duration-500 border ${feedback.correct ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/5 border-rose-500/20 text-rose-400'}`}>
                <div className="p-2 bg-current opacity-10 rounded-lg"><Sparkles className="w-6 h-6" /></div>
                <span className="font-black uppercase tracking-widest text-sm">{feedback.message}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-20 text-center space-y-12">
      {hp > 0 ? (
        <>
          <div className="p-8 bg-emerald-500/10 border border-emerald-500/20 rounded-full inline-block shadow-2xl shadow-emerald-500/10">
            <Trophy className="w-20 h-20 text-emerald-400" />
          </div>
          <div className="space-y-4">
            <h1 className="text-5xl font-black text-white tracking-tighter">NODE SYNCHRONIZED</h1>
            <p className="text-xl text-slate-400 max-w-md mx-auto">The knowledge from <span className="text-indigo-400 font-bold">{note.name}</span> has been permanently integrated into your neural pathways.</p>
          </div>
          <div className="grid grid-cols-2 gap-4 py-8">
            <Card className="border-emerald-500/20 bg-emerald-500/5">
              <p className="text-emerald-500/60 text-xs font-black uppercase tracking-widest">Efficiency</p>
              <p className="text-4xl font-bold text-white mt-1">{hp}%</p>
            </Card>
             <Card className="border-indigo-500/20 bg-indigo-500/5">
              <p className="text-indigo-500/60 text-xs font-black uppercase tracking-widest">EXP Gained</p>
              <p className="text-4xl font-bold text-white mt-1">+{totalQuestions * 100}</p>
            </Card>
          </div>
        </>
      ) : (
        <>
          <div className="p-8 bg-rose-500/10 border border-rose-500/20 rounded-full inline-block">
             <XCircle className="w-20 h-20 text-rose-400" />
          </div>
          <div className="space-y-4">
            <h1 className="text-5xl font-black text-white tracking-tighter">DATA CORRUPTION</h1>
            <p className="text-xl text-slate-400 max-w-md mx-auto">Neural sync failed. Strengthen your foundations and return to the vault.</p>
          </div>
        </>
      )}
      <div className="flex gap-4 justify-center pt-8">
        <Button onClick={onExit} variant="secondary" className="px-12">Return to Nexus</Button>
        {hp > 0 && <Button onClick={onExit} variant="primary" className="px-12">Claim Rewards</Button>}
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notes, setNotes] = useState([]);
  const [activeQuest, setActiveQuest] = useState(null);
  
  useEffect(() => {
    const initAuth = async () => {
      if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
        await signInWithCustomToken(auth, __initial_auth_token);
      } else {
        await signInAnonymously(auth);
      }
    };
    initAuth();
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'artifacts', appId, 'users', user.uid, 'notes'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setNotes(data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
      },
      (err) => console.error("Firestore error:", err)
    );
    return () => unsubscribe();
  }, [user]);

  window.startQuest = (note) => setActiveQuest(note);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try { await signInWithPopup(auth, provider); } catch (e) { console.error(e); }
  };

  const handleLogout = () => signOut(auth);

  const handleUpload = async (noteData) => {
    if (!user) return;
    try { await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'notes'), noteData); } catch (e) { console.error(e); }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center">
      <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
      <p className="mt-6 text-slate-500 font-bold tracking-[0.3em] text-[10px] uppercase">Decrypting Neural Channels...</p>
    </div>
  );

  if (!user || user.isAnonymous) return <Landing onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex font-sans selection:bg-indigo-500/30">
      <Sidebar activeTab={activeTab} setActiveTab={(t) => { setActiveTab(t); setActiveQuest(null); }} user={user} onLogout={handleLogout} />
      <main className="flex-1 p-8 lg:p-16 overflow-y-auto max-h-screen relative">
        <div className="absolute top-0 right-0 w-[40%] h-[30%] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          {activeQuest ? <QuestMode note={activeQuest} onExit={() => setActiveQuest(null)} /> : (
            <>
              {activeTab === 'dashboard' && <Dashboard notes={notes} quests={[]} setActiveTab={setActiveTab} />}
              {activeTab === 'library' && <Library notes={notes} user={user} onUpload={handleUpload} />}
              {activeTab === 'quests' && (
                <div className="py-40 text-center text-slate-700">
                   <Sword className="w-20 h-20 mx-auto mb-6 opacity-10" />
                   <p className="text-xl font-black uppercase tracking-widest">Deployment Status: Offline</p>
                   <p className="mt-2 font-medium">Synchronize a file in the vault to enable tactical deployment.</p>
                </div>
              )}
              {activeTab === 'stats' && (
                <div className="py-40 text-center text-slate-700">
                   <Trophy className="w-20 h-20 mx-auto mb-6 opacity-10" />
                   <p className="text-xl font-black uppercase tracking-widest">Mastery Level: 0</p>
                   <p className="mt-2 font-medium">Complete your first quest to unlock analytical tracking.</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export defalt App;
import { createRoot } from 'react-dom/client';
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);

