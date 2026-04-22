import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  Upload, 
  LogIn, 
  User, 
  Sparkles, 
  Gamepad2, 
  CheckCircle2, 
  ChevronRight, 
  LogOut, 
  FileText, 
  BrainCircuit,
  Trophy,
  ArrowRight,
  Loader2,
  AlertCircle
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
import { createRoot } from 'react-dom/client';

// --- FIREBASE CONFIGURATION ---
// As requested, using the specific config provided.
const firebaseConfig = {
  apiKey: "AIzaSyCHEljnX6Jth5aSudsr-TkEj6DGCK547uo",
  authDomain: "hryzenstudy.firebaseapp.com",
  projectId: "hryzenstudy",
  storageBucket: "hryzenstudy.firebasestorage.app",
  messagingSenderId: "407403275300",
  appId: "1:407403275300:web:1daa36c1b726967e1824b1",
  measurementId: "G-ZV1LLLQ4TJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// --- PDF PROCESSING HELPER ---
// We use a CDN link for PDF.js to extract text without extra installs
const PDF_JS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js';

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('intro'); // intro, auth, dashboard, quest
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [currentQuest, setCurrentQuest] = useState(null);
  const [score, setScore] = useState(0);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) setView('dashboard');
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // --- AUTH ACTIONS ---
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleGuestLogin = async () => {
    try {
      await signInAnonymously(auth);
    } catch (error) {
      console.error("Guest login failed", error);
    }
  };

  const handleLogout = () => signOut(auth).then(() => setView('intro'));

  // --- PDF UPLOAD & GAMIFICATION LOGIC ---
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProcessing(true);
    try {
      // 1. Load PDF.js dynamically
      if (!window.pdfjsLib) {
        const script = document.createElement('script');
        script.src = PDF_JS_URL;
        document.head.appendChild(script);
        await new Promise(r => script.onload = r);
      }

      // 2. Extract Text
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = "";
      for (let i = 1; i <= Math.min(pdf.numPages, 5); i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        fullText += textContent.items.map(s => s.str).join(" ");
      }

      // 3. Mock "AI processing" to create a gamified adventure
      // In a production app, you'd send 'fullText' to an LLM here.
      generateQuest(fullText);
    } catch (err) {
      console.error("PDF processing error", err);
    } finally {
      setProcessing(false);
    }
  };

  const generateQuest = (text) => {
    // Unique adventure generator based on content length/keywords
    const themes = ["Galactic Archive", "Cyber-Dungeon", "Ancient Library", "Neon Nexus"];
    const theme = themes[Math.floor(Math.random() * themes.length)];
    
    // Logic to simulate parsing questions from the text
    const words = text.split(' ').filter(w => w.length > 5);
    const mockQuestions = [
      {
        id: 1,
        q: `In the ${theme}, what is the significance of "${words[0] || 'the core concept'}"?`,
        options: ["Primary Function", "Secondary Protocol", "Experimental Data", "Historical Context"],
        correct: 0
      },
      {
        id: 2,
        q: `Detecting high traces of "${words[5] || 'data'}". How should a student proceed?`,
        options: ["Ignore", "Analyze further", "Recalibrate", "Document"],
        correct: 1
      }
    ];

    setCurrentQuest({
      title: `The ${theme} Expedition`,
      questions: mockQuestions,
      currentIdx: 0,
      completed: false
    });
    setView('quest');
  };

  const handleAnswer = (idx) => {
    if (idx === currentQuest.questions[currentQuest.currentIdx].correct) {
      setScore(s => s + 100);
    }
    
    if (currentQuest.currentIdx < currentQuest.questions.length - 1) {
      setCurrentQuest({ ...currentQuest, currentIdx: currentQuest.currentIdx + 1 });
    } else {
      setCurrentQuest({ ...currentQuest, completed: true });
    }
  };

  // --- UI COMPONENTS ---

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-blue-500/30">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-slate-800/50 bg-slate-950/50 backdrop-blur-md px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('intro')}>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <BrainCircuit className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            HryzenStudy
          </span>
        </div>
        {user && (
          <button onClick={handleLogout} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        )}
      </nav>

      {/* View Controller */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        
        {/* VIEW: INTRODUCTORY MENU */}
        {view === 'intro' && (
          <div className="text-center space-y-8 py-12 lg:py-24">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm mb-4">
              <Sparkles size={14} />
              <span>Next-Gen Study Experience</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight">
              Turn Boring Notes into <br />
              <span className="text-blue-500">Legendary Adventures.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-slate-400 text-lg lg:text-xl leading-relaxed">
              Upload your PDFs and let our AI engine craft unique, gamified quests. 
              Retain knowledge better through immersive storytelling and adaptive learning.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <button 
                onClick={() => setView('auth')}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold text-lg shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-2 group"
              >
                Get Started
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 bg-slate-800/50 hover:bg-slate-800 rounded-2xl font-bold text-lg border border-slate-700 transition-all">
                Learn More
              </button>
            </div>
            {/* Feature Grid */}
            <div className="grid md:grid-cols-3 gap-6 pt-24">
              {[
                { icon: <Upload className="text-blue-400" />, t: "Instant Processing", d: "Drop any PDF and see it transform in seconds." },
                { icon: <Gamepad2 className="text-purple-400" />, t: "Gamified Quests", d: "Points, streaks, and unique adventure themes." },
                { icon: <Trophy className="text-yellow-400" />, t: "Mastery System", d: "Track your progress across multiple subjects." }
              ].map((f, i) => (
                <div key={i} className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 text-left">
                  <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center mb-4">{f.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{f.t}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{f.d}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW: AUTH INTERVIEW */}
        {view === 'auth' && (
          <div className="max-w-md mx-auto py-12">
            <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2.5rem] backdrop-blur-xl shadow-2xl">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-600/20 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <User className="text-blue-500 w-8 h-8" />
                </div>
                <h2 className="text-3xl font-bold">Join the Quest</h2>
                <p className="text-slate-400 mt-2">Sign in to save your adventure progress</p>
              </div>
              <div className="space-y-4">
                <button 
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 py-4 rounded-2xl font-bold hover:bg-slate-100 transition-all"
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="G" />
                  Continue with Google
                </button>
                <button 
                  onClick={handleGuestLogin}
                  className="w-full flex items-center justify-center gap-3 bg-slate-800 hover:bg-slate-700 py-4 rounded-2xl font-bold transition-all"
                >
                  <LogIn size={20} />
                  Continue as Guest
                </button>
              </div>
              <p className="text-center text-xs text-slate-500 mt-8">
                By continuing, you agree to our Terms of Study & Privacy.
              </p>
            </div>
          </div>
        )}

        {/* VIEW: DASHBOARD */}
        {view === 'dashboard' && (
          <div className="space-y-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-4xl font-bold">Welcome back, {user?.displayName?.split(' ')[0] || 'Scholar'}</h2>
                <p className="text-slate-400">Ready for your next learning expedition?</p>
              </div>
              <div className="flex items-center gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
                <div className="text-right">
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Current Score</p>
                  <p className="text-2xl font-mono text-blue-400 font-bold">{score} XP</p>
                </div>
                <Trophy className="text-yellow-500 w-8 h-8" />
              </div>
            </header>

            {/* Upload Area */}
            <div className="relative group">
              <input 
                type="file" 
                accept="application/pdf" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                onChange={handleFileUpload}
                disabled={processing}
              />
              <div className={`p-12 border-2 border-dashed border-slate-800 rounded-[3rem] text-center bg-slate-900/20 group-hover:bg-blue-500/5 group-hover:border-blue-500/50 transition-all ${processing ? 'opacity-50' : ''}`}>
                {processing ? (
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                    <p className="text-xl font-medium">Extracting Knowledge Fragments...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <Upload className="text-slate-400 group-hover:text-blue-500" size={32} />
                    </div>
                    <h3 className="text-2xl font-bold">Drop your Study Notes</h3>
                    <p className="text-slate-400 max-w-sm">Upload a PDF to generate a unique AI-powered quiz adventure.</p>
                    <span className="text-blue-500 font-semibold mt-4 flex items-center gap-1 group-hover:translate-x-2 transition-transform">
                      Browse Files <ChevronRight size={18} />
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Courses', val: '12' },
                { label: 'Quiz Streak', val: '4 Days' },
                { label: 'Rank', val: 'Silver III' },
                { label: 'Accuracy', val: '92%' }
              ].map((s, i) => (
                <div key={i} className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
                  <p className="text-xs text-slate-500 uppercase font-bold">{s.label}</p>
                  <p className="text-xl font-bold text-white mt-1">{s.val}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW: ACTIVE QUEST (QUIZ) */}
        {view === 'quest' && currentQuest && (
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <button onClick={() => setView('dashboard')} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                <ArrowRight className="rotate-180" size={18} />
                Abort Mission
              </button>
              <div className="px-4 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-sm font-bold">
                Level {currentQuest.currentIdx + 1} / {currentQuest.questions.length}
              </div>
            </div>

            {!currentQuest.completed ? (
              <div className="space-y-8">
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Gamepad2 size={80} />
                  </div>
                  <h2 className="text-indigo-400 font-bold uppercase tracking-widest text-sm mb-4">{currentQuest.title}</h2>
                  <p className="text-2xl font-bold leading-relaxed">
                    {currentQuest.questions[currentQuest.currentIdx].q}
                  </p>
                </div>

                <div className="grid gap-4">
                  {currentQuest.questions[currentQuest.currentIdx].options.map((opt, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      className="w-full text-left p-6 bg-slate-800/40 hover:bg-slate-800 hover:border-blue-500/50 border border-slate-700 rounded-2xl transition-all flex items-center justify-between group"
                    >
                      <span className="font-medium text-lg">{opt}</span>
                      <div className="w-8 h-8 rounded-lg bg-slate-700 group-hover:bg-blue-600 flex items-center justify-center transition-colors">
                        {String.fromCharCode(65 + idx)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 space-y-8 bg-slate-900/50 rounded-[3rem] border border-slate-800">
                <div className="w-24 h-24 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto">
                  <Trophy className="text-yellow-500 w-12 h-12" />
                </div>
                <div>
                  <h2 className="text-4xl font-bold mb-2">Expedition Successful!</h2>
                  <p className="text-slate-400">You've successfully mapped this knowledge territory.</p>
                </div>
                <div className="flex justify-center gap-12">
                  <div>
                    <p className="text-slate-500 uppercase text-xs font-bold mb-1">XP Earned</p>
                    <p className="text-3xl font-mono text-blue-400">+{score}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 uppercase text-xs font-bold mb-1">Rank Up</p>
                    <p className="text-3xl font-mono text-purple-400">+12%</p>
                  </div>
                </div>
                <button 
                  onClick={() => { setView('dashboard'); setScore(0); }}
                  className="px-10 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold text-lg shadow-xl shadow-blue-600/20 transition-all"
                >
                  Return to Dashboard
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer Branding */}
      <footer className="relative z-10 py-12 border-t border-slate-800/50 mt-24">
        <div className="max-w-6xl mx-auto px-6 text-center text-slate-500">
          <p className="text-sm font-medium tracking-widest uppercase">HryzenStudy Engine v1.0</p>
          <p className="text-xs mt-2 opacity-50">&copy; 2024 Hryzen Learning Systems. No AI was harmed in the making of this quest.</p>
        </div>
      </footer>
    </div>
  );
}

// --- RENDERING CODE ---
// This section ensures the app renders into the root div of your index.html
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
