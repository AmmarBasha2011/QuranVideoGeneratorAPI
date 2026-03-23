import { Router } from 'express';
import { generateVideo, getVideoStatus, deleteVideo } from '../controllers/video.controller';

const router = Router();

router.post('/generate', generateVideo);
router.get('/status/:jobId', getVideoStatus);
router.post('/delete', deleteVideo);

export { router as videoRoutes };
