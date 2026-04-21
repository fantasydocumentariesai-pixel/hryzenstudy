import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  BookOpen, Sparkles, LogIn, GraduationCap, 
  Upload, FileText, Play, CheckCircle2, 
  Trophy, X, Loader2, ChevronRight, BrainCircuit,
  Gamepad2, Compass, Zap, LogOut, ShieldCheck,
  Target, Rocket, Swords, Cpu
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInAnonymously, 
  onAuthStateChanged, 
  signOut 
} from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';

// --- Global PDF.js Handling ---
const getPdfLib = () => window.pdfjsLib;

// --- Firebase Configuration ---
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

const App = () => {
  const [view, setView] = useState('intro'); 
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [adventure, setAdventure] = useState({ theme: 'Space', icon: <Rocket />, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500' });

  // Load PDF.js Script Dynamically
  useEffect(() => {
    if (!window.pdfjsLib) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.async = true;
      script.onload = () => {
        if (window.pdfjsLib) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        }
      };
      document.head.appendChild(script);
    }
  }, []);

  // Handle Auth State
  useEffect(() => {
    const initAuth = async () => {
      if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
        try {
          await signInWithPopup(auth, new GoogleAuthProvider());
        } catch (e) {
          await signInAnonymously(auth);
        }
      } else {
        await signInAnonymously(auth);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        if (view === 'auth' || view === 'intro') setView('dashboard');
      } else {
        setUser(null);
        initAuth();
      }
    });
    return () => unsubscribe();
  }, [view]);

  // Handle PDF Parsing
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== 'application/pdf') return;
    
    const pdfjsLib = getPdfLib();
    if (!pdfjsLib) return;

    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const typedarray = new Uint8Array(event.target.result);
        const loadingTask = pdfjsLib.getDocument({ data: typedarray });
        const pdf = await loadingTask.promise;
        let fullText = "";
        
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          fullText += content.items.map(item => item.str).join(" ");
        }
        
        processStudyNotes(fullText);
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("PDF Error:", error);
      setLoading(false);
    }
  };

  const processStudyNotes = (text) => {
    const sentences = text.split(/[.!?]/).filter(s => s.trim().length > 40);
    const themes = [
      { name: 'Nebula Explorer', icon: <Rocket />, color: 'text-cyan-400', border: 'border-cyan-500', bg: 'bg-cyan-500/10' },
      { name: 'Temple Raider', icon: <Swords />, color: 'text-amber-400', border: 'border-amber-500', bg: 'bg-amber-500/10' },
      { name: 'Cyber Protocol', icon: <Cpu />, color: 'text-purple-400', border: 'border-purple-500', bg: 'bg-purple-500/10' }
    ];

    const selectedTheme = themes[Math.floor(Math.random() * themes.length)];
    setAdventure(selectedTheme);

    const quiz = sentences.slice(0, 5).map((sentence, idx) => ({
      id: idx,
      question: `Is the following concept from your notes accurate? "${sentence.trim().substring(0, 100)}..."`,
      answer: true 
    }));

    setQuizData(quiz);
    setScore(0);
    setCurrentQuestion(0);
    setLoading(false);
    setView('quiz');
  };

  const IntroView = () => (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6 text-center overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 blur-[120px] rounded-full"></div>
         <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 blur-[120px] rounded-full"></div>
      </div>
      <div className="relative mb-10 group">
        <div className="absolute -inset-4 bg-cyan-500/30 blur-3xl rounded-full group-hover:animate-pulse transition-all"></div>
        <BrainCircuit size={120} className="text-cyan-400 relative" />
      </div>
      <h1 className="text-7xl md:text-8xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent">
        HRYZEN STUDY
      </h1>
      <p className="text-slate-400 text-xl max-w-2xl mb-12 leading-relaxed">
        The NotebookLM-inspired engine for high-performance students. 
        Transform static notes into interactive adventures through neural PDF processing.
      </p>
      <button 
        onClick={() => setView('auth')}
        className="group flex items-center gap-4 bg-white text-black px-12 py-6 rounded-[2rem] font-bold text-2xl hover:bg-cyan-400 transition-all active:scale-95 shadow-[0_0_50px_rgba(34,211,238,0.4)]"
      >
        Get Started <ChevronRight className="group-hover:translate-x-2 transition-transform" />
      </button>
    </div>
  );

  const AuthView = () => (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-900/40 border border-slate-800 p-12 rounded-[3.5rem] backdrop-blur-3xl shadow-2xl">
        <h2 className="text-4xl font-black text-white mb-3 text-center tracking-tight">Access HQ</h2>
        <p className="text-slate-500 text-center mb-12 font-medium">Identify yourself to sync your knowledge base.</p>
        <div className="space-y-4">
          <button 
            onClick={() => signInWithPopup(auth, new GoogleAuthProvider())}
            className="w-full flex items-center justify-center gap-4 bg-white text-black py-5 rounded-[1.5rem] font-bold text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
          >
            <ShieldCheck className="text-blue-600" /> Continue with Google
          </button>
          <div className="flex items-center gap-4 my-8">
            <div className="h-[1px] flex-1 bg-slate-800"></div>
            <span className="text-slate-700 font-black text-xs tracking-widest uppercase">Protocol</span>
            <div className="h-[1px] flex-1 bg-slate-800"></div>
          </div>
          <button 
            onClick={() => signInAnonymously(auth)}
            className="w-full py-5 border border-slate-700 text-slate-400 rounded-[1.5rem] font-bold hover:bg-slate-800/50 hover:text-white transition-all active:scale-95"
          >
            Enter as Guest
          </button>
        </div>
        <button onClick={() => setView('intro')} className="w-full mt-10 text-slate-600 hover:text-rose-400 flex items-center justify-center gap-2 font-bold transition-colors">
          <X size={18} /> ABORT INITIALIZATION
        </button>
      </div>
    </div>
  );

  const DashboardView = () => (
    <div className="min-h-screen bg-[#020617] text-white p-8 md:p-12">
      <nav className="flex justify-between items-center max-w-6xl mx-auto mb-20">
        <div className="flex items-center gap-4">
          <div className="bg-cyan-500 p-3 rounded-2xl text-black shadow-[0_0_20px_rgba(34,211,238,0.5)]"><GraduationCap size={28} /></div>
          <div>
            <span className="text-2xl font-black tracking-tighter block leading-none">HRYZEN</span>
            <span className="text-[10px] font-bold tracking-[0.3em] text-cyan-500 uppercase">Study Core</span>
          </div>
        </div>
        <button onClick={() => signOut(auth)} className="bg-slate-900/80 p-4 rounded-2xl hover:bg-rose-500/10 hover:text-rose-400 text-slate-500 transition-all border border-slate-800">
          <LogOut size={22} />
        </button>
      </nav>
      <main className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">Active Terminal</h2>
          <p className="text-slate-500 text-xl font-medium">Ready to convert documentation into experience points?</p>
        </div>
        <div className="bg-slate-900/30 border-2 border-dashed border-slate-800 rounded-[4rem] p-20 text-center transition-all hover:border-cyan-500/50 hover:bg-cyan-500/[0.02] group relative overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center gap-8 py-10">
              <div className="relative">
                <Loader2 className="animate-spin text-cyan-400" size={80} />
                <div className="absolute inset-0 bg-cyan-400/20 blur-xl rounded-full"></div>
              </div>
              <div className="space-y-3">
                <p className="text-cyan-400 font-mono tracking-[0.4em] text-sm uppercase animate-pulse">Neural Mapping in Progress</p>
                <p className="text-slate-500 text-sm italic">Synchronizing PDF nodes with Hryzen logic...</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center relative z-10">
              <div className="bg-slate-800/50 w-28 h-28 rounded-[2.5rem] flex items-center justify-center text-cyan-400 mb-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-slate-700 shadow-2xl">
                <Upload size={48} />
              </div>
              <label className="cursor-pointer">
                <span className="bg-cyan-500 text-black px-12 py-5 rounded-[1.5rem] font-black text-xl hover:bg-cyan-400 hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all active:scale-95 inline-block">
                  UPLOAD STUDY NOTES
                </span>
                <input type="file" className="hidden" accept=".pdf" onChange={handleFileUpload} />
              </label>
              <p className="mt-8 text-slate-500 font-bold tracking-widest text-xs uppercase">Target: PDF / 50MB MAX</p>
            </div>
          )}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col gap-4 hover:border-slate-700 transition-all group">
            <div className="bg-blue-500/10 w-12 h-12 rounded-xl flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform"><Target /></div>
            <div>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Focus Score</p>
              <p className="text-2xl font-black">---</p>
            </div>
          </div>
          <div className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col gap-4 hover:border-slate-700 transition-all group">
            <div className="bg-emerald-500/10 w-12 h-12 rounded-xl flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform"><Trophy /></div>
            <div>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">XP Gained</p>
              <p className="text-2xl font-black">0 PTS</p>
            </div>
          </div>
          <div className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col gap-4 hover:border-slate-700 transition-all group">
            <div className="bg-amber-500/10 w-12 h-12 rounded-xl flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform"><Zap /></div>
            <div>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Student Rank</p>
              <p className="text-2xl font-black tracking-tighter">LEVEL 1</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );

  const QuizView = () => {
    const q = quizData[currentQuestion];
    const handleAnswer = (isTrue) => {
      if (isTrue === q.answer) setScore(score + 1);
      if (currentQuestion < quizData.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setView('results');
      }
    };
    return (
      <div className="min-h-screen bg-[#020617] text-white p-6 flex flex-col">
        <div className="flex justify-between items-center max-w-5xl mx-auto w-full mb-12 py-4">
          <div className={`flex items-center gap-5 ${adventure.bg} p-5 rounded-[2rem] border ${adventure.border}/30 shadow-2xl`}>
            <div className={`${adventure.color} scale-125`}>{adventure.icon}</div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Neural Sector</p>
              <h4 className="font-black text-xl tracking-tight">{adventure.name}</h4>
            </div>
          </div>
          <div className="bg-slate-900/60 p-6 rounded-[2rem] border border-slate-800 backdrop-blur-md">
            <div className="w-56 h-3 bg-slate-800/50 rounded-full overflow-hidden mb-3 border border-white/5">
              <div className={`h-full transition-all duration-700 ease-out ${adventure.color.replace('text', 'bg')}`} style={{ width: `${((currentQuestion + 1) / quizData.length) * 100}%` }}></div>
            </div>
            <p className="text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">Synapse Link: {currentQuestion + 1} / {quizData.length}</p>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center max-w-4xl mx-auto w-full pb-20">
          <div className="bg-slate-900 border border-slate-800 rounded-[4rem] p-16 shadow-[0_0_100px_rgba(0,0,0,0.5)] relative overflow-hidden text-center">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] scale-[4] rotate-12">{adventure.icon}</div>
            <span className={`inline-block px-6 py-2 rounded-full text-xs font-black uppercase tracking-[0.3em] mb-12 shadow-lg ${adventure.bg} ${adventure.color} border border-white/5`}>Cognitive Test</span>
            <h3 className="text-4xl md:text-5xl font-black leading-[1.1] mb-20 px-4 tracking-tight">{q.question}</h3>
            <div className="grid grid-cols-2 gap-10 max-w-2xl mx-auto">
              <button onClick={() => handleAnswer(true)} className="group p-10 rounded-[2.5rem] bg-slate-800/30 border-2 border-slate-700 hover:border-emerald-500 hover:bg-emerald-500/10 transition-all transform active:scale-90">
                <div className="bg-emerald-500/20 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-5 text-emerald-400 group-hover:scale-110 transition-all border border-emerald-500/20"><CheckCircle2 size={36} /></div>
                <p className="font-black text-2xl tracking-widest uppercase">TRUE</p>
              </button>
              <button onClick={() => handleAnswer(false)} className="group p-10 rounded-[2.5rem] bg-slate-800/30 border-2 border-slate-700 hover:border-rose-500 hover:bg-rose-500/10 transition-all transform active:scale-90">
                <div className="bg-rose-500/20 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-5 text-rose-400 group-hover:scale-110 transition-all border border-rose-500/20"><X size={36} /></div>
                <p className="font-black text-2xl tracking-widest uppercase">FALSE</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ResultsView = () => (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-10">
        <div className="absolute inset-0 bg-amber-400/20 blur-[60px] animate-pulse"></div>
        <Trophy size={100} className="text-amber-400 relative" />
      </div>
      <h2 className="text-6xl font-black mb-6 uppercase tracking-tighter italic">NEURAL SYNC COMPLETE</h2>
      <p className="text-slate-400 text-xl max-w-md mb-16 font-medium">Knowledge has been successfully integrated into your long-term memory core.</p>
      <div className="bg-slate-900 p-12 rounded-[4rem] border border-slate-800 mb-16 w-full max-w-md shadow-2xl relative">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-800 px-6 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-slate-700">Final Metrics</div>
        <p className="text-slate-500 uppercase font-black tracking-[0.4em] text-xs mb-4">Sync Fidelity</p>
        <p className="text-9xl font-black text-cyan-400 tracking-tighter">{Math.round((score / quizData.length) * 100)}<span className="text-3xl">%</span></p>
      </div>
      <button onClick={() => setView('dashboard')} className="group bg-white text-black px-16 py-6 rounded-[2rem] font-black text-2xl hover:bg-cyan-400 hover:scale-105 transition-all shadow-2xl active:scale-95 flex items-center gap-3">
        RETURN TO HQ <ChevronRight />
      </button>
    </div>
  );

  switch(view) {
    case 'intro': return <IntroView />;
    case 'auth': return <AuthView />;
    case 'dashboard': return <DashboardView />;
    case 'quiz': return <QuizView />;
    case 'results': return <ResultsView />;
    default: return <IntroView />;
  }
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}

export default App;
