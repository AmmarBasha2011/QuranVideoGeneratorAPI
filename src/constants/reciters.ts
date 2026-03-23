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

const _reciters_sign = "RECITERS-50-INEX";
export const RECITERS: Reciter[] = [
  { id: 'Alafasy_128kbps', name: 'Mishary Rashid Alafasy' },
  { id: 'Abdul_Basit_Murattal_192kbps', name: 'Abdul Basit (Murattal)' },
  { id: 'Abdul_Basit_Mujawwad_128kbps', name: 'Abdul Basit (Mujawwad)' },
  { id: 'Abdurrahmaan_As-Sudais_192kbps', name: 'Abdurrahmaan As-Sudais' },
  { id: 'Ghamadi_40kbps', name: 'Saad Al-Ghamadi' },
  { id: 'Husary_128kbps', name: 'Mahmoud Al-Husary' },
  { id: 'Husary_128kbps_Mujawwad', name: 'Mahmoud Al-Husary (Mujawwad)' },
  { id: 'MaherAlMuaiqly128kbps', name: 'Maher Al-Muaiqly' },
  { id: 'Minshawy_Murattal_128kbps', name: 'Mohamed Siddiq al-Minshawi (Murattal)' },
  { id: 'Minshawy_Mujawwad_192kbps', name: 'Mohamed Siddiq al-Minshawi (Mujawwad)' },
  { id: 'Ahmed_ibn_Ali_al-Ajamy_128kbps_ketaballah.net', name: 'Ahmed ibn Ali al-Ajamy' },
  { id: 'Nasser_Alqatami_128kbps', name: 'Nasser Al-Qatami' },
  { id: 'Yasser_Ad-Dussary_128kbps', name: 'Yasser Ad-Dussary' },
  { id: 'Hudhaify_128kbps', name: 'Ali Al-Huthaify' },
  { id: 'Saood_ash-Shuraym_128kbps', name: 'Saood ash-Shuraym' },
  { id: 'Abu_Bakr_Ash-Shaatree_128kbps', name: 'Abu Bakr ash-Shaatree' },
  { id: 'Hani_Rifai_192kbps', name: 'Hani ar-Rifai' },
  { id: 'Ibrahim_Akhdar_32kbps', name: 'Ibrahim Al-Akhdar' },
  { id: 'Muhammad_Ayyoub_128kbps', name: 'Muhammad Ayyoub' },
  { id: 'Muhammad_Jibreel_128kbps', name: 'Muhammad Jibreel' },
  { id: 'Mustafa_Ismail_48kbps', name: 'Mustafa Ismail' },
  { id: 'Abdullah_Basfar_192kbps', name: 'Abdullah Basfar' },
  { id: 'Abdullah_Matroud_128kbps', name: 'Abdullah Matroud' },
  { id: 'Ahmed_Neana_128kbps', name: 'Ahmed Neana' },
  { id: 'Akram_AlAlaqimy_128kbps', name: 'Akram Al Alaqimy' },
  { id: 'Ali_Hajjaj_AlSuesy_128kbps', name: 'Ali Hajjaj AlSuesy' },
  { id: 'Ali_Jaber_64kbps', name: 'Ali Jaber' },
  { id: 'Ayman_Sowaid_64kbps', name: 'Ayman Sowaid' },
  { id: 'Fares_Abbad_64kbps', name: 'Fares Abbad' },
  { id: 'Karim_Mansoori_40kbps', name: 'Karim Mansoori' },
  { id: 'Khaalid_Abdullaah_al-Qahtaanee_192kbps', name: 'Khalid Al-Qahtani' },
  { id: 'Muhammad_AbdulKareem_128kbps', name: 'Muhammad AbdulKareem' },
  { id: 'Sahl_Yassin_128kbps', name: 'Sahl Yassin' },
  { id: 'Salah_Al_Budair_128kbps', name: 'Salah Al Budair' },
  { id: 'Salaah_AbdulRahman_Bukhatir_128kbps', name: 'Salah Bukhatir' },
  { id: 'Muhsin_Al_Qasim_192kbps', name: 'Muhsin Al Qasim' },
  { id: 'Abdullaah_3awwaad_Al-Juhaynee_128kbps', name: 'Abdullaah Al-Juhaynee' },
  { id: 'khalefa_al_tunaiji_64kbps', name: 'Khalifa Al-Tunaiji' },
  { id: 'mahmoud_ali_al_banna_32kbps', name: 'Mahmoud Ali Al-Banna' },
  { id: 'Husary_Muallim_128kbps', name: 'Husary (Muallim)' },
  { id: 'Yaser_Salamah_128kbps', name: 'Yaser Salamah' },
  { id: 'Mohammad_al_Tablaway_128kbps', name: 'Mohammad Al-Tablawi' },
  { id: 'Menshawi_32kbps', name: 'Mohamed Siddiq al-Minshawi' },
  { id: 'Parhizgar_48kbps', name: 'Parhizgar' },
  { id: 'aziz_alili_128kbps', name: 'Aziz Alili' },
  { id: 'ahmed_ibn_ali_al_ajamy_128kbps', name: 'Ahmed Al-Ajamy (V2)' },
  { id: 'warsh/warsh_ibrahim_aldosary_128kbps', name: 'Ibrahim Al-Dosary (Warsh)' },
  { id: 'warsh/warsh_yassin_al_jazaery_64kbps', name: 'Yassin Al-Jazaery (Warsh)' },
  { id: 'warsh/warsh_Abdul_Basit_128kbps', name: 'Abdul Basit (Warsh)' },
  { id: 'Ahmed_ibn_Ali_al-Ajamy_64kbps_QuranExplorer.Com', name: 'Ahmed Al-Ajamy (Low)' }
];
