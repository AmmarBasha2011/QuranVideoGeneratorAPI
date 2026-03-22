import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import { videoRoutes } from './routes/video.routes';
import { quranRoutes } from './routes/quran.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Ensure directories exist
const outputDir = path.join(__dirname, '../outputs');
const tempDir = path.join(__dirname, '../temp');
const bgDir = path.join(__dirname, '../assets/backgrounds');

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
if (!fs.existsSync(bgDir)) fs.mkdirSync(bgDir, { recursive: true });

// Static files
app.use('/outputs', express.static(outputDir));

// API Documentation
const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Quran Video Automation API',
    version: '1.1.0',
    description: 'API for generating randomized Quranic shorts for YouTube/TikTok/Reels. Ideal for automation tools.'
  },
  servers: [{ url: `http://localhost:${PORT}` }],
  paths: {
    '/api/v1/video/generate': {
      post: {
        summary: 'Generate a randomized Quranic Short',
        description: 'Generates a 9:16 portrait video with English translations. If background/colors are omitted, they will be randomized for unique content.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['reciter', 'surah', 'startAyah', 'endAyah'],
                properties: {
                  reciter: { type: 'string', description: 'ID of the reciter (e.g. Alafasy_128kbps)' },
                  surah: { type: 'number', description: 'Surah number (1-114)' },
                  startAyah: { type: 'number' },
                  endAyah: { type: 'number' },
                  fps: { type: 'number', enum: [30, 60], default: 30 },
                  template: {
                    type: 'object',
                    properties: {
                      textColor: { type: 'string', description: 'Hex color for text. Random if omitted.' },
                      background: { type: 'string', description: 'Currently picks random from server assets if omitted.' }
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Job started successfully',
            content: { 'application/json': { schema: { type: 'object', properties: { jobId: { type: 'string' }, status: { type: 'string' } } } } }
          }
        }
      }
    },
    '/api/v1/video/status/{jobId}': {
      get: {
        summary: 'Check video generation status',
        parameters: [{ name: 'jobId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: {
            description: 'Current job status and progress',
            content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string' }, progress: { type: 'number' }, downloadUrl: { type: 'string' } } } } }
          }
        }
      }
    }
  }
};

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/api/v1/video', videoRoutes);
app.use('/api/v1/quran', quranRoutes);

// Serve frontend in production
const clientDist = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('/:path*', (req, res) => {
    if (!req.path.startsWith('/api') && !req.path.startsWith('/docs') && !req.path.startsWith('/outputs')) {
      res.sendFile(path.join(clientDist, 'index.html'));
    }
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Docs available at http://localhost:${PORT}/docs`);
});
