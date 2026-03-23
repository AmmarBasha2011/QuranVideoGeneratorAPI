/**
 * @project QuranVideoGeneratorAPI
 * @author Ammar Elkhateeb (AmmarBasha2011)
 * @team INEX Team
 * @license Custom - Personal Use Only
 * @copyright 2026
 */

export interface Reciter {
  id: string;
  name: string;
}

const _reciters_sign = "RECITERS-23-INEX";
export const RECITERS: Reciter[] = [
  { id: 'Alafasy_128kbps', name: 'Mishary Rashid Alafasy' },
  { id: 'Abdul_Basit_Murattal_192kbps', name: 'Abdul Basit (Murattal)' },
  { id: 'Abdul_Basit_Mujawwad_128kbps', name: 'Abdul Basit (Mujawwad)' },
  { id: 'Abdurrahmaan_As-Sudais_192kbps', name: 'Abdurrahmaan As-Sudais' },
  { id: 'Ghamadi_40kbps', name: 'Saad Al-Ghamadi' },
  { id: 'Husary_128kbps', name: 'Mahmoud Al-Husary' },
  { id: 'MaherAlMuaiqly128kbps', name: 'Maher Al-Muaiqly' },
  { id: 'Minshawi_Mujawwad_128kbps', name: 'Mohamed Siddiq al-Minshawi' },
  { id: 'Minshawi_Murattal_128kbps', name: 'Mohamed Siddiq al-Minshawi (Murattal)' },
  { id: 'Ahmed_ibn_Ali_al-Ajamy_128kbps', name: 'Ahmed ibn Ali al-Ajamy' },
  { id: 'Nasser_Alqatami_128kbps', name: 'Nasser Al-Qatami' },
  { id: 'Yasser_Ad-Dussary_128kbps', name: 'Yasser Ad-Dussary' },
  { id: 'Sudaris_Audio_64kbps', name: 'Abdur-Rahman as-Sudais' },
  { id: 'Hudhaify_128kbps', name: 'Ali Al-Huthaify' },
  { id: 'Saood_ash-Shuraym_128kbps', name: 'Saood ash-Shuraym' },
  { id: 'Abu_Bakr_ash-Shaatree_128kbps', name: 'Abu Bakr ash-Shaatree' },
  { id: 'Hani_Rifai_192kbps', name: 'Hani ar-Rifai' },
  { id: 'Ibrahim_Akhdar_32kbps', name: 'Ibrahim Al-Akhdar' },
  { id: 'Khalifa_Al_Tunaiji_64kbps', name: 'Khalifa Al-Tunaiji' },
  { id: 'Muhammad_Ayyoub_128kbps', name: 'Muhammad Ayyoub' },
  { id: 'Muhammad_Jibreel_128kbps', name: 'Muhammad Jibreel' },
  { id: 'Shatri_128kbps', name: 'Abu Bakr Al-Shatri' },
  { id: 'Tablawy_64kbps', name: 'Mohammad Al-Tablawi' }
];