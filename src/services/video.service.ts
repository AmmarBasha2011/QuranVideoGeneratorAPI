import ffmpeg from 'fluent-ffmpeg';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import ffprobeStatic from 'ffprobe-static';
import ffmpegStatic from 'ffmpeg-static';

ffmpeg.setFfprobePath(ffprobeStatic.path);
if (ffmpegStatic) {
  ffmpeg.setFfmpegPath(ffmpegStatic);
}

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
const FONT_PATH = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf';

export const processVideo = async (
  jobId: string,
  request: VideoRequest,
  onProgress: (progress: number) => void
): Promise<string> => {
  const { reciter, reciterName, surah, surahName, startAyah, endAyah, resolution = '1080x1920', fps = 30, template } = request;
  const tempDir = path.join(__dirname, '../../temp', jobId);
  const outputDir = path.join(__dirname, '../../outputs');
  const outputFile = path.join(outputDir, `${jobId}.mp4`);
  
  const bgDir = path.join(__dirname, '../../assets/backgrounds');
  let bgImagePath = path.join(__dirname, '../../free-photo-of-holy-quran-under-sunlight.webp');
  
  if (fs.existsSync(bgDir)) {
    const files = fs.readdirSync(bgDir).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
    if (files.length > 0) {
      const randomFile = files[Math.floor(Math.random() * files.length)];
      bgImagePath = path.join(bgDir, randomFile);
    }
  }

  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

  try {
    onProgress(5);
    // 1. Download Audio
    const audioFiles: string[] = [];
    for (let i = startAyah; i <= endAyah; i++) {
      const surahStr = surah.toString().padStart(3, '0');
      const ayahStr = i.toString().padStart(3, '0');
      const audioUrl = `https://everyayah.com/data/${reciter}/${surahStr}${ayahStr}.mp3`;
      const audioPath = path.join(tempDir, `${surahStr}${ayahStr}.mp3`);
      
      const response = await axios.get(audioUrl, { responseType: 'stream' });
      const writer = fs.createWriteStream(audioPath);
      response.data.pipe(writer);
      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });
      audioFiles.push(audioPath);
    }

    onProgress(20);
    // 2. Fetch English Translations
    let fullEnglishText = "";
    for (let i = startAyah; i <= endAyah; i++) {
      try {
        const response = await axios.get(`https://api.quran.com/api/v4/verses/by_key/${surah}:${i}?translations=20`);
        if (response.data.verse.translations && response.data.verse.translations.length > 0) {
          const text = response.data.verse.translations[0].text.replace(/<[^>]*>?/gm, ''); 
          fullEnglishText += `(${i}) ${text} `;
        }
      } catch (e) {
        console.error(`Failed to fetch translation for ${surah}:${i}`);
      }
    }

    onProgress(35);
    // 3. Concatenate Audio
    const concatenatedAudio = path.join(tempDir, 'full_audio.mp3');
    await new Promise((resolve, reject) => {
      const command = ffmpeg();
      audioFiles.forEach(file => command.input(file));
      command.on('end', resolve)
        .on('error', reject)
        .mergeToFile(concatenatedAudio, tempDir);
    });

    // 4. Get total duration
    let totalDuration = 0;
    await new Promise((resolve) => {
      ffmpeg.ffprobe(concatenatedAudio, (err, metadata) => {
        if (!err && metadata.format.duration) {
          totalDuration = metadata.format.duration;
        }
        resolve(null);
      });
    });

    onProgress(50);
    const textColor = template?.textColor || COLORS[Math.floor(Math.random() * COLORS.length)];
    const [width, height] = resolution.split('x').map(Number);
    
    const words = fullEnglishText.split(' ');
    let lines = [];
    let currentLine = "";
    for (let word of words) {
        if ((currentLine + word).length > 25) {
            lines.push(currentLine.trim());
            currentLine = word + " ";
        } else {
            currentLine += word + " ";
        }
    }
    lines.push(currentLine.trim());
    const displayLines = lines.slice(0, 12).join('\n');

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
        .videoFilters([
          {
            filter: 'scale',
            options: `${width}:${height}:force_original_aspect_ratio=increase`
          },
          {
            filter: 'crop',
            options: `${width}:${height}`
          },
          {
            filter: 'drawbox',
            options: {
                x: 0, y: 'ih/4', w: 'iw', h: 'ih/2',
                color: 'black@0.5',
                t: 'fill'
            }
          },
          {
            filter: 'drawtext',
            options: {
              text: `${surahName.toUpperCase()}`,
              fontsize: 60,
              fontcolor: textColor,
              fontfile: FONT_PATH,
              x: '(w-text_w)/2',
              y: 'h/8',
              shadowcolor: 'black@0.8',
              shadowx: 4,
              shadowy: 4
            }
          },
          {
            filter: 'drawtext',
            options: {
              text: displayLines,
              fontsize: 40,
              fontcolor: 'white',
              fontfile: FONT_PATH,
              x: '(w-text_w)/2',
              y: '(h-text_h)/2',
              line_spacing: 10,
              shadowcolor: 'black@0.9',
              shadowx: 2,
              shadowy: 2
            }
          },
          {
            filter: 'drawtext',
            options: {
              text: `Reciter: ${reciterName}`,
              fontsize: 30,
              fontcolor: textColor,
              fontfile: FONT_PATH,
              x: '(w-text_w)/2',
              y: 'h - h/8',
              alpha: 0.8
            }
          }
        ])
        .on('start', (cmd) => {
          console.log('FFmpeg started:', cmd);
        })
        .on('progress', (progress) => {
           if (progress.percent) {
             onProgress(50 + (progress.percent * 0.5));
           } else if (totalDuration > 0 && progress.timemark) {
             const timeParts = progress.timemark.split(':');
             const time = (+timeParts[0] * 3600) + (+timeParts[1] * 60) + (+timeParts[2]);
             const percent = Math.min((time / totalDuration) * 100, 99);
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
