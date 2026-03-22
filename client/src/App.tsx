import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Video, Settings, Play, Download, Loader2, Music, BookOpen } from 'lucide-react';

const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:3000/api/v1' : '/api/v1';
const OUTPUT_BASE = window.location.hostname === 'localhost' ? 'http://localhost:3000' : '';

function App() {
  const [reciters, setReciters] = useState<any[]>([]);
  const [surahs, setSurahs] = useState<any[]>([]);
  const [selectedReciter, setSelectedReciter] = useState('');
  const [selectedSurah, setSelectedSurah] = useState(1);
  const [startAyah, setStartAyah] = useState(1);
  const [endAyah, setEndAyah] = useState(7);
  const [resolution, setResolution] = useState('1080x1920');
  const [fps, setFps] = useState(30);
  const [bgColor, setBgColor] = useState('#000000');
  const [textColor, setTextColor] = useState('#ffffff');
  
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('idle');
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    axios.get(`${API_BASE}/quran/reciters`).then(res => setReciters(res.data));
    axios.get(`${API_BASE}/quran/surahs`).then(res => setSurahs(res.data));
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 w-full">
      <header className="max-w-4xl mx-auto mb-12 flex items-center gap-3">
        <div className="bg-indigo-600 p-3 rounded-2xl">
          <Video className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Quran Video Maker
          </h1>
          <p className="text-slate-400">Professional Quranic Videos in Seconds</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8 bg-slate-900/50 p-8 rounded-3xl border border-slate-800 shadow-xl">
          <section className="space-y-6">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold mb-4">
              <Music className="w-5 h-5" />
              <h2>Audio Selection</h2>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-slate-400 ml-1">Choose Reciter (Qari)</label>
              <select 
                className="w-full bg-slate-800 border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={selectedReciter}
                onChange={(e) => setSelectedReciter(e.target.value)}
              >
                <option value="">Select Reciter</option>
                {reciters.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-slate-400 ml-1">Surah</label>
                <select 
                  className="w-full bg-slate-800 border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={selectedSurah}
                  onChange={(e) => setSelectedSurah(Number(e.target.value))}
                >
                  {surahs.map(s => <option key={s.id} value={s.id}>{s.id}. {s.name_simple}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400 ml-1">From Ayah</label>
                <input 
                  type="number" 
                  className="w-full bg-slate-800 border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={startAyah}
                  onChange={(e) => setStartAyah(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400 ml-1">To Ayah</label>
                <input 
                  type="number" 
                  className="w-full bg-slate-800 border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={endAyah}
                  onChange={(e) => setEndAyah(Number(e.target.value))}
                />
              </div>
            </div>
          </section>

          <section className="space-y-6 pt-6 border-t border-slate-800">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold mb-4">
              <Settings className="w-5 h-5" />
              <h2>Video Customization</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-slate-400 ml-1">Format</label>
                <div className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-300">
                  Shorts/Reels (9:16) - 1080x1920
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400 ml-1">Frame Rate</label>
                <select 
                  className="w-full bg-slate-800 border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
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
                <label className="text-sm text-slate-400 ml-1">Text Color (Random if not set)</label>
                <input 
                  type="color" 
                  className="w-full h-12 bg-slate-800 border-slate-700 rounded-xl px-2 py-2 cursor-pointer"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400 ml-1">Background</label>
                <div className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-300 text-xs">
                  Randomize from 10 HD backgrounds
                </div>
              </div>
            </div>
          </section>

          <button 
            onClick={handleGenerate}
            disabled={!selectedReciter || status === 'started' || status === 'pending'}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
          >
            {status === 'started' || status === 'pending' ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Generating...</>
            ) : (
              <><Play className="w-5 h-5" /> Generate Video</>
            )}
          </button>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800 flex-1 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[400px]">
            {!videoUrl && status === 'idle' && (
              <div className="space-y-4">
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto">
                  <BookOpen className="w-10 h-10 text-slate-600" />
                </div>
                <h3 className="text-xl font-medium text-slate-300">Preview Area</h3>
                <p className="text-slate-500 max-w-xs">Your Quranic video will appear here after generation</p>
              </div>
            )}

            {(status === 'started' || status === 'pending') && (
              <div className="w-full max-w-sm space-y-6">
                <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-indigo-400 font-medium">{Math.round(progress)}% Processed</p>
              </div>
            )}

            {videoUrl && (
              <div className="w-full h-full space-y-6">
                <video 
                  src={videoUrl} 
                  controls 
                  className={`mx-auto rounded-2xl shadow-2xl border border-slate-800 ${resolution === '1080x1920' ? 'h-[500px]' : 'w-full'}`}
                />
                <a 
                  href={videoUrl} 
                  download 
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded-xl transition-all"
                >
                  <Download className="w-5 h-5" /> Download 1080p Video
                </a>
              </div>
            )}

            {status === 'failed' && (
              <div className="text-red-400 space-y-2">
                <p className="font-bold text-xl">Generation Failed</p>
                <p className="text-sm opacity-80">Please try again with different parameters</p>
              </div>
            )}
          </div>
          
          <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
            <h3 className="text-indigo-400 font-semibold mb-2">API Documentation</h3>
            <p className="text-slate-400 text-sm mb-4">Integrate this engine into your own apps. Full documentation available at:</p>
            <a 
              href="/docs" 
              target="_blank"
              className="text-white hover:text-indigo-400 underline underline-offset-4 text-sm font-mono"
            >
              http://localhost:3000/docs
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
