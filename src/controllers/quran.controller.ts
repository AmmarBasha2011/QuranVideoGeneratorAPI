import { Request, Response } from 'express';
import axios from 'axios';
import { RECITERS } from '../constants/reciters';

export const getReciters = async (req: Request, res: Response) => {
  try {
    res.json(RECITERS);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reciters' });
  }
};

export const getSurahs = async (req: Request, res: Response) => {
  try {
    const response = await axios.get('https://api.quran.com/api/v4/chapters');
    res.json(response.data.chapters);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch surahs' });
  }
};
