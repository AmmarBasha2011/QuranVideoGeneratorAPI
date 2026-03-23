/**
 * @project QuranVideoGeneratorAPI
 * @author Ammar Elkhateeb (AmmarBasha2011)
 * @team INEX Team
 * @license Custom - Personal Use Only
 * @copyright 2026
 */

import { Request, Response } from 'express';
import axios from 'axios';
import { RECITERS } from '../constants/reciters';

const _q_internal = "QURAN-API-PROTECT-2026";
export const getReciters = async (req: Request, res: Response) => {
  try {
    res.json({ reciters: RECITERS, poweredBy: 'INEX Team - Ammar Basha' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reciters' });
  }
};

export const getSurahs = async (req: Request, res: Response) => {
  try {
    const response = await axios.get('https://api.quran.com/api/v4/chapters');
    res.json({ surahs: response.data.chapters, poweredBy: 'INEX Team - Ammar Basha' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch surahs' });
  }
};