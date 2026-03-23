import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { processVideo } from '../services/video.service';
import { RECITERS } from '../constants/reciters';

const jobs: Record<string, { status: string; progress: number; downloadUrl?: string; error?: string }> = {};

export const generateVideo = async (req: Request, res: Response) => {
  const { reciter, surah, startAyah, endAyah, resolution, fps, template } = req.body;
  
  if (!reciter || !surah || !startAyah || !endAyah) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const reciterObj = RECITERS.find(r => r.id === reciter);
  const reciterName = reciterObj ? reciterObj.name : 'Unknown Reciter';

  let surahName = `Surah ${surah}`;
  try {
    const sRes = await axios.get(`https://api.quran.com/api/v4/chapters/${surah}`);
    surahName = sRes.data.chapter.name_simple;
  } catch (e) {
    console.error('Failed to fetch surah name');
  }

  const jobId = uuidv4();
  jobs[jobId] = { status: 'pending', progress: 0 };

  // Start processing in background
  processVideo(jobId, { 
    reciter, 
    reciterName, 
    surah, 
    surahName,
    startAyah, 
    endAyah, 
    resolution, 
    fps, 
    template 
  }, (progress) => {
    jobs[jobId].progress = progress;
  })
    .then((url) => {
      jobs[jobId].status = 'completed';
      jobs[jobId].downloadUrl = url;
    })
    .catch((err) => {
      jobs[jobId].status = 'failed';
      jobs[jobId].error = err.message;
    });

  res.json({ jobId, status: 'started' });
};

export const getVideoStatus = (req: Request, res: Response) => {
  const jobId = req.params.jobId as string;
  const job = jobs[jobId];

  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  res.json(job);
};

export const deleteVideo = async (req: Request, res: Response) => {
  const { jobId, filePath } = req.body;

  if (!jobId && !filePath) {
    return res.status(400).json({ error: 'JobID or filePath is required' });
  }

  let filename: string;
  if (jobId) {
    // Sanitize jobId as well to prevent traversal
    filename = path.basename(`${jobId}.mp4`);
  } else {
    filename = path.basename(filePath);
  }

  const outputPath = path.join(__dirname, '../../outputs', filename);

  try {
    if (fs.existsSync(outputPath)) {
      await fs.promises.unlink(outputPath);

      // Clean up jobs record if jobId was provided
      if (jobId && jobs[jobId]) {
        delete jobs[jobId];
      }

      return res.json({ message: 'Video deleted successfully', filename });
    } else {
      return res.status(404).json({ error: 'Video file not found' });
    }
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to delete video', details: error.message });
  }
};
