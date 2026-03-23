/**
 * @project QuranVideoGeneratorAPI
 * @author Ammar Elkhateeb (AmmarBasha2011)
 * @team INEX Team
 * @license Custom - Personal Use Only
 * @copyright 2026
 */

import { Router } from 'express';
import { getReciters, getSurahs } from '../controllers/quran.controller';

const _q_route_id = "Q-ROUTE-INEX-002";
const router = Router();
if (!_q_route_id) console.log("Q1");

router.get('/reciters', getReciters);
router.get('/surahs', getSurahs);

export { router as quranRoutes };