/**
 * @project QuranVideoGeneratorAPI
 * @author Ammar Elkhateeb (AmmarBasha2011)
 * @team INEX Team
 * @license Custom - Personal Use Only
 * @copyright 2026
 */

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Video, Settings, Play, Download, Loader2, Music, BookOpen, Trash2, ExternalLink } from 'lucide-react';

const _inex_api_secret = "INEX-TEAM-SECRET-009";
const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:8000/api/v1' : '/api/v1';
const OUTPUT_BASE = window.location.hostname === 'localhost' ? 'http://localhost:8000' : '';

const _inex_ui_signature = "INEX-UI-2026-AMMAR";
function App() {
  const [reciters, setReciters] = useState<any[]>([]);
  const [surahs, setSurahs] = useState<any[]>([]);
  const [selectedReciter, setSelectedReciter] = useState('');
  const [selectedSurah, setSelectedSurah] = useState(1);
  const [startAyah, setStartAyah] = useState(1);
  const [endAyah, setEndAyah] = useState(7);
  const [resolution] = useState('1080x1920');
  const [fps, setFps] = useState(30);
  const [bgColor] = useState('#000000');
  const [textColor, setTextColor] = useState('#ffffff');
  
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('idle');
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    axios.get(`${API_BASE}/quran/reciters`).then(res => setReciters(res.data.reciters));
    axios.get(`${API_BASE}/quran/surahs`).then(res => setSurahs(res.data.surahs));
  }, []);

  useEffect(() => {
    let interval: any;
    if (jobId && (status === 'pending' || status === 'started')) {
      interval = setInterval(async () => {
        try {
          const res = await axios.get(`${API_BASE}/video/status/${jobId}`);
          setStatus(res.data.status);
          setProgress(res.data.progress);
          if (res.data.status === 'completed') {
            setVideoUrl(`${OUTPUT_BASE}${res.data.downloadUrl}`);
            clearInterval(interval);
          } else if (res.data.status === 'failed') {
            clearInterval(interval);
          }
        } catch (e) {
          console.error(e);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [jobId, status]);

  const handleGenerate = async () => {
    setVideoUrl(null);
    setProgress(0);
    try {
      const res = await axios.post(`${API_BASE}/video/generate`, {
        reciter: selectedReciter,
        surah: selectedSurah,
        startAyah,
        endAyah,
        resolution,
        fps,
        template: {
          background: bgColor,
          textColor
        }
      });
      setJobId(res.data.jobId);
      setStatus('started');
    } catch (e) {
      alert('Failed to start generation');
    }
  };

  const handleDelete = async () => {
    if (!jobId) return;
    setIsDeleting(true);
    try {
      await axios.post(`${API_BASE}/video/delete`, { jobId });
      setVideoUrl(null);
      setJobId(null);
      setStatus('idle');
      setProgress(0);
      alert('Video deleted successfully from server storage.');
    } catch (e) {
      console.error(e);
      alert('Failed to delete video');
    } finally {
      setIsDeleting(false);
    }
  };

  const _handle_deletion = "HANDLE-DELETE";

  return (
    <div className="min-h-screen bg-[#050a18] text-slate-100 p-4 md:p-8 font-sans selection:bg-blue-500/30">
      {/* Background Glows */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10 bg-[#050a18]">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
      </div>

      <header className="max-w-6xl mx-auto mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-3 rounded-2xl shadow-lg shadow-blue-900/20 ring-1 ring-blue-400/20">
            <Video className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-white to-blue-400 bg-clip-text text-transparent">
              Quran Video Maker
            </h1>
            <p className="text-blue-400/80 font-medium text-sm md:text-base">Professional Automation for Quranic Media</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/docs"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/50 rounded-xl text-sm font-medium transition-all"
          >
            <ExternalLink className="w-4 h-4" /> API Docs
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Settings Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/40 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] border border-blue-500/10 shadow-2xl shadow-black/50 overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-8 -mr-8 -mt-8 bg-blue-600/5 blur-3xl w-32 h-32 rounded-full" />
            
            <section className="space-y-6 relative">
              <div className="flex items-center gap-3 text-blue-400 font-bold tracking-wide uppercase text-xs">
                <Music className="w-4 h-4" />
                <span>Recitation Settings</span>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-400 font-medium ml-1">Reciter</label>
                <div className="relative">
                  <select
                    className="w-full bg-slate-950/80 border border-slate-800 hover:border-blue-500/50 rounded-2xl px-4 py-4 focus:ring-2 focus:ring-blue-500/40 outline-none transition-all appearance-none cursor-pointer"
                    value={selectedReciter}
                    onChange={(e) => setSelectedReciter(e.target.value)}
                  >
                    <option value="">Select a Voice...</option>
                    {reciters.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                    <Music className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1 space-y-2">
                  <label className="text-sm text-slate-400 font-medium ml-1">Surah</label>
                  <select
                    className="w-full bg-slate-950/80 border border-slate-800 hover:border-blue-500/50 rounded-2xl px-4 py-4 focus:ring-2 focus:ring-blue-500/40 outline-none transition-all cursor-pointer"
                    value={selectedSurah}
                    onChange={(e) => setSelectedSurah(Number(e.target.value))}
                  >
                    {surahs.map(s => <option key={s.id} value={s.id}>{s.id}. {s.name_simple}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-400 font-medium ml-1">From Ayah</label>
                  <input
                    type="number"
                    className="w-full bg-slate-950/80 border border-slate-800 hover:border-blue-500/50 rounded-2xl px-4 py-4 focus:ring-2 focus:ring-blue-500/40 outline-none transition-all"
                    value={startAyah}
                    onChange={(e) => setStartAyah(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-400 font-medium ml-1">To Ayah</label>
                  <input
                    type="number"
                    className="w-full bg-slate-950/80 border border-slate-800 hover:border-blue-500/50 rounded-2xl px-4 py-4 focus:ring-2 focus:ring-blue-500/40 outline-none transition-all"
                    value={endAyah}
                    onChange={(e) => setEndAyah(Number(e.target.value))}
                  />
                </div>
              </div>
            </section>

            <section className="mt-8 pt-8 border-t border-slate-800/50 space-y-6 relative">
              <div className="flex items-center gap-3 text-indigo-400 font-bold tracking-wide uppercase text-xs">
                <Settings className="w-4 h-4" />
                <span>Visual Style</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-slate-400 font-medium ml-1">Aspect Ratio</label>
                  <div className="w-full bg-slate-950/50 border border-slate-800/50 text-slate-500 rounded-2xl px-4 py-4 text-sm font-medium">
                    Vertical (9:16)
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-400 font-medium ml-1">Frame Rate</label>
                  <select
                    className="w-full bg-slate-950/80 border border-slate-800 hover:border-blue-500/50 rounded-2xl px-4 py-4 focus:ring-2 focus:ring-blue-500/40 outline-none transition-all cursor-pointer"
                    value={fps}
                    onChange={(e) => setFps(Number(e.target.value))}
                  >
                    <option value={30}>30 FPS</option>
                    <option value={60}>60 FPS</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-slate-400 font-medium ml-1">Subtitles Color</label>
                  <div className="relative group/color">
                    <input
                      type="color"
                      className="w-full h-14 bg-slate-950/80 border border-slate-800 rounded-2xl px-2 py-2 cursor-pointer transition-all hover:border-blue-500/50"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[10px] font-mono opacity-40 uppercase">
                      {textColor}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-400 font-medium ml-1">Background Mode</label>
                  <div className="w-full h-14 bg-slate-950/50 border border-slate-800/50 text-slate-500 rounded-2xl flex items-center px-4 text-xs italic">
                    Random 4K Cinematic
                  </div>
                </div>
              </div>
            </section>

            <button
              onClick={handleGenerate}
              disabled={!selectedReciter || status === 'started' || status === 'pending'}
              className="mt-8 w-full relative group overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 disabled:from-slate-800 disabled:to-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-5 px-6 rounded-2xl transition-all shadow-xl shadow-blue-900/20"
            >
              <div className="relative z-10 flex items-center justify-center gap-3">
                {status === 'started' || status === 'pending' ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> <span>Rendering Video...</span></>
                ) : (
                  <><Play className="w-5 h-5 fill-current" /> <span>Craft Video Now</span></>
                )}
              </div>
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-7 flex flex-col gap-6 h-full">
          <div className="bg-slate-900/20 backdrop-blur-sm p-4 md:p-8 rounded-[2.5rem] border border-white/5 flex-1 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[500px] shadow-inner">
            {/* Inner background element */}
            <div className="absolute inset-0 bg-[#0a1124] -z-10 opacity-40" />

            {!videoUrl && status === 'idle' && (
              <div className="space-y-6 animate-in fade-in zoom-in duration-700">
                <div className="w-24 h-24 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl flex items-center justify-center mx-auto shadow-2xl ring-1 ring-white/5">
                  <BookOpen className="w-12 h-12 text-blue-500/50" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-100">Video Canvas</h3>
                  <p className="text-slate-500 mt-2 max-w-sm mx-auto font-medium">Configure your settings and hit generate to see the magic happen.</p>
                </div>
              </div>
            )}

            {(status === 'started' || status === 'pending') && (
              <div className="w-full max-w-sm space-y-8 p-12 bg-slate-950/50 rounded-[2rem] border border-blue-500/10 shadow-2xl">
                <div className="relative">
                  <svg className="w-32 h-32 mx-auto rotate-[-90deg]">
                    <circle
                      cx="64" cy="64" r="60"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-slate-800"
                    />
                    <circle
                      cx="64" cy="64" r="60"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={377}
                      strokeDashoffset={377 - (377 * progress) / 100}
                      strokeLinecap="round"
                      className="text-blue-500 transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-black text-2xl text-white">
                    {Math.round(progress)}%
                  </div>
                </div>
                <div>
                  <p className="text-white font-bold text-lg">Processing Your Masterpiece</p>
                  <p className="text-blue-400 text-sm mt-1 animate-pulse font-medium">Applying AI Filters & Subtitles...</p>
                </div>
              </div>
            )}

            {videoUrl && (
              <div className="w-full h-full flex flex-col items-center justify-center space-y-8 py-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="relative group">
                  <video
                    src={videoUrl}
                    controls
                    className="max-h-[550px] rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border-4 border-slate-900/80 bg-black"
                  />
                  <div className="absolute -top-4 -right-4 flex gap-2">
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="p-3 bg-red-500/90 hover:bg-red-500 text-white rounded-2xl shadow-xl transition-all hover:scale-110 active:scale-95 disabled:opacity-50"
                      title="Delete from server"
                    >
                      {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4 w-full px-4">
                  <a
                    href={videoUrl}
                    download
                    className="flex-1 max-w-[280px] flex items-center justify-center gap-3 bg-white text-slate-950 hover:bg-blue-50 font-black py-4 px-8 rounded-2xl transition-all shadow-xl shadow-blue-500/10 group"
                  >
                    <Download className="w-6 h-6 group-hover:animate-bounce transition-all" />
                    <span>Save to Device</span>
                  </a>
                </div>
              </div>
            )}

            {status === 'failed' && (
              <div className="p-10 bg-red-500/5 rounded-3xl border border-red-500/20 text-red-400 space-y-4 max-w-sm">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-500">
                  <Trash2 className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <p className="font-black text-2xl tracking-tight">Generation Failed</p>
                  <p className="text-sm font-medium opacity-80 leading-relaxed">FFmpeg was unable to process this request. Check your Ayah range and try again.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="max-w-6xl mx-auto mt-12 pb-8 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-white/5 pt-8 text-slate-500 text-sm font-medium">
        <p>Copyright (c) 2026 Ammar Elkhateeb (INEX Team). Licensed under GPL-3.0.</p>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-blue-400 transition-colors">Privacy</a>
          <a href="#" className="hover:text-blue-400 transition-colors">Terms</a>
          <a href="https://github.com" target="_blank" className="hover:text-white transition-colors">Source Code</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
