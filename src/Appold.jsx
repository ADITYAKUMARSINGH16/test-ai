import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * src/App.jsx
 * AI Judicial Suite — Responsive Front-end Prototype
 *
 * Updated: Fixed "Black Screen" crash on Lawyer Page (missing setRoute prop)
 */

/* ---------- Small mocked AI helper ---------- */
function fakeAiResponse(prompt, context = {}) {
  if (!prompt) return "...";
  const p = prompt.toLowerCase();
  if (p.includes("summarize")) return `Summary — ${context.caseTitle || "No case"}: ${context.shortFacts || "No facts provided."}`;
  if (p.includes("advice") || p.includes("what should")) return `Legal Assistant: Based on the facts, consider documenting evidence and reviewing statutory provisions relevant to the claim.`;
  if (p.includes("evaluate") || p.includes("decide")) return `Ruling: In favor of ${context.favored || "plaintiff"}
Reasoning: The record indicates breach of duty supported by exhibits.
Order: Remedies as appropriate.`;
  return `AI: (Simulated) I can help with: "${prompt}"`;
}

/* ---------- Main App Component ---------- */
export default function AIJudicialApp() {
  // Routes: 'assistant', 'lawyer', 'judge', 'login', 'signup'
  const [route, setRoute] = useState("assistant"); 
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState("dark");

  // Mocked Database
  const [users, setUsers] = useState(() => [
    { name: 'Judge Judy', role: 'Judge', password: 'judgepass' },
    { name: 'Lawyer John', role: 'Lawyer', password: 'lawyerpass' },
    { name: 'Assistant Mary', role: 'Legal Assistant', password: 'assistant123' },
    { name: 'Public User', role: 'Public', password: 'public123' }
  ]);

  // Case Data
  const [cases, setCases] = useState(() => sampleCases());
  const [selectedCaseId, setSelectedCaseId] = useState(cases[0]?.id || null);
  const [assistantHistory, setAssistantHistory] = useState({});

  useEffect(() => {
    if (!selectedCaseId && cases[0]) setSelectedCaseId(cases[0].id);
  }, [cases, selectedCaseId]);

  // Theme Toggle
  useEffect(() => {
    const html = document.documentElement;
    if (theme === "dark") {
      html.classList.add("dark");
      html.classList.remove("light");
    } else {
      html.classList.remove("dark");
      html.classList.add("light");
    }
  }, [theme]);

  const logout = () => {
    setUser(null);
    setRoute("assistant"); // Go home on logout
    setIsMobileMenuOpen(false);
  };

  // Nav Item Helper
  const navItem = (key, label) => (
    <button
      onClick={() => {
        setRoute(key);
        setIsMobileMenuOpen(false);
      }}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        route === key 
          ? "bg-indigo-600 text-white" 
          : theme === "dark" ? "text-gray-300 hover:bg-gray-800" : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className={`app-root min-h-screen ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      
      {/* ================= NAVBAR ================= */}
      <nav className={`border-b ${theme === "dark" ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"} sticky top-0 z-50`}>
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Left: Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setRoute("assistant")}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">AI</div>
            <h1 className="text-lg font-bold tracking-tight">AI Judicial Suite</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navItem("assistant", "Assistant")}
            {navItem("lawyer", "Lawyer")}
            {navItem("judge", "Judge")}
          </div>

          {/* Right: Theme & Auth */}
          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800">
              {theme === "dark" ? "🌙" : "☀️"}
            </button>
            
            {user ? (
              <div className="flex items-center gap-3 pl-3 border-l dark:border-gray-700">
                <div className="text-right leading-tight">
                  <div className="text-sm font-semibold">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.role}</div>
                </div>
                <button onClick={logout} className="text-xs text-red-500 hover:underline">Logout</button>
              </div>
            ) : (
              <button 
                onClick={() => setRoute("login")} 
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} className="p-2 text-lg">
              {theme === "dark" ? "🌙" : "☀️"}
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {isMobileMenuOpen ? (
                  <><path d="M18 6 6 18"/><path d="m6 6 12 12"/></> 
                ) : (
                  <><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></>
                )} 
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} 
              animate={{ height: "auto", opacity: 1 }} 
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden border-t dark:border-gray-800 bg-gray-50 dark:bg-gray-900"
            >
              <div className="p-4 flex flex-col gap-2">
                {navItem("assistant", "AI Assistant")}
                {navItem("lawyer", "AI Lawyer")}
                {navItem("judge", "AI Judge")}
                <hr className="my-2 dark:border-gray-700" />
                {user ? (
                  <div className="flex items-center justify-between px-2">
                    <div>
                      <div className="font-bold">{user.name}</div>
                      <div className="text-xs opacity-70">{user.role}</div>
                    </div>
                    <button onClick={logout} className="text-red-500 text-sm font-medium">Logout</button>
                  </div>
                ) : (
                  <button onClick={() => { setRoute("login"); setIsMobileMenuOpen(false); }} className="w-full py-3 rounded-lg bg-indigo-600 text-white font-medium">
                    Sign In to Account
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ================= MAIN CONTENT ================= */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {/* LOGIN PAGE */}
        {route === "login" && (
          <AuthPage 
            type="login" 
            setRoute={setRoute} 
            users={users} 
            setUser={setUser} 
            theme={theme} 
          />
        )}

        {/* SIGNUP PAGE */}
        {route === "signup" && (
          <AuthPage 
            type="signup" 
            setRoute={setRoute} 
            users={users} 
            setUsers={setUsers} // Pass setter to add new user
            setUser={setUser} 
            theme={theme} 
          />
        )}

        {/* APP FEATURES */}
        {route === "assistant" && (
          <LandingAssistant
            user={user}
            setRoute={setRoute}
            cases={cases}
            setCases={setCases}
            selectedCaseId={selectedCaseId}
            setSelectedCaseId={setSelectedCaseId}
            assistantHistory={assistantHistory}
            setAssistantHistory={setAssistantHistory}
            fakeAiResponse={fakeAiResponse}
            theme={theme}
          />
        )}

        {route === "lawyer" && (
          <LawyerPage
            user={user}
            setRoute={setRoute} // FIX 1: Passed setRoute prop here
            cases={cases}
            setCases={setCases}
            selectedCaseId={selectedCaseId}
            setSelectedCaseId={setSelectedCaseId}
            assistantHistory={assistantHistory}
            setAssistantHistory={setAssistantHistory}
            fakeAiResponse={fakeAiResponse}
            theme={theme}
          />
        )}

        {route === "judge" && (
          <JudgePage
            user={user}
            cases={cases}
            setCases={setCases}
            selectedCaseId={selectedCaseId}
            setSelectedCaseId={setSelectedCaseId}
            fakeAiResponse={fakeAiResponse}
            theme={theme}
          />
        )}
      </main>

      <footer className="mt-8 py-6 border-t bg-white/60 dark:bg-gray-800">
  <div className="max-w-6xl mx-auto px-4 text-sm text-gray-600 dark:text-gray-300 space-y-2">
    <div className="font-medium">AI Judicial Suite</div>

    <div>
      This platform provides AI-assisted legal tools and information and is <strong>not</strong> a substitute for professional legal advice.
      Use of the service is subject to our
      {" "}
      <a href="/terms" className="underline">Terms of Service</a>
      {" "}
      and
      {" "}
      <a href="/privacy" className="underline">Privacy Policy</a>.
    </div>

    <div>
      Do not submit confidential, privileged, or sensitive data unless you have explicit authorization.
      For general support or to report security issues, email
      {" "}
      <a href="mailto:support@example.com" className="underline">aijudicialsuite@example.com</a>.
    </div>

    <div className="text-xs text-gray-500">© {new Date().getFullYear()} AI Judicial Suite. All rights reserved.</div>
  </div>
</footer>
    </div>
  );
}

/* ---------------- AUTH PAGES (Login / Signup) ---------------- */
function AuthPage({ type, setRoute, users, setUsers, setUser, theme }) {
  const isLogin = type === "login";
  const [formData, setFormData] = useState({ name: "", password: "", role: "Lawyer" });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim() || !formData.password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    if (isLogin) {
      // Login Logic
      const found = users.find(u => u.name.toLowerCase() === formData.name.trim().toLowerCase() && u.password === formData.password);
      if (found) {
        setUser({ name: found.name, role: found.role });
        setRoute("assistant"); // Redirect to home
      } else {
        setError("Invalid username or password.");
      }
    } else {
      // Signup Logic
      const exists = users.find(u => u.name.toLowerCase() === formData.name.trim().toLowerCase());
      if (exists) {
        setError("User already exists.");
        return;
      }
      const newUser = { name: formData.name.trim(), role: formData.role, password: formData.password };
      setUsers(prev => [...prev, newUser]);
      setUser(newUser);
      setRoute("assistant"); // Redirect to home
      alert("Account created successfully!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className={`w-full max-w-md p-8 rounded-2xl shadow-2xl border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">{isLogin ? "Welcome Back" : "Create Account"}</h2>
          <p className="text-sm text-gray-500 mt-2">
            {isLogin ? "Sign in to access your cases." : "Join the AI Judicial Suite today."}
          </p>
        </div>

        {error && <div className="mb-4 p-3 rounded bg-red-100 border border-red-200 text-red-700 text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Full Name</label>
            <input 
              className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
              placeholder="e.g. John Doe"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Password</label>
            <input 
              type="password"
              className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
              placeholder="••••••••"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Role</label>
              <select 
                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value})}
              >
                <option>Judge</option>
                <option>Lawyer</option>
                <option>Legal Assistant</option>
                <option>Public</option>
              </select>
            </div>
          )}

          <button 
            type="submit" 
            className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg transition-transform active:scale-95"
          >
            {isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => { setRoute(isLogin ? "signup" : "login"); setError(""); }}
            className="text-indigo-500 font-semibold hover:underline"
          >
            {isLogin ? "Sign Up" : "Log In"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ---------------- Landing / Assistant Page ---------------- */
function LandingAssistant({ user, setRoute, cases, setCases, selectedCaseId, setSelectedCaseId, assistantHistory, setAssistantHistory, fakeAiResponse, theme }) {
  const [prompt, setPrompt] = useState("");
  const [localChat, setLocalChat] = useState([]);

  const askAssistant = () => {
    if (!prompt.trim()) return;
    const q = prompt.trim();
    const resp = fakeAiResponse(q, {
      caseTitle: cases.find((c) => c.id === selectedCaseId)?.title,
      shortFacts: cases.find((c) => c.id === selectedCaseId)?.description?.slice(0, 120),
    });
    const userMsg = { id: Date.now() + "-u", from: user?.name || "Guest", text: q, ts: Date.now() };
    const botMsg = { id: Date.now() + "-b", from: "AI Assistant", text: resp, ts: Date.now() + 1 };
    setLocalChat((p) => [...p, userMsg, botMsg]);
    if (selectedCaseId) setAssistantHistory((p) => ({ ...p, [selectedCaseId]: [...(p[selectedCaseId] || []), userMsg, botMsg] }));
    setPrompt("");
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`lg:col-span-2 rounded-2xl p-8 shadow-xl border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
        <div className="flex items-start gap-6">
          <div className="flex-1">
            <h2 className="text-3xl font-extrabold mb-2">AI Legal Assistant</h2>
            <p className="text-gray-500 mb-6">Ask legal questions, summarize documents, or get case-specific guidance.</p>

            {/* Quick Feature Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              {[
                { title: "Context-Aware", desc: "Uses active case facts", color: "bg-indigo-50 text-indigo-700 dark:bg-gray-700 dark:text-indigo-300" },
                { title: "Explainable", desc: "Shows reasoning", color: "bg-green-50 text-green-700 dark:bg-gray-700 dark:text-green-300" },
                { title: "Secure", desc: "Local prototype data", color: "bg-yellow-50 text-yellow-700 dark:bg-gray-700 dark:text-yellow-300" },
              ].map((item, i) => (
                <div key={i} className={`p-3 rounded-lg text-sm ${item.color}`}>
                  <div className="font-bold">{item.title}</div>
                  <div className="text-xs opacity-80">{item.desc}</div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <input 
                  value={prompt} 
                  onChange={(e) => setPrompt(e.target.value)} 
                  placeholder="Ask a legal question..." 
                  className={`flex-1 px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none ${theme === "dark" ? "bg-gray-900 border-gray-600" : "bg-gray-50 border-gray-200"}`} 
                />
                <button onClick={askAssistant} className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700">Ask</button>
              </div>

              <div className={`h-64 overflow-y-auto rounded-lg p-4 border ${theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                {localChat.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm">
                    <span>No messages yet.</span>
                    <span className="text-xs mt-1">Try asking "Summarize this case"</span>
                  </div>
                ) : (
                  localChat.map((m) => (
                    <div key={m.id} className={`mb-3 ${m.from === "AI Assistant" ? "text-left" : "text-right"}`}>
                      <div className="text-xs text-gray-500 mb-1">{m.from}</div>
                      <div className={`inline-block px-4 py-2 rounded-2xl text-sm ${m.from === "AI Assistant" ? "bg-indigo-600 text-white rounded-tl-none" : "bg-gray-200 dark:bg-gray-700 rounded-tr-none"}`}>
                        {m.text}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Sidebar: Case Selector & CTA */}
      <aside className="space-y-4">
        <div className={`panel p-4 rounded-xl shadow border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
          <div className="text-xs font-bold uppercase text-gray-500 mb-3">Active Case</div>
          <div className="space-y-2">
            {cases.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCaseId(c.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors border ${selectedCaseId === c.id 
                  ? "bg-indigo-50 border-indigo-200 dark:bg-indigo-900/30 dark:border-indigo-700" 
                  : "bg-transparent border-transparent hover:bg-gray-50 dark:hover:bg-gray-700"}`}
              >
                <div className="text-sm font-semibold truncate">{c.title}</div>
                <div className="text-xs opacity-60">{c.id}</div>
              </button>
            ))}
          </div>
        </div>

        {!user && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center shadow-lg">
            <h3 className="font-bold">Unlock Full Access</h3>
            <p className="text-xs opacity-90 mt-1 mb-3">Sign in to draft cases and issue rulings.</p>
            <button onClick={() => setRoute("login")} className="px-4 py-2 rounded bg-white text-indigo-600 text-sm font-bold w-full">Sign In</button>
          </div>
        )}
      </aside>
    </section>
  );
}

/* ---------------- Lawyer Page ---------------- */
// FIX 2: Added setRoute to destructured props below
function LawyerPage({ user, setRoute, cases, setCases, selectedCaseId, setSelectedCaseId, assistantHistory, setAssistantHistory, fakeAiResponse, theme }) {
  const [showNew, setShowNew] = useState(false);
  const [newCase, setNewCase] = useState({ title: "", description: "", tags: "" });
  const [message, setMessage] = useState("");

  const submitCase = () => {
    if (!newCase.title.trim()) return alert("Title required");
    const id = "CASE-" + (cases.length + 1).toString().padStart(3, "0");
    const c = { id, title: newCase.title, description: newCase.description, tags: newCase.tags.split(",").map((t) => t.trim()).filter(Boolean), evidence: [], status: "Submitted", timeline: [{ ts: Date.now(), actor: user?.name || "Anon", action: "Submitted case" }], messages: [], ruling: null };
    setCases((p) => [c, ...p]);
    setShowNew(false);
    setNewCase({ title: "", description: "", tags: "" });
    setSelectedCaseId(c.id);
  };

  const sendMessage = (to = "All") => {
    if (!message.trim()) return;
    const msg = { id: Date.now().toString(), from: (user?.role || "Lawyer") + ":" + (user?.name || "Anon"), to, text: message, ts: Date.now() };
    setCases((prev) => prev.map((c) => (c.id === selectedCaseId ? { ...c, messages: [...c.messages, msg], timeline: [...c.timeline, { ts: Date.now(), actor: msg.from, action: `Message to ${to}` }] } : c)));
    setMessage("");
  };

  // Now setRoute is defined, so this won't crash
  if (!user) return <AccessDenied theme={theme} setRoute={setRoute} />;

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className={`lg:col-span-2 rounded-2xl p-6 shadow border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Lawyer Workspace</h2>
          <button onClick={() => setShowNew(true)} className="px-3 py-1.5 rounded bg-indigo-600 text-white text-sm">+ New Case</button>
        </div>

        {/* Case Detail View */}
        {selectedCaseId ? (
          <div>
             <div className="mb-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border dark:border-gray-700">
                <h3 className="font-bold text-lg">{cases.find((c) => c.id === selectedCaseId)?.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{cases.find((c) => c.id === selectedCaseId)?.description}</p>
             </div>

            <div className={`p-4 rounded border ${theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
              <div className="text-xs font-bold text-gray-500 mb-2 uppercase">Case Communications</div>
              <div className="max-h-48 overflow-auto space-y-2 mb-3">
                {cases.find((c) => c.id === selectedCaseId)?.messages.length === 0 ? <div className="text-sm italic text-gray-400">No messages yet.</div> :
                  cases.find((c) => c.id === selectedCaseId)?.messages.map((m) => (
                  <div key={m.id} className="p-2 rounded bg-gray-100 dark:bg-gray-800 text-sm">
                    <span className="font-bold text-indigo-500">{m.from}</span>: {m.text}
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message..." className={`flex-1 px-3 py-2 rounded border ${theme === "dark" ? "bg-gray-800 border-gray-600" : "bg-white"}`} />
                <button onClick={() => sendMessage("All")} className="px-4 py-2 rounded bg-indigo-600 text-white">Send</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">Select a case to view details.</div>
        )}

        {/* New Case Modal Overlay */}
        {showNew && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
             <div className={`w-full max-w-lg p-6 rounded-xl ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white"}`}>
                <h3 className="text-lg font-bold mb-4">File New Case</h3>
                <input value={newCase.title} onChange={(e) => setNewCase({ ...newCase, title: e.target.value })} placeholder="Case Title" className="w-full mb-3 px-3 py-2 border rounded text-black" />
                <textarea value={newCase.description} onChange={(e) => setNewCase({ ...newCase, description: e.target.value })} placeholder="Case Facts / Description" className="w-full mb-3 px-3 py-2 border rounded text-black h-32" />
                <div className="flex justify-end gap-2">
                   <button onClick={() => setShowNew(false)} className="px-4 py-2 rounded border">Cancel</button>
                   <button onClick={submitCase} className="px-4 py-2 rounded bg-indigo-600 text-white">Submit</button>
                </div>
             </div>
          </div>
        )}
      </div>

      <aside>
         <div className={`p-4 rounded-xl shadow border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
            <div className="text-xs font-bold uppercase text-gray-500 mb-3">My Cases</div>
            {cases.map((c) => (
                <button key={c.id} onClick={() => setSelectedCaseId(c.id)} className={`w-full text-left p-2 mb-1 rounded text-sm ${selectedCaseId === c.id ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}>
                   {c.title}
                </button>
            ))}
         </div>
      </aside>
    </section>
  );
}

/* ---------------- Judge Page ---------------- */
function JudgePage({ user, cases, setCases, selectedCaseId, setSelectedCaseId, fakeAiResponse, theme }) {
  const [favored, setFavored] = useState("plaintiff");

  const evaluate = () => {
    if (!user || user.role !== "Judge") return alert("Only Judges can issue rulings.");
    const sc = cases.find((c) => c.id === selectedCaseId);
    if (!sc) return alert("Select a case");
    const resp = fakeAiResponse("Evaluate and decide", { favored, caseTitle: sc.title });
    const ruling = { id: "R-" + Date.now(), text: resp, ts: Date.now(), judge: user.name };
    setCases((prev) => prev.map((c) => (c.id === selectedCaseId ? { ...c, ruling, status: "Ruled", timeline: [...c.timeline, { ts: Date.now(), actor: "Judge:" + user.name, action: "Issued ruling" }] } : c)));
  };

  if (!user) return <AccessDenied theme={theme} setRoute={() => {}} />;

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className={`lg:col-span-2 rounded-2xl p-6 shadow border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
         <h2 className="text-xl font-bold mb-4">Judicial Chamber</h2>
         
         {selectedCaseId ? (
            <div className="space-y-6">
               <div className="p-4 rounded bg-gray-50 dark:bg-gray-900 border dark:border-gray-700">
                  <h3 className="font-semibold text-lg">{cases.find((c) => c.id === selectedCaseId)?.title}</h3>
                  <div className="flex gap-2 mt-4 items-center flex-wrap">
                     <span className="text-sm font-bold">Ruling Decision:</span>
                     <select value={favored} onChange={(e) => setFavored(e.target.value)} className={`px-3 py-1 rounded border ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white"}`}>
                        <option value="plaintiff">Favor Plaintiff</option>
                        <option value="defendant">Favor Defendant</option>
                     </select>
                     <button onClick={evaluate} className="px-4 py-1 rounded bg-red-600 text-white font-medium hover:bg-red-700">Issue Ruling</button>
                  </div>
               </div>
               
               {/* Ruling Display */}
               {cases.find(c => c.id === selectedCaseId)?.ruling && (
                  <div className="p-4 rounded border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20">
                     <div className="text-xs font-bold text-green-700 dark:text-green-400 uppercase mb-2">Final Verdict</div>
                     <p className="text-sm whitespace-pre-wrap">{cases.find(c => c.id === selectedCaseId).ruling.text}</p>
                  </div>
               )}
            </div>
         ) : <div className="text-gray-500">Select a case to adjudicate.</div>}
      </div>
      
      <aside>
        <div className={`p-4 rounded-xl shadow border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
            <div className="text-xs font-bold uppercase text-gray-500 mb-3">Pending Cases</div>
            {cases.map((c) => (
                <button key={c.id} onClick={() => setSelectedCaseId(c.id)} className={`w-full text-left p-2 mb-1 rounded text-sm ${selectedCaseId === c.id ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}>
                   <div className="flex justify-between">
                      <span>{c.title}</span>
                      {c.ruling && <span className="text-green-500">✓</span>}
                   </div>
                </button>
            ))}
         </div>
      </aside>
    </section>
  );
}

function AccessDenied({ theme, setRoute }) {
   return (
      <div className={`p-8 rounded-2xl text-center border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
         <div className="text-4xl mb-4">🔒</div>
         <h2 className="text-xl font-bold">Access Restricted</h2>
         <p className="text-gray-500 mt-2">You must be logged in to view this workspace.</p>
         {/* Added a login button here for better UX */}
         <button 
           onClick={() => setRoute("login")} 
           className="mt-4 px-4 py-2 rounded bg-indigo-600 text-white font-medium hover:bg-indigo-700"
         >
           Go to Login
         </button>
      </div>
   );
}

/* ---------------- Sample Data ---------------- */
function sampleCases() {
  return [
    {
      id: "CASE-001",
      title: "Breach of Contract — Service Agreement",
      description: "Plaintiff claims Defendant failed to deliver contracted services within the agreed timeline. Key witnesses: A, B.",
      tags: ["contract", "civil"],
      evidence: [],
      status: "Under Review",
      timeline: [],
      messages: [],
      ruling: null,
    },
    {
      id: "CASE-002",
      title: "Neighbor Dispute — Noise Complaint",
      description: "Defendant alleges plaintiff created excessive noise after 10 PM. Seeking injunction and damages.",
      tags: ["tort"],
      evidence: [],
      status: "Submitted",
      timeline: [],
      messages: [],
      ruling: null,
    },
  ];
}