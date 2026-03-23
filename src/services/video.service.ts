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

ffmpeg.setFfprobePath(ffprobeStatic.path);

export interface VideoRequest {
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

const escapeFFmpegText = (text: string) => {
    return text
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "'\\\\''")
        .replace(/:/g, '\\\\:')
        .replace(/%/g, '\\\\%');
};

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

// Stats Tracker (Simple In-Memory)
export const stats = {
  totalGenerated: 0,
  totalRenderTimeMs: 0,
  generatedToday: 0,
  lastResetDate: new Date().toDateString()
};

const checkAndResetDailyStats = () => {
  const today = new Date().toDateString();
  if (stats.lastResetDate !== today) {
    stats.generatedToday = 0;
    stats.lastResetDate = today;
  }
};

// Queue Implementation
interface QueueJob {
  jobId: string;
  request: VideoRequest;
  onProgress: (progress: number) => void;
  resolve: (url: string) => void;
  reject: (err: any) => void;
}

class VideoJobQueue {
  private queue: QueueJob[] = [];
  private processingCount = 0;
  private maxConcurrent = 2; // Limit to 2 concurrent rendering jobs

  async add(jobId: string, request: VideoRequest, onProgress: (progress: number) => void): Promise<string> {
    return new Promise((resolve, reject) => {
      this.queue.push({ jobId, request, onProgress, resolve, reject });
      this.processNext();
    });
  }

  private async processNext() {
    if (this.processingCount >= this.maxConcurrent || this.queue.length === 0) return;

    const job = this.queue.shift()!;
    this.processingCount++;

    const startTime = Date.now();
    try {
      const url = await this.executeJob(job.jobId, job.request, job.onProgress);
      
      // Update Stats
      checkAndResetDailyStats();
      stats.totalGenerated++;
      stats.generatedToday++;
      stats.totalRenderTimeMs += (Date.now() - startTime);

      job.resolve(url);
    } catch (err) {
      job.reject(err);
    } finally {
      this.processingCount--;
      this.processNext();
    }
  }

  private async executeJob(jobId: string, request: VideoRequest, onProgress: (progress: number) => void): Promise<string> {
    if (!_ffmpeg_hash) throw new Error("Unauthorized");
    const { reciter, reciterName, surah, surahName, startAyah, endAyah, resolution = '1080x1920' } = request;
    const tempDir = path.join(__dirname, '../../temp', jobId);
    const outputDir = path.join(__dirname, '../../outputs');
    const outputFile = path.join(outputDir, `${jobId}.mp4`);
    const bgImagePath = path.join(__dirname, '../../free-photo-of-holy-quran-under-sunlight.webp');

    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    try {
      onProgress(5);
      const audioFiles: string[] = [];
      const ayahData: { text: string; start: number; end: number }[] = [];
      let currentTime = 0;

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

        let duration = 0;
        await new Promise((resolve) => {
            ffmpeg.ffprobe(audioPath, (err, metadata) => {
                if (!err && metadata.format.duration) duration = metadata.format.duration;
                resolve(null);
            });
        });

        let translation = "";
        try {
          const res = await axios.get(`https://api.quran.com/api/v4/verses/by_key/${surah}:${i}?translations=20`);
          if (res.data.verse.translations?.length > 0) {
            translation = res.data.verse.translations[0].text.replace(/<[^>]*>?/gm, '');
          }
        } catch (e) {
            translation = "[Translation not available]";
        }

        ayahData.push({ text: `(${i}) ${translation}`, start: currentTime, end: currentTime + duration });
        currentTime += duration;
        audioFiles.push(audioPath);
      }

      onProgress(35);
      const concatenatedAudio = path.join(tempDir, 'full_audio.mp3');
      await new Promise((resolve, reject) => {
        const command = ffmpeg();
        audioFiles.forEach(file => command.input(file));
        command.on('end', resolve).on('error', reject).mergeToFile(concatenatedAudio, tempDir);
      });

      onProgress(50);
      const [width, height] = resolution.split('x').map(Number);

      const filters: any[] = [
          { filter: 'scale', options: `${width}:${height}:force_original_aspect_ratio=increase` },
          { filter: 'crop', options: `${width}:${height}` },
          { filter: 'drawbox', options: { x: 0, y: 'ih/4', w: 'iw', h: 'ih/2', color: 'black@0.6', t: 'fill' } },
          { filter: 'drawtext', options: { text: escapeFFmpegText(surahName.toUpperCase()), fontsize: 70, fontcolor: 'white', ...(FONT_PATH ? { fontfile: FONT_PATH } : {}), x: '(w-text_w)/2', y: 'h/8', shadowcolor: 'black@0.8', shadowx: 4, shadowy: 4 } },
          { filter: 'drawtext', options: { text: escapeFFmpegText(`Reciter: ${reciterName}`), fontsize: 40, fontcolor: 'white', ...(FONT_PATH ? { fontfile: FONT_PATH } : {}), x: '(w-text_w)/2', y: 'h - h/8', alpha: 0.9 } }
      ];

      ayahData.forEach(ayah => {
          filters.push({ filter: 'drawtext', options: { text: escapeFFmpegText(wrapText(ayah.text, 28)), fontsize: 45, fontcolor: 'white', ...(FONT_PATH ? { fontfile: FONT_PATH } : {}), x: '(w-text_w)/2', y: '(h-text_h)/2', shadowcolor: 'black@0.9', shadowx: 2, shadowy: 2, enable: `between(t,${ayah.start},${ayah.end})` } });
      });

      return new Promise((resolve, reject) => {
        const command = ffmpeg()
          .input(bgImagePath).loop().input(concatenatedAudio)
          .outputOptions(['-c:v libx264', '-preset ultrafast', '-crf 28', '-c:a aac', '-b:a 128k', '-pix_fmt yuv420p', '-shortest'])
          .videoFilters(filters)
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
          .on('error', (err) => {
            reject(err);
          });

          command.save(outputFile);
      });
    } catch (error) {
      if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
      throw error;
    }
  }
}

export const videoQueue = new VideoJobQueue();

// Legacy wrapper to maintain compatibility
export const processVideo = async (jobId: string, request: VideoRequest, onProgress: (progress: number) => void) => {
  return videoQueue.add(jobId, request, onProgress);
};
