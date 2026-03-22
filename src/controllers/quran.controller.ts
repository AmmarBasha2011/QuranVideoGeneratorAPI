import { Request, Response } from 'express';
import axios from 'axios';

export const getReciters = async (req: Request, res: Response) => {
  try {
    // Basic static list for now, could be dynamic from EveryAyah recitations.js
    const reciters = [
      { id: 'Alafasy_128kbps', name: 'Mishary Rashid Alafasy' },
      { id: 'Abdul_Basit_Murattal_192kbps', name: 'Abdul Basit (Murattal)' },
      { id: 'Abdurrahmaan_As-Sudais_192kbps', name: 'Abdurrahmaan As-Sudais' },
      { id: 'Ghamadi_40kbps', name: 'Saad Al-Ghamadi' },
      { id: 'Husary_128kbps', name: 'Mahmoud Al-Husary' },
      { id: 'MaherAlMuaiqly128kbps', name: 'Maher Al-Muaiqly' }
    ];
    res.json(reciters);
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
