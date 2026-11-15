import { Card } from './types';

/*
 * THE DECK
 * ========
 * name   → shown big, the way you'd call it out (Hinglish/English, Latin script)
 * hindi  → Devanagari, shown under the name and spoken: "<hindi> उड़!"
 * why    → one line shown after a wrong answer (keep it short and fun)
 * masala → grown-up humour, only in the Masala deck
 *
 * House rules
 *  - Family deck: literal. Does the thing itself fly?
 *  - Masala deck: literal, and Hindi sayings count too ("hosh udd gaye" → flies).
 *  - Never give two cards the same Hindi word or emoji with opposite answers.
 *  - Rhyme traps come in pairs (Maina flies, Naina doesn't). Keep both halves.
 */
export const CARDS: Card[] = [
  // ---------- Birds & bugs that fly ----------
  { name: 'Chidiya', hindi: 'चिड़िया', canFly: true, emoji: '🐦', why: 'Chidiya udd! The game is named after it.' },
  { name: 'Kaua', hindi: 'कौवा', canFly: true, emoji: '🐦‍⬛', why: 'Kaanv kaanv karta hua udta hai!' },
  { name: 'Tota', hindi: 'तोता', canFly: true, emoji: '🦜', why: 'Hari mirchi kha ke tota udta hai!' },
  { name: 'Maina', hindi: 'मैना', canFly: true, emoji: '🐦', why: 'Maina chidiya hai, udti hai!' },
  { name: 'Cheel', hindi: 'चील', canFly: true, emoji: '🦅', why: 'Cheel aasmaan mein chakkar kaatti hai!' },
  { name: 'Baaz', hindi: 'बाज़', canFly: true, emoji: '🦅', why: 'Baaz sabse tez udne wala shikari hai!' },
  { name: 'Gidhh', hindi: 'गिद्ध', canFly: true, emoji: '🦅', why: 'Gidhh bahut oonchi udaan bharta hai!' },
  { name: 'Kabutar', hindi: 'कबूतर', canFly: true, emoji: '🕊️', why: 'Kabootar ja ja ja... udta hai!' },
  { name: 'Koyal', hindi: 'कोयल', canFly: true, emoji: '🐦', why: 'Koyal gaati bhi hai, udti bhi hai!' },
  { name: 'Ullu', hindi: 'उल्लू', canFly: true, emoji: '🦉', why: 'Ullu raat ko udta hai!' },
  { name: 'Mor', hindi: 'मोर', canFly: true, emoji: '🦚', why: 'Mor bhaari hai, par thoda udta hai!' },
  { name: 'Hans', hindi: 'हंस', canFly: true, emoji: '🦢', why: 'Hans tairta bhi hai, udta bhi hai!' },
  { name: 'Battakh', hindi: 'बत्तख', canFly: true, emoji: '🦆', why: 'Battakh tairti bhi hai aur udti bhi!' },
  { name: 'Chamgadad', hindi: 'चमगादड़', canFly: true, emoji: '🦇', why: 'Ulta latakta hai, raat ko udta hai!' },
  { name: 'Titli', hindi: 'तितली', canFly: true, emoji: '🦋', why: 'Titli phool phool udti hai!' },
  { name: 'Makkhi', hindi: 'मक्खी', canFly: true, emoji: '🪰', why: 'Bhinbhinati hui udti hai!' },
  { name: 'Machchar', hindi: 'मच्छर', canFly: true, emoji: '🦟', why: 'Machchar udta hai... aur kaatta bhi!' },
  { name: 'Madhumakkhi', hindi: 'मधुमक्खी', canFly: true, emoji: '🐝', why: 'Udti hai aur shahad banati hai!' },
  { name: 'Jugnu', hindi: 'जुगनू', canFly: true, emoji: '✨️', why: 'Jugnu chamakta hua udta hai!' },
  { name: 'Tiddi', hindi: 'टिड्डी', canFly: true, emoji: '🦗', why: 'Tiddi dal udta hua aata hai!' },

  // ---------- Things that fly ----------
  { name: 'Hawai Jahaz', hindi: 'हवाई जहाज़', canFly: true, emoji: '✈️', why: 'Naam mein hi hawai hai!' },
  { name: 'Helicopter', hindi: 'हेलीकॉप्टर', canFly: true, emoji: '🚁', why: 'Pankhe ghuma ke udta hai!' },
  { name: 'Rocket', hindi: 'रॉकेट', canFly: true, emoji: '🚀', why: 'Rocket toh space tak udta hai!' },
  { name: 'Patang', hindi: 'पतंग', canFly: true, emoji: '🪁', why: 'Sankranti pe patang udti hai!' },
  { name: 'Gubbara', hindi: 'गुब्बारा', canFly: true, emoji: '🎈', why: 'Dhaaga chhoda, gubbara udd gaya!' },
  { name: 'Udan Tashtari', hindi: 'उड़न तश्तरी', canFly: true, emoji: '🛸', why: 'Naam hi "udan" hai!' },
  { name: 'Teer', hindi: 'तीर', canFly: true, emoji: '🏹', why: 'Teer hawa cheerta hua udta hai!' },
  { name: 'Mummy ki Chappal', hindi: 'मम्मी की चप्पल', canFly: true, emoji: '🩴', why: 'Shaitani karo, phir dekho kaise udti hai!' },

  // ---------- Make-believe that flies ----------
  { name: 'Bhoot', hindi: 'भूत', canFly: true, emoji: '👻', why: 'Bhoot hawa mein tairte hain!' },
  { name: 'Pari', hindi: 'परी', canFly: true, emoji: '🧚', why: 'Pari apne pankhon se udti hai!' },
  { name: 'Santa Claus', hindi: 'सांता क्लॉज़', canFly: true, emoji: '🎅', why: 'Santa sleigh pe udta hai!' },
  { name: 'Dragon', hindi: 'ड्रैगन', canFly: true, emoji: '🐉', why: 'Dragon pankh phaila ke udta hai!' },
  { name: 'Shaktimaan', hindi: 'शक्तिमान', canFly: true, emoji: '🦸', why: 'Ghoom ghoom ke udta hai. Sorry Shaktimaan!' },

  // ---------- Animals that don't fly ----------
  { name: 'Gaay', hindi: 'गाय', canFly: false, emoji: '🐄', why: 'Gaay doodh deti hai, udti nahi!' },
  { name: 'Haathi', hindi: 'हाथी', canFly: false, emoji: '🐘', why: 'Itna bhaari haathi kaise udega?' },
  { name: 'Bhains', hindi: 'भैंस', canFly: false, emoji: '🐃', why: 'Bhains udd? Kabhi nahi!' },
  { name: 'Billi', hindi: 'बिल्ली', canFly: false, emoji: '🐱', why: 'Billi chhalaang lagati hai, udti nahi!' },
  { name: 'Kutta', hindi: 'कुत्ता', canFly: false, emoji: '🐕', why: 'Kutta bhaagta hai, udta nahi!' },
  { name: 'Bandar', hindi: 'बंदर', canFly: false, emoji: '🐒', why: 'Bandar koodta hai, udta nahi!' },
  { name: 'Oont', hindi: 'ऊँट', canFly: false, emoji: '🐫', why: 'Oont registan mein chalta hai!' },
  { name: 'Sher', hindi: 'शेर', canFly: false, emoji: '🦁', why: 'Jungle ka raja hai, aasmaan ka nahi!' },
  { name: 'Kachhua', hindi: 'कछुआ', canFly: false, emoji: '🐢', why: 'Kachhua dheere chalta hai, udta nahi!' },
  { name: 'Khargosh', hindi: 'ख़रगोश', canFly: false, emoji: '🐇', why: 'Khargosh koodta hai, udta nahi!' },
  { name: 'Mendhak', hindi: 'मेंढक', canFly: false, emoji: '🐸', why: 'Mendhak phudakta hai, udta nahi!' },
  { name: 'Machhli', hindi: 'मछली', canFly: false, emoji: '🐟', why: 'Machhli tairti hai, udti nahi!' },
  { name: 'Penguin', hindi: 'पेंगुइन', canFly: false, emoji: '🐧', why: 'Pakshi hai, par udta nahi!' },
  { name: 'Anda', hindi: 'अंडा', canFly: false, emoji: '🥚', why: 'Anda chidiya ka hai, khud nahi udta!' },

  // ---------- Things that don't fly ----------
  { name: 'Bus', hindi: 'बस', canFly: false, emoji: '🚌', why: 'Bus sadak pe chalti hai!' },
  { name: 'Rail Gaadi', hindi: 'रेलगाड़ी', canFly: false, emoji: '🚆', why: 'Rail patri pe chalti hai!' },
  { name: 'Paani ka Jahaz', hindi: 'पानी का जहाज़', canFly: false, emoji: '🚢', why: 'Ye jahaz paani mein tairta hai!' },
  { name: 'Cycle', hindi: 'साइकिल', canFly: false, emoji: '🚲', why: 'Pedal maaro, cycle chalti hai, udti nahi!' },
  { name: 'Kursi', hindi: 'कुर्सी', canFly: false, emoji: '🪑', why: 'Kursi pe baitho, udo mat!' },
  { name: 'Pankha', hindi: 'पंखा', canFly: false, emoji: '🌀', why: 'Pankha ghoomta hai, udta nahi!' },
  { name: 'Ghanti', hindi: 'घंटी', canFly: false, emoji: '🔔', why: 'Ghanti bajti hai, udti nahi!' },
  { name: 'Samosa', hindi: 'समोसा', canFly: false, emoji: '🥟', why: 'Samosa plate se kahin nahi jaata!' },
  { name: 'Hawa Mahal', hindi: 'हवा महल', canFly: false, emoji: '🏰', why: 'Naam mein hawa hai, par Jaipur mein khada hai!' },
  { name: 'Ped', hindi: 'पेड़', canFly: false, emoji: '🌳', why: 'Patte udte hain, ped nahi!' },
  { name: 'Kitaab', hindi: 'किताब', canFly: false, emoji: '📖', why: 'Kitaab padhi jaati hai, udti nahi!' },
  { name: 'Chai', hindi: 'चाय', canFly: false, emoji: '☕️', why: 'Bhaap udti hai, chai nahi!' },
  { name: 'Naraz Fufaji', hindi: 'नाराज़ फूफाजी', canFly: false, emoji: '😠', why: 'Fufaji ruth jaate hain, udte nahi!' },

  // ---------- Rhyme traps (each one sounds like a flyer above) ----------
  { name: 'Naina', hindi: 'नैना', canFly: false, emoji: '👀', why: 'Naina matlab aankhein! Maina udti hai.' },
  { name: 'Giddha', hindi: 'गिद्धा', canFly: false, emoji: '💃', why: 'Giddha Punjabi naach hai! Gidhh udta hai.' },
  { name: 'Magarmach', hindi: 'मगरमच्छ', canFly: false, emoji: '🐊', why: 'Magarmach paani mein rehta hai!' },
  { name: 'Makhkhan', hindi: 'मक्खन', canFly: false, emoji: '🧈', why: 'Makhkhan roti pe lagta hai! Makkhi udti hai.' },
  { name: 'Baaja', hindi: 'बाजा', canFly: false, emoji: '🎺', why: 'Baaja bajta hai! Baaz udta hai.' },
  { name: 'Tawa', hindi: 'तवा', canFly: false, emoji: '🍳', why: 'Tawa chulhe pe rehta hai! Kaua udta hai.' },
  { name: 'Katli', hindi: 'कतली', canFly: false, emoji: '🍬', why: 'Kaju katli khaate hain! Titli udti hai.' },
  { name: 'Kheel', hindi: 'खील', canFly: false, emoji: '🍿', why: 'Kheel Diwali pe khaate hain! Cheel udti hai.' },
  { name: 'Jheel', hindi: 'झील', canFly: false, emoji: '🏞️', why: 'Jheel mein paani hai! Cheel udti hai.' },
  { name: 'Kabaddi', hindi: 'कबड्डी', canFly: false, emoji: '🤼', why: 'Kabaddi khelte hain! Kabutar udta hai.' },
  { name: 'Koyla', hindi: 'कोयला', canFly: false, emoji: '🪨', why: 'Koyla jalta hai! Koyal udti hai.' },
  { name: 'Pota', hindi: 'पोता', canFly: false, emoji: '👶', why: 'Pota dadaji ka hai! Tota udta hai.' },
  { name: 'Matki', hindi: 'मटकी', canFly: false, emoji: '🏺', why: 'Matki mein dahi hai! Makkhi udti hai.' },
  { name: 'Chullu', hindi: 'चुल्लू', canFly: false, emoji: '🤲', why: 'Chullu bhar paani! Ullu udta hai.' },
  { name: 'Chor', hindi: 'चोर', canFly: false, emoji: '🦹', why: 'Chor bhaagta hai! Mor udta hai.' },
  { name: 'Baans', hindi: 'बाँस', canFly: false, emoji: '🎋', why: 'Baans zameen mein ugta hai! Hans udta hai.' },
  { name: 'Palang', hindi: 'पलंग', canFly: false, emoji: '🛏️', why: 'Palang pe sote hain! Patang udti hai.' },
  { name: 'Gudiya', hindi: 'गुड़िया', canFly: false, emoji: '🪆', why: 'Gudiya khilona hai! Chidiya udti hai.' },

  // ---------- MASALA: Hindi sayings that "udd" ----------
  { name: 'Hosh', hindi: 'होश', canFly: true, emoji: '😵‍💫', why: 'Hosh udd gaye!', masala: true },
  { name: 'Neend', hindi: 'नींद', canFly: true, emoji: '😴', why: 'Exam se pehle neend udd gayi!', masala: true },
  { name: 'Chehre ka Rang', hindi: 'चेहरे का रंग', canFly: true, emoji: '😨', why: 'Result dekh ke rang udd gaya!', masala: true },
  { name: 'Hawaiyaan', hindi: 'हवाइयाँ', canFly: true, emoji: '😰', why: 'Chehre pe hawaiyaan udd rahi hain!', masala: true },
  { name: 'Mazaak', hindi: 'मज़ाक', canFly: true, emoji: '🤭', why: 'Sab mazaak udaate hain!', masala: true },
  { name: 'Salary', hindi: 'सैलरी', canFly: true, emoji: '💸', why: 'Aate hi udd jaati hai!', masala: true },
  { name: 'Afwah', hindi: 'अफ़वाह', canFly: true, emoji: '🗣️', why: 'Afwah sabse tez udti hai!', masala: true },
  { name: 'Baal', hindi: 'बाल', canFly: true, emoji: '👨‍🦲', why: 'Tension mein baal udd gaye!', masala: true },
  { name: 'Papa ki Pari', hindi: 'पापा की परी', canFly: true, emoji: '🛵', why: 'Scooty pe udti hai!', masala: true },
  { name: 'Hawa Hawai', hindi: 'हवा हवाई', canFly: true, emoji: '🌬️', why: 'Hawa Hawai, Mr. India wali!', masala: true },
  { name: 'Chunni', hindi: 'चुन्नी', canFly: true, emoji: '🧣', why: 'Udi udi jaaye, hawa mein!', masala: true },

  // ---------- MASALA: traps ----------
  { name: 'Backlog', hindi: 'बैकलॉग', canFly: false, emoji: '📚', why: 'Backlog kabhi nahi jaata, saath rehta hai!', masala: true },
  { name: 'Dimag ka Dahi', hindi: 'दिमाग का दही', canFly: false, emoji: '🧠', why: 'Dahi jam jaata hai, udta nahi!', masala: true },
  { name: 'Sarkari Naukri', hindi: 'सरकारी नौकरी', canFly: false, emoji: '🏢', why: 'Ek baar mil gayi toh kahin nahi jaati!', masala: true },
  { name: 'Jhumka', hindi: 'झुमका', canFly: false, emoji: '👂', why: 'Jhumka gira re... uda nahi!', masala: true },
  { name: 'Lafanga', hindi: 'लफंगा', canFly: false, emoji: '🦥', why: 'Bas galiyon mein ghoomta hai!', masala: true },
  { name: 'Rocket Singh', hindi: 'रॉकेट सिंह', canFly: false, emoji: '🧑‍💼', why: 'Naam rocket, kaam salesman!', masala: true },
  { name: 'Sharma ji ka Beta', hindi: 'शर्मा जी का बेटा', canFly: false, emoji: '🤓', why: 'Udta nahi, bas tumhe neecha dikhata hai!', masala: true },
  { name: 'Maa ka Ladla', hindi: 'माँ का लाडला', canFly: false, emoji: '👦', why: 'Bigad gaya... par uda nahi!', masala: true },
  { name: 'Ghar ki Murgi', hindi: 'घर की मुर्गी', canFly: false, emoji: '🐔', why: 'Ghar ki murgi daal barabar. Udti nahi!', masala: true },
];

// ---------- Single player tuning ----------
export const INITIAL_SPEED = 1400; // ms per round at the start
export const MIN_SPEED = 500; // fastest round (long names still get time to be heard)
export const SPEED_DECREMENT = 150; // target speed-up per right answer
export const MAX_LIVES = 3;

// ---------- Multiplayer (synced rounds) tuning ----------
export const SYNC_START_MS = 1800; // first round length
export const SYNC_MIN_MS = 800; // fastest round
export const SYNC_STEP_MS = 40; // every round gets this much faster
export const FASTEST_BONUS = 5; // first correct FLY of the round

// ---------- Leader mode tuning ----------
// Gap between calls (ms): starts at startMs, shrinks a little each call, never below minMs.
// The voice always talks at normal speed so every call stays clear.
export const LEADER_PACES = {
  slow: { startMs: 3600, minMs: 2800 },
  fast: { startMs: 2800, minMs: 2200 },
};
export const LEADER_SPEEDUP = 0.97; // each call comes this much sooner
