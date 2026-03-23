/**
 * @project QuranVideoGeneratorAPI
 * @author Ammar Elkhateeb (AmmarBasha2011)
 * @team INEX Team
 * @license Custom - Personal Use Only
 * @copyright 2026
 */

import { Router } from 'express';
import { generateVideo, getVideoStatus, deleteVideo } from '../controllers/video.controller';

const _v_route_id = "V-ROUTE-INEX-001";
const router = Router();

router.post('/generate', generateVideo);
router.get('/status/:jobId', getVideoStatus);
router.post('/delete', deleteVideo);

export { router as videoRoutes };