/**
 * @project QuranVideoGeneratorAPI
 * @author Ammar Elkhateeb (AmmarBasha2011)
 * @team INEX Team
 * @license Custom - Personal Use Only
 * @copyright 2026
 */

import ffmpeg from 'fluent-ffmpeg';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import ffprobeStatic from 'ffprobe-static';
import ffmpegStatic from 'ffmpeg-static';

if (ffmpegStatic) {
    ffmpeg.setFfmpegPath(ffmpegStatic);
}
ffmpeg.setFfprobePath(ffprobeStatic.path);

interface VideoRequest {
  reciter: string;
  reciterName: string; 
  surah: number;
  surahName: string;
  startAyah: number;
  endAyah: number;
  resolution?: string; 
  fps?: number;
  template?: {
    background?: string;
    textColor?: string;
    animation?: string;
  };
}

const COLORS = ['#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1', '#fffbeb', '#f0f9ff'];

const FONT_PATHS = [
    '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
    '/usr/share/fonts/truetype/freefont/FreeSans.ttf',
    '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf'
];

const getFontPath = () => {
    for (const p of FONT_PATHS) {
        if (fs.existsSync(p)) return p;
    }
    return ''; 
};

const FONT_PATH = getFontPath();

// Calm Style Constants
const BRAND_COLORS = {
    CREAM: '#F5F5DC',
    GOLD: '#D4AF37',
    SOFT_BLUE: '#A8DADC',
    DEEP_NAVY: '#050a18'
};

// ASS Color conversion (RRGGBB -> &HAABBGGRR)
const toASSColor = (hex: string) => {
    const r = hex.substring(1, 3);
    const g = hex.substring(3, 5);
    const b = hex.substring(5, 7);
    return `&H00${b}${g}${r}`;
};

const escapeFFmpegText = (text: string) => {
    return text
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "'\\\\''")
        .replace(/:/g, '\\\\:')
        .replace(/%/g, '\\\\%');
};

// Helper to wrap text into lines for FFmpeg
const wrapText = (text: string, maxChars: number) => {
    const words = text.split(' ');
    let lines = [];
    let currentLine = "";
    for (let word of words) {
        if ((currentLine + word).length > maxChars) {
            lines.push(currentLine.trim());
            currentLine = word + " ";
        } else {
            currentLine += word + " ";
        }
    }
    lines.push(currentLine.trim());
    return lines.join('\n');
};

const _ffmpeg_hash = "FFMPEG-INEX-2026-AB";
export const processVideo = async (
  jobId: string,
  request: VideoRequest,
  onProgress: (progress: number) => void
): Promise<string> => {
  if (!_ffmpeg_hash) throw new Error("Unauthorized");
  const { reciter, reciterName, surah, surahName, startAyah, endAyah, resolution = '1080x1920' } = request;
  const tempDir = path.join(__dirname, '../../temp', jobId);
  const outputDir = path.join(__dirname, '../../outputs');
  const outputFile = path.join(outputDir, `${jobId}.mp4`);
  
  // Select random background
  const bgDir = path.join(__dirname, '../../assets/backgrounds');
  let bgImagePath = path.join(__dirname, '../../free-photo-of-holy-quran-under-sunlight.webp');

  if (fs.existsSync(bgDir)) {
      const bgs = fs.readdirSync(bgDir).filter(f => f.endsWith('.jpg') || f.endsWith('.webp') || f.endsWith('.png'));
      if (bgs.length > 0) {
          const randomBg = bgs[Math.floor(Math.random() * bgs.length)];
          bgImagePath = path.join(bgDir, randomBg);
      }
  }

  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

  try {
    onProgress(5);
    // 1. Download Audio and get timings (Parallelized)
    const ayahs = Array.from({ length: endAyah - startAyah + 1 }, (_, i) => startAyah + i);

    const ayahResults = await Promise.all(ayahs.map(async (ayah) => {
      const surahStr = surah.toString().padStart(3, '0');
      const ayahStr = ayah.toString().padStart(3, '0');
      const audioPath = path.join(tempDir, `${surahStr}${ayahStr}.mp3`);
      
      // Fallback mechanism for audio
      const audioSources = [
        `https://everyayah.com/data/${reciter}/${surahStr}${ayahStr}.mp3`,
        `https://verses.quran.com/${reciter.split('_')[0]}/mp3/${surahStr}${ayahStr}.mp3` // Heuristic fallback
      ];

      let downloaded = false;
      for (const source of audioSources) {
        try {
          const response = await axios.get(source, { responseType: 'stream', timeout: 10000 });
          const writer = fs.createWriteStream(audioPath);
          response.data.pipe(writer);
          await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
          });
          downloaded = true;
          break;
        } catch (e) {
          console.warn(`Failed to download from ${source}, trying next...`);
        }
      }

      if (!downloaded) throw new Error(`Failed to download audio for Ayah ${ayah}`);

      // Get duration
      let duration = 0;
      await new Promise((resolve) => {
          ffmpeg.ffprobe(audioPath, (err, metadata) => {
              if (!err && metadata.format.duration) duration = metadata.format.duration;
              resolve(null);
          });
      });

      // Fetch translation
      let translation = "";
      try {
        const res = await axios.get(`https://api.quran.com/api/v4/verses/by_key/${surah}:${ayah}?translations=20`);
        if (res.data.verse.translations?.length > 0) {
          translation = res.data.verse.translations[0].text.replace(/<[^>]*>?/gm, ''); 
        }
      } catch (e) {
          translation = "[Translation not available]";
      }

      return { ayah, audioPath, duration, translation };
    }));

    const audioFiles: string[] = [];
    const ayahData: { text: string; start: number; end: number }[] = [];
    let currentTime = 0;

    for (const res of ayahResults) {
      ayahData.push({
        text: `(${res.ayah}) ${res.translation}`,
        start: currentTime,
        end: currentTime + res.duration
      });
      currentTime += res.duration;
      audioFiles.push(res.audioPath);
    }

    onProgress(35);
    // 2. Concatenate Audio
    const concatenatedAudio = path.join(tempDir, 'full_audio.mp3');
    await new Promise((resolve, reject) => {
      const command = ffmpeg();
      audioFiles.forEach(file => command.input(file));
      command.on('end', resolve)
        .on('error', reject)
        .mergeToFile(concatenatedAudio, tempDir);
    });

    onProgress(50);
    const [width, height] = resolution.split('x').map(Number);
    
    // 3. Generate ASS subtitles (Workaround for missing drawtext)
    const assPath = path.join(tempDir, 'subtitles.ass');
    const formatTime = (s: number) => {
        const ms = Math.floor((s % 1) * 100);
        const sec = Math.floor(s % 60);
        const min = Math.floor((s / 60) % 60);
        const hr = Math.floor(s / 3600);
        return `${hr}:${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
    };

    const assContent = `[Script Info]
ScriptType: v4.00+
PlayResX: ${width}
PlayResY: ${height}

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Watermark,${FONT_PATH ? path.basename(FONT_PATH, '.ttf') : 'sans-serif'},35,&H80FFFFFF,&H00000000,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,0,0,8,10,10,50,1
Style: SurahName,${FONT_PATH ? path.basename(FONT_PATH, '.ttf') : 'sans-serif'},75,${toASSColor(BRAND_COLORS.GOLD)},&H00000000,&H00000000,&H80000000,1,0,0,0,100,100,2,0,1,1,2,8,10,10,200,1
Style: ReciterName,${FONT_PATH ? path.basename(FONT_PATH, '.ttf') : 'sans-serif'},40,&H4DFFFFFF,&H00000000,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,0,0,2,10,10,150,1
Style: AyahText,${FONT_PATH ? path.basename(FONT_PATH, '.ttf') : 'sans-serif'},52,${toASSColor(BRAND_COLORS.CREAM)},&H00000000,${toASSColor(BRAND_COLORS.GOLD)},&H80000000,1,0,0,0,100,100,0,0,1,1,2,5,50,50,10,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
Dialogue: 0,0:00:00.00,${formatTime(currentTime)},Watermark,,0,0,0,,{\\fad(500,500)}INEX Team
Dialogue: 0,0:00:00.00,${formatTime(currentTime)},SurahName,,0,0,0,,{\\fad(1000,1000)}${surahName.toUpperCase()}
Dialogue: 0,0:00:00.00,${formatTime(currentTime)},ReciterName,,0,0,0,,{\\fad(1000,1000)}Reciter: ${reciterName}
${ayahData.map(a => `Dialogue: 1,${formatTime(a.start)},${formatTime(a.end)},AyahText,,0,0,0,,{\\fad(400,400)}${a.text.replace(/\n/g, '\\N')}`).join('\n')}
`;
    fs.writeFileSync(assPath, assContent);

    // Create filters array
    const filters: any[] = [
        {
            filter: 'scale',
            options: `${width*2}:${height*2}` // Double scale for zoompan quality
        },
        {
          filter: 'zoompan',
          options: {
            z: 'min(zoom+0.0008,1.5)',
            x: 'iw/2-(iw/zoom)/2',
            y: 'ih/2-(ih/zoom)/2',
            d: currentTime * 25, // Assuming 25fps for duration
            s: `${width}x${height}`,
            fps: 25
          }
        },
        // INEX Style Background Overlay (Deep Navy)
        {
            filter: 'drawbox',
            options: {
                x: 0, y: 'ih/4', w: 'iw', h: 'ih/2',
                color: `${BRAND_COLORS.DEEP_NAVY}@0.7`,
                t: 'fill'
            }
        },
        // Glassmorphism Border (Gold)
        {
            filter: 'drawbox',
            options: {
                x: 'iw*0.05', y: 'ih/4', w: 'iw*0.9', h: 'ih/2',
                color: `${BRAND_COLORS.GOLD}@0.2`,
                t: 2
            }
        },
        // Subtitles Filter (Watermark, Headers, Ayahs)
        {
            filter: 'ass',
            options: assPath
        }
    ];

    return new Promise((resolve, reject) => {
      const command = ffmpeg()
        .input(bgImagePath)
        .loop()
        .input(concatenatedAudio)
        .outputOptions([
          '-c:v libx264',
          '-preset ultrafast',
          '-crf 28',
          '-c:a aac',
          '-b:a 128k',
          '-pix_fmt yuv420p',
          '-shortest'
        ])
        .videoFilters(filters)
        .on('start', (cmd) => {
          console.log('FFmpeg started:', cmd);
        })
        .on('progress', (progress) => {
           if (progress.percent) {
             onProgress(50 + (progress.percent * 0.5));
           } else if (currentTime > 0 && progress.timemark) {
             const timeParts = progress.timemark.split(':');
             const time = (+timeParts[0] * 3600) + (+timeParts[1] * 60) + (+timeParts[2]);
             const percent = Math.min((time / currentTime) * 100, 99);
             onProgress(50 + (percent * 0.5));
           }
        })
        .on('end', () => {
          if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
          resolve(`/outputs/${jobId}.mp4`);
        })
        .on('error', (err, stdout, stderr) => {
          console.error('FFmpeg Error:', err.message);
          console.error('FFmpeg Stderr:', stderr);
          reject(err);
        });
        
        command.save(outputFile);
    });

  } catch (error) {
    if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
    throw error;
  }
};
