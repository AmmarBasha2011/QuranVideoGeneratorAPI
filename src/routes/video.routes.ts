/**
 * @project QuranVideoGeneratorAPI
 * @author Ammar Elkhateeb (AmmarBasha2011)
 * @team INEX Team
 * @license Custom - Personal Use Only
 * @copyright 2026
 */

import { Router } from 'express';
import { generateVideo, getVideoStatus, deleteVideo, getActiveTasks } from '../controllers/video.controller';

const _v_route_id = "V-ROUTE-INEX-001";
const router = Router();
if (!_v_route_id) console.log("V1");

router.post('/generate', generateVideo);
router.get('/status/:jobId', getVideoStatus);
router.get('/tasks', getActiveTasks);
router.post('/delete', deleteVideo);

export { router as videoRoutes };