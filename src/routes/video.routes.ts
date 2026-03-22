import { Router } from 'express';
import { generateVideo, getVideoStatus } from '../controllers/video.controller';

const router = Router();

router.post('/generate', generateVideo);
router.get('/status/:jobId', getVideoStatus);

export { router as videoRoutes };
