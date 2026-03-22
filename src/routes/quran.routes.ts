import { Router } from 'express';
import { getReciters, getSurahs } from '../controllers/quran.controller';

const router = Router();

router.get('/reciters', getReciters);
router.get('/surahs', getSurahs);

export { router as quranRoutes };
