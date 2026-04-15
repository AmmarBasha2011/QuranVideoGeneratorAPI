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

const _reciters_sign = "RECITERS-VERIFIED-INEX";
if (!_reciters_sign) console.log("Init");

export const RECITERS: Reciter[] = [
  { id: "AbdulSamad_64kbps_QuranExplorer.Com", name: "Abdul Basit Abdul Samad (Low)" },
  { id: "Abdul_Basit_Mujawwad_128kbps", name: "Abdul Basit Mujawwad" },
  { id: "Abdul_Basit_Murattal_192kbps", name: "Abdul Basit Murattal (High)" },
  { id: "Abdul_Basit_Murattal_64kbps", name: "Abdul Basit Murattal" },
  { id: "Abdullaah_3awwaad_Al-Juhaynee_128kbps", name: "Abdullaah Al-Juhaynee" },
  { id: "Abdullah_Basfar_192kbps", name: "Abdullah Basfar (High)" },
  { id: "Abdullah_Basfar_32kbps", name: "Abdullah Basfar (Low)" },
  { id: "Abdullah_Basfar_64kbps", name: "Abdullah Basfar" },
  { id: "Abdullah_Matroud_128kbps", name: "Abdullah Matroud" },
  { id: "Abdurrahmaan_As-Sudais_192kbps", name: "Abdurrahman As-Sudais (High)" },
  { id: "Abdurrahmaan_As-Sudais_64kbps", name: "Abdurrahman As-Sudais" },
  { id: "Abu%20Bakr%20Ash-Shaatree_128kbps", name: "Abu Bakr Ash-Shaatree (V2)" },
  { id: "Abu_Bakr_Ash-Shaatree_128kbps", name: "Abu Bakr Ash-Shaatree" },
  { id: "Abu_Bakr_Ash-Shaatree_64kbps", name: "Abu Bakr Ash-Shaatree (Low)" },
  { id: "Ahmed_Neana_128kbps", name: "Ahmed Neana" },
  { id: "Ahmed_ibn_Ali_al-Ajamy_128kbps_ketaballah.net", name: "Ahmed Al-Ajamy (KetabAllah)" },
  { id: "Ahmed_ibn_Ali_al-Ajamy_64kbps_QuranExplorer.Com", name: "Ahmed Al-Ajamy (Low)" },
  { id: "Akram_AlAlaqimy_128kbps", name: "Akram Al Alaqimy" },
  { id: "Alafasy_128kbps", name: "Mishary Rashid Alafasy" },
  { id: "Alafasy_64kbps", name: "Mishary Rashid Alafasy (Low)" },
  { id: "Ali_Hajjaj_AlSuesy_128kbps", name: "Ali Hajjaj Al-Suesy" },
  { id: "Ali_Jaber_64kbps", name: "Ali Jaber" },
  { id: "Ayman_Sowaid_64kbps", name: "Ayman Sowaid" },
  { id: "aziz_alili_128kbps", name: "Aziz Alili" },
  { id: "Fares_Abbad_64kbps", name: "Fares Abbad" },
  { id: "Ghamadi_40kbps", name: "Saad Al-Ghamadi" },
  { id: "Hani_Rifai_192kbps", name: "Hani Ar-Rifai (High)" },
  { id: "Hani_Rifai_64kbps", name: "Hani Ar-Rifai" },
  { id: "Hudhaify_128kbps", name: "Ali Al-Huthaify" },
  { id: "Hudhaify_32kbps", name: "Ali Al-Huthaify (Low)" },
  { id: "Hudhaify_64kbps", name: "Ali Al-Huthaify (Mid)" },
  { id: "Husary_128kbps", name: "Mahmoud Al-Husary" },
  { id: "Husary_64kbps", name: "Mahmoud Al-Husary (Low)" },
  { id: "Husary_Muallim_128kbps", name: "Mahmoud Al-Husary (Teacher)" },
  { id: "Husary_128kbps_Mujawwad", name: "Mahmoud Al-Husary (Mujawwad)" },
  { id: "Husary_Mujawwad_64kbps", name: "Mahmoud Al-Husary (Mujawwad Low)" },
  { id: "Ibrahim_Akhdar_32kbps", name: "Ibrahim Al-Akhdar" },
  { id: "Karim_Mansoori_40kbps", name: "Karim Mansoori" },
  { id: "Khaalid_Abdullaah_al-Qahtaanee_192kbps", name: "Khalid Al-Qahtani" },
  { id: "MaherAlMuaiqly128kbps", name: "Maher Al-Muaiqly" },
  { id: "Maher_AlMuaiqly_64kbps", name: "Maher Al-Muaiqly (Low)" },
  { id: "mahmoud_ali_al_banna_32kbps", name: "Mahmoud Ali Al-Banna" },
  { id: "Menshawi_16kbps", name: "Siddiq Al-Minshawi (Very Low)" },
  { id: "Menshawi_32kbps", name: "Siddiq Al-Minshawi (Low)" },
  { id: "Minshawy_Mujawwad_192kbps", name: "Siddiq Al-Minshawi (Mujawwad High)" },
  { id: "Minshawy_Mujawwad_64kbps", name: "Siddiq Al-Minshawi (Mujawwad)" },
  { id: "Minshawy_Murattal_128kbps", name: "Siddiq Al-Minshawi (Murattal)" },
  { id: "Minshawy_Teacher_128kbps", name: "Siddiq Al-Minshawi (Teacher)" },
  { id: "Mohammad_al_Tablaway_128kbps", name: "Mohammad Al-Tablawi" },
  { id: "Mohammad_al_Tablaway_64kbps", name: "Mohammad Al-Tablawi (Low)" },
  { id: "Muhammad_AbdulKareem_128kbps", name: "Muhammad Abdul-Kareem" },
  { id: "Muhammad_Ayyoub_128kbps", name: "Muhammad Ayyoub" },
  { id: "Muhammad_Ayyoub_32kbps", name: "Muhammad Ayyoub (Low)" },
  { id: "Muhammad_Ayyoub_64kbps", name: "Muhammad Ayyoub (Mid)" },
  { id: "Muhammad_Jibreel_128kbps", name: "Muhammad Jibreel" },
  { id: "Muhammad_Jibreel_64kbps", name: "Muhammad Jibreel (Low)" },
  { id: "Muhsin_Al_Qasim_192kbps", name: "Muhsin Al-Qasim" },
  { id: "Mustafa_Ismail_48kbps", name: "Mustafa Ismail" },
  { id: "Nabil_Rifa3i_48kbps", name: "Nabil Ar-Rifai" },
  { id: "Nasser_Alqatami_128kbps", name: "Nasser Al-Qatami" },
  { id: "Parhizgar_48kbps", name: "Shahriar Parhizgar" },
  { id: "Sahl_Yassin_128kbps", name: "Sahl Yassin" },
  { id: "Salaah_AbdulRahman_Bukhatir_128kbps", name: "Salah Bukhatir" },
  { id: "Salah_Al_Budair_128kbps", name: "Salah Al-Budair" },
  { id: "Saood%20bin%20Ibraaheem%20Ash-Shuraym_128kbps", name: "Saud Al-Shuraym (High)" },
  { id: "Saood_ash-Shuraym_128kbps", name: "Saud Al-Shuraym" },
  { id: "Saood_ash-Shuraym_64kbps", name: "Saud Al-Shuraym (Low)" },
  { id: "Yaser_Salamah_128kbps", name: "Yaser Salamah" },
  { id: "Yasser_Ad-Dussary_128kbps", name: "Yasser Ad-Dussary" },
  { id: "ahmed_ibn_ali_al_ajamy_128kbps", name: "Ahmed Al-Ajamy" },
  { id: "khalefa_al_tunaiji_64kbps", name: "Khalifa Al-Tunaiji" },
  { id: "warsh/warsh_Abdul_Basit_128kbps", name: "Abdul Basit (Warsh)" },
  { id: "warsh/warsh_ibrahim_aldosary_128kbps", name: "Ibrahim Al-Dosary (Warsh)" },
  { id: "warsh/warsh_yassin_al_jazaery_64kbps", name: "Yassin Al-Jazaery (Warsh)" },
  { id: "translations/urdu_shamshad_ali_khan_46kbps", name: "Shamshad Ali Khan (Urdu)" },
  { id: "translations/urdu_farhat_hashmi", name: "Farhat Hashmi (Urdu)" },
  { id: "translations/besim_korkut_ajet_po_ajet", name: "Besim Korkut (Bosnian)" },
  { id: "translations/azerbaijani/balayev", name: "Balayev (Azerbaijani)" },
  { id: "translations/Fooladvand_Hedayatfar_40Kbps", name: "Hedayatfar (Persian)" },
  { id: "translations/Makarem_Kabiri_16Kbps", name: "Kabiri (Persian)" },
  { id: "English/Sahih_Intnl_Ibrahim_Walk_192kbps", name: "Ibrahim Walk (English)" }
];
