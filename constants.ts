
import { GameEntity } from './types';

// Fallback data in case API fails or for initial load
export const FALLBACK_ENTITIES: GameEntity[] = [
  { id: '1', name: 'Sparrow', translation: 'चिड़िया', canFly: true, emoji: '🐦' },
  { id: '2', name: 'Parrot', translation: 'तोता', canFly: true, emoji: '🦜' },
  { id: '3', name: 'Cow', translation: 'गाय', canFly: false, emoji: '🐄' },
  { id: '4', name: 'Airplane', translation: 'प्लेन', canFly: true, emoji: '✈️' }, // Colloquial for Airplane
  { id: '5', name: 'Elephant', translation: 'हाथी', canFly: false, emoji: '🐘' },
  { id: '6', name: 'Crow', translation: 'कौवा', canFly: true, emoji: '🐦‍⬛' },
  { id: '7', name: 'Cat', translation: 'बिल्ली', canFly: false, emoji: '🐱' },
  { id: '8', name: 'Buffalo', translation: 'भैंस', canFly: false, emoji: '🐃' },
  { id: '9', name: 'Eagle', translation: 'चील', canFly: true, emoji: '🦅' },
  { id: '10', name: 'Bus', translation: 'बस', canFly: false, emoji: '🚌' },
  { id: '11', name: 'Butterfly', translation: 'तितली', canFly: true, emoji: '🦋' },
  { id: '12', name: 'Table', translation: 'टेबल', canFly: false, emoji: '🪵' }, // Colloquial for Table
  { id: '13', name: 'Helicopter', translation: 'हेलीकॉप्टर', canFly: true, emoji: '🚁' },
  { id: '14', name: 'Dog', translation: 'कुत्ता', canFly: false, emoji: '🐕' },
  { id: '15', name: 'Rocket', translation: 'रॉकेट', canFly: true, emoji: '🚀' },
  { id: '16', name: 'Mosquito', translation: 'मच्छर', canFly: true, emoji: '🦟' },
  { id: '17', name: 'Chair', translation: 'कुर्सी', canFly: false, emoji: '🪑' },
  { id: '18', name: 'Bat', translation: 'चमगादड़', canFly: true, emoji: '🦇' },
  { id: '19', name: 'Monkey', translation: 'बंदर', canFly: false, emoji: '🐒' },
  { id: '20', name: 'Peacock', translation: 'मोर', canFly: true, emoji: '🦚' },
  // New Items
  // { id: '21', name: 'Owl', translation: 'उल्लू', canFly: true, emoji: '🦉' },
  // { id: '22', name: 'Lion', translation: 'शेर', canFly: false, emoji: '🦁' },
  // { id: '23', name: 'Pigeon', translation: 'कबूतर', canFly: true, emoji: '🐦' },
  // { id: '24', name: 'Car', translation: 'गाड़ी', canFly: false, emoji: '🚗' },
  // { id: '25', name: 'Bee', translation: 'मधुमक्खी', canFly: true, emoji: '🐝' },
  // { id: '26', name: 'Tiger', translation: 'बाघ', canFly: false, emoji: '🐅' },
  // { id: '27', name: 'Dragonfly', translation: 'व्याध पतंग', canFly: true, emoji: '蜻' },
  // { id: '28', name: 'House', translation: 'घर', canFly: false, emoji: '🏠' },
  // { id: '29', name: 'Kite', translation: 'पतंग', canFly: true, emoji: '🪁' },
  // { id: '30', name: 'Tree', translation: 'पेड़', canFly: false, emoji: '🌳' },
  
  //set 1 of slang + funny
  { id: '21', name: 'Mummy ki Chappal', translation: 'Mummy ki Chappal', canFly: true, emoji: '🩴' },
  { id: '22', name: 'Papa ki Pari', translation: 'Papa ki Pari', canFly: true, emoji: '🧚' },
  { id: '23', name: 'Udta Teer', translation: 'Udta Teer', canFly: true, emoji: '🏹' },
  { id: '24', name: 'Hosh', translation: 'Hosh', canFly: true, emoji: '😵‍💫' }, // "Hosh ud gaye"
  { id: '25', name: 'Salary', translation: 'Salary', canFly: true, emoji: '💸' }, // "Salary ud gayi"
  { id: '26', name: 'Backlog', translation: 'Backlog', canFly: false, emoji: '📚' }, // The Trap: It stays with you forever
  { id: '27', name: 'Dimag ka Dahi', translation: 'Dimag ka Dahi', canFly: false, emoji: '🧠' }, // The Trap: Heavy and grounded
  { id: '28', name: 'Ladki ka Chakkar', translation: 'Ladki ka Chakkar', canFly: false, emoji: '💘' }, // The Trap: It only makes you fall
  { id: '29', name: 'Afwah', translation: 'Afwah', canFly: true, emoji: '🗣️' }, // "Afwah udti hai"
  { id: '30', name: 'Sarkari Naukri', translation: 'Sarkari Naukri', canFly: false, emoji: '🏢' }, // The Trap: Hard to catch, but doesn't fly
  
  
  
  // { id: '31', name: 'Vulture', translation: 'गिद्ध', canFly: true, emoji: '🦅' },
  // { id: '32', name: 'Phone', translation: 'फोन', canFly: false, emoji: '📱' },
  // { id: '33', name: 'Drone', translation: 'ड्रोन', canFly: true, emoji: '🛸' },
  // { id: '34', name: 'Book', translation: 'किताब', canFly: false, emoji: '📖' },
  // { id: '35', name: 'Flamingo', translation: 'राजहंस', canFly: true, emoji: '🦩' },
  // { id: '36', name: 'Laptop', translation: 'लैपटॉप', canFly: false, emoji: '💻' },
  // { id: '37', name: 'Swan', translation: 'हंस', canFly: true, emoji: '🦢' },
  // { id: '38', name: 'Shoe', translation: 'जूता', canFly: false, emoji: '👟' },
  // { id: '39', name: 'Kingfisher', translation: 'रामचिरैया', canFly: true, emoji: '🐦' },
  // { id: '40', name: 'Bottle', translation: 'बोतल', canFly: false, emoji: '🍾' },

  // set 2
  { id: '31', name: 'Nind', translation: 'Nind', canFly: true, emoji: '😴' }, // "Nind ud gayi" (Can't sleep)
  { id: '32', name: 'Attendance', translation: 'Attendance', canFly: true, emoji: '📝' }, // "Attendance ud gayi" (Shortage panic)
  { id: '33', name: 'Weekend Plan', translation: 'Weekend Plan', canFly: true, emoji: '📅' }, // "Plan ud gaya" (Always cancels)
  { id: '34', name: 'WiFi Signal', translation: 'WiFi Signal', canFly: true, emoji: '📶' }, // "WiFi ud gaya" (Disconnect)
  { id: '35', name: 'Baal', translation: 'Baal', canFly: true, emoji: '👨‍🦲' }, // "Baal ud gaye" (Balding humor)
  { id: '36', name: 'Chunni', translation: 'Chunni', canFly: true, emoji: '🧣' }, // "Sarkane waali chunni udi udi jaye"
  { id: '37', name: 'Jhumka', translation: 'Jhumka', canFly: false, emoji: '👂' }, // TRAP: "Bareilly ke bazaar mein Gira" (It falls, doesn't fly)
  { id: '38', name: 'Remote', translation: 'Remote', canFly: true, emoji: '📺' }, // Physical projectile when you don't change the channel
  { id: '39', name: 'Kismat', translation: 'Kismat', canFly: true, emoji: '🎰' }, // "Kismat ud gayi"
  { id: '40', name: 'Samosa', translation: 'Samosa', canFly: false, emoji: '🥟' }, // TRAP: Too oily and heavy to ever leave the plate

  //set 3

  { id: '41', name: 'Tota (slang)', translation: 'Tota', canFly: false, emoji: '🧍' }, // THE ULTIMATE TRAP: Brain sees "Tota," thinks bird, clicks FLY -> LOSE.
  { id: '42', name: 'Hawai Chappal', translation: 'Hawai Chappal', canFly: true, emoji: '🩴' }, // NAME TRAP: "Hawai" means air + it's a projectile. 
  { id: '43', name: 'Pankha', translation: 'Pankha', canFly: false, emoji: '🌀' }, // MOVEMENT TRAP: It spins fast, but stays on the ceiling. 
  { id: '44', name: 'Anda', translation: 'Anda', canFly: false, emoji: '🥚' }, // ASSOCIATION TRAP: Brain thinks "Bird -> Egg -> Fly" and clicks.
  { id: '45', name: 'Ghanta', translation: 'Ghanta', canFly: false, emoji: '🔔' }, // SLANG: Pure Indian college energy. 
  { id: '46', name: 'Neend', translation: 'Neend', canFly: false, emoji: '😴' }, // IDIOM TRAP: "Neend ud gayi" is a phrase, but sleep doesn't fly. 
  { id: '47', name: 'Teer', translation: 'Teer', canFly: true, emoji: '🏹' }, // FAST ITEM: Keeps the rhythm moving.
  { id: '48', name: 'Bhoot', translation: 'Bhoot', canFly: true, emoji: '👻' }, // VIBE: Ghosts float/fly, easy but fun.
  { id: '49', name: 'Dil', translation: 'Dil', canFly: true, emoji: '💓' }, // SLANG: "Dil udta hai" — common metaphor.
  { id: '50', name: 'Bullet', translation: 'Bullet', canFly: true, emoji: '💥' }, // SPEED: It flies faster than birds.

  // set final

  { id: '51', name: 'Jugnu', translation: 'Jugnu', canFly: true, emoji: '🌟' }, // Literal: Firefly — it flies and glows.
  { id: '52', name: 'Santa Claus', translation: 'Santa Claus', canFly: true, emoji: '🎅' }, // VIBE: He flies on his sleigh, a quick "Yes."
  { id: '53', name: 'Dragon', translation: 'Dragon', canFly: true, emoji: '🐉' }, // FANTASY: High-speed "Yes."
  { id: '54', name: 'Aam Aadmi', translation: 'Aam Aadmi', canFly: false, emoji: '🧍' }, // HUMOR: Both feet firmly on the ground.
  { id: '55', name: 'Sasta Nasha', translation: 'Sasta Nasha', canFly: false, emoji: '💀' }, // SLANG TRAP: It makes you "high," but you definitely don't fly.
  { id: '56', name: 'Lafanga', translation: 'Lafanga', canFly: false, emoji: '🦥' }, // SLANG: Just wanders around, zero altitude.
  { id: '57', name: 'Ceiling Fan', translation: 'Ceiling Fan', canFly: false, emoji: '💨' }, // MOVEMENT TRAP: It spins, but it's bolted to the roof!
  { id: '58', name: 'Ustad', translation: 'Ustad', canFly: false, emoji: '🎓' }, // TRAP: Respect is high, but the person is grounded.
  { id: '59', name: 'Rocket Singh', translation: 'Rocket Singh', canFly: false, emoji: '👳' }, // NAME TRAP: The name says "Rocket," but he's a salesman!
  { id: '60', name: 'Hawa Hawai', translation: 'Hawa Hawai', canFly: true, emoji: '💃' }, // ICONIC: The ultimate Indian flying vibe.

  // { id: '41', name: 'Duck', translation: 'बतख', canFly: true, emoji: '🦆' },
  // { id: '42', name: 'Pen', translation: 'पेन', canFly: false, emoji: '🖊️' },
  // { id: '43', name: 'Seagull', translation: 'गंगा-चिल्ली', canFly: true, emoji: '🐦' },
  // { id: '44', name: 'Bed', translation: 'बिस्तर', canFly: false, emoji: '🛏️' },
  // { id: '45', name: 'Ladybug', translation: 'गुबरैला', canFly: true, emoji: '🐞' },
  // { id: '46', name: 'Pizza', translation: 'पिज़्ज़ा', canFly: false, emoji: '🍕' },
  // { id: '47', name: 'Firefly', translation: 'जुगनू', canFly: true, emoji: '🌟' },
  // { id: '48', name: 'Train', translation: 'ट्रेन', canFly: false, emoji: '🚂' },
  // { id: '49', name: 'Hawk', translation: 'बाज़', canFly: true, emoji: '🦅' },
  // { id: '50', name: 'Ball', translation: 'गेंद', canFly: false, emoji: '⚽' },



  // // Batch 2 (51-100)
  // { id: '51', name: 'Ant', translation: 'चींटी', canFly: false, emoji: '🐜' },
  // { id: '52', name: 'Cloud', translation: 'बादल', canFly: true, emoji: '☁️' }, // Floats/moves in sky
  // { id: '53', name: 'Pencil', translation: 'पेंसिल', canFly: false, emoji: '✏️' },
  // { id: '54', name: 'Parachute', translation: 'पैराशूट', canFly: true, emoji: '🪂' },
  // { id: '55', name: 'Spoon', translation: 'चम्मच', canFly: false, emoji: '🥄' },
  // { id: '56', name: 'Balloon', translation: 'गुब्बारा', canFly: true, emoji: '🎈' },
  // { id: '57', name: 'Door', translation: 'दरवाजा', canFly: false, emoji: '🚪' },
  // { id: '58', name: 'Bat (Cricket)', translation: 'बल्ला', canFly: false, emoji: '🏏' },
  // { id: '59', name: 'Hummingbird', translation: 'गुंजन पक्षी', canFly: true, emoji: '🐦' },
  // { id: '60', name: 'Flower', translation: 'फूल', canFly: false, emoji: '🌸' },
  // { id: '61', name: 'Jet', translation: 'जेट', canFly: true, emoji: '✈️' },
  // { id: '62', name: 'Key', translation: 'चाबी', canFly: false, emoji: '🔑' },
  // { id: '63', name: 'UFO', translation: 'उड़न तश्तरी', canFly: true, emoji: '🛸' },
  // { id: '64', name: 'Lock', translation: 'ताला', canFly: false, emoji: '🔒' },
  // { id: '65', name: 'Wasp', translation: 'ततैया', canFly: true, emoji: '🐝' },
  // { id: '66', name: 'Hammer', translation: 'हथौड़ा', canFly: false, emoji: '🔨' },
  // { id: '67', name: 'Crane', translation: 'सारस', canFly: true, emoji: '🦢' },
  // { id: '68', name: 'Bucket', translation: 'बाल्टी', canFly: false, emoji: '🪣' },
  // { id: '69', name: 'Stork', translation: 'बगुला', canFly: true, emoji: '🦩' },
  // { id: '70', name: 'Bicycle', translation: 'साइकिल', canFly: false, emoji: '🚲' },
  // { id: '71', name: 'Moth', translation: 'पतंगा', canFly: true, emoji: '🦋' },
  // { id: '72', name: 'Truck', translation: 'ट्रक', canFly: false, emoji: '🚚' },
  // { id: '73', name: 'Grasshopper', translation: 'टिड्डा', canFly: true, emoji: '🦗' },
  // { id: '74', name: 'Ship', translation: 'जहाज', canFly: false, emoji: '🚢' },
  // { id: '75', name: 'Pelican', translation: 'पेलिकन', canFly: true, emoji: '🐦' },
  // { id: '76', name: 'Boat', translation: 'नाव', canFly: false, emoji: '🛶' },
  // { id: '77', name: 'Woodpecker', translation: 'कठफोड़वा', canFly: true, emoji: '🐦' },
  // { id: '78', name: 'Apple', translation: 'सेब', canFly: false, emoji: '🍎' },
  // { id: '79', name: 'Ostrich', translation: 'शुतुरमुर्ग', canFly: false, emoji: '🐦' }, // Bird but cannot fly
  // { id: '80', name: 'Banana', translation: 'केला', canFly: false, emoji: '🍌' },
  // { id: '81', name: 'Penguin', translation: 'पेंगुइन', canFly: false, emoji: '🐧' }, // Bird but cannot fly
  // { id: '82', name: 'Grapes', translation: 'अंगूर', canFly: false, emoji: '🍇' },
  // { id: '83', name: 'Kiwi Bird', translation: 'कीवी', canFly: false, emoji: '🐦' }, // Bird but cannot fly
  // { id: '84', name: 'Mango', translation: 'आम', canFly: false, emoji: '🥭' },
  // { id: '85', name: 'Seaplane', translation: 'सीप्लेन', canFly: true, emoji: '✈️' },
  // { id: '86', name: 'Orange', translation: 'संतरा', canFly: false, emoji: '🍊' },
  // { id: '87', name: 'Blimp', translation: 'हवाई पोत', canFly: true, emoji: '🎈' },
  // { id: '88', name: 'Potato', translation: 'आलू', canFly: false, emoji: '🥔' },
  // { id: '89', name: 'Space Shuttle', translation: 'अंतरिक्ष यान', canFly: true, emoji: '🚀' },
  // { id: '90', name: 'Tomato', translation: 'टमाटर', canFly: false, emoji: '🍅' },
  // { id: '91', name: 'Satellite', translation: 'उपग्रह', canFly: true, emoji: '🛰️' },
  // { id: '92', name: 'Onion', translation: 'प्याज', canFly: false, emoji: '🧅' },
  // { id: '93', name: 'Phoenix', translation: 'फीनिक्स', canFly: true, emoji: '🔥' },
  // { id: '94', name: 'Carrot', translation: 'गाजर', canFly: false, emoji: '🥕' },
  // { id: '95', name: 'Dragon', translation: 'ड्रैगन', canFly: true, emoji: '🐉' },
  // { id: '96', name: 'Clock', translation: 'घड़ी', canFly: false, emoji: '⏰' },
  // { id: '97', name: 'Pegasus', translation: 'पेगासस', canFly: true, emoji: '🐎' },
  // { id: '98', name: 'Watch', translation: 'हाथ घड़ी', canFly: false, emoji: '⌚' },
  // { id: '99', name: 'Griffin', translation: 'ग्रिफिन', canFly: true, emoji: '🦅' },
  // { id: '100', name: 'Glasses', translation: 'चश्मा', canFly: false, emoji: '👓' },
  // // Batch 3 (101-150)
  // { id: '101', name: 'Cup', translation: 'कप', canFly: false, emoji: '☕' },
  // { id: '102', name: 'Hot Air Balloon', translation: 'गर्म हवा का गुब्बारा', canFly: true, emoji: '🎈' },
  // { id: '103', name: 'Plate', translation: 'थाली', canFly: false, emoji: '🍽️' },
  // { id: '104', name: 'Paper Plane', translation: 'कागज का विमान', canFly: true, emoji: '📄' },
  // { id: '105', name: 'Fork', translation: 'कांटा', canFly: false, emoji: '🍴' },
  // { id: '106', name: 'Frisbee', translation: 'फ्लाइंग डिस्क', canFly: true, emoji: '🥏' },
  // { id: '107', name: 'Knife', translation: 'चाकू', canFly: false, emoji: '🔪' },
  // { id: '108', name: 'Boomerang', translation: 'बूमरैंग', canFly: true, emoji: '🪃' },
  // { id: '109', name: 'Television', translation: 'टीवी', canFly: false, emoji: '📺' },
  // { id: '110', name: 'Arrow', translation: 'तीर', canFly: true, emoji: '🏹' },
  // { id: '111', name: 'Radio', translation: 'रेडियो', canFly: false, emoji: '📻' },
  // { id: '112', name: 'Bullet', translation: 'गोली', canFly: true, emoji: '🔫' },
  // { id: '113', name: 'Computer', translation: 'कंप्यूटर', canFly: false, emoji: '🖥️' },
  // { id: '114', name: 'Missile', translation: 'मिसाइल', canFly: true, emoji: '🚀' },
  // { id: '115', name: 'Mouse (PC)', translation: 'माउस', canFly: false, emoji: '🖱️' },
  // { id: '116', name: 'Comet', translation: 'धूमकेतु', canFly: true, emoji: '☄️' },
  // { id: '117', name: 'Keyboard', translation: 'कीबोर्ड', canFly: false, emoji: '⌨️' },
  // { id: '118', name: 'Meteor', translation: 'उल्का', canFly: true, emoji: '🌠' },
  // { id: '119', name: 'Printer', translation: 'प्रिंटर', canFly: false, emoji: '🖨️' },
  // { id: '120', name: 'Fairy', translation: 'परी', canFly: true, emoji: '🧚' },
  // { id: '121', name: 'Camera', translation: 'कैमरा', canFly: false, emoji: '📷' },
  // { id: '122', name: 'Angel', translation: 'फरिश्ता', canFly: true, emoji: '👼' },
  // { id: '123', name: 'Bag', translation: 'बस्ता', canFly: false, emoji: '🎒' },
  // { id: '124', name: 'Ghost', translation: 'भूत', canFly: true, emoji: '👻' }, // Often depicted floating/flying
  // { id: '125', name: 'Hat', translation: 'टोपी', canFly: false, emoji: '🧢' },
  // { id: '126', name: 'Witch', translation: 'चुड़ैल', canFly: true, emoji: '🧙‍♀️' }, // On broomstick
  // { id: '127', name: 'Shirt', translation: 'कमीज', canFly: false, emoji: '👕' },
  // { id: '128', name: 'Genie', translation: 'जिन', canFly: true, emoji: '🧞' }, // Floats
  // { id: '129', name: 'Pants', translation: 'पतलून', canFly: false, emoji: '👖' },
  // { id: '130', name: 'Superman', translation: 'सुपरमैन', canFly: true, emoji: '🦸' },
  // { id: '131', name: 'Dress', translation: 'पोशाक', canFly: false, emoji: '👗' },
  // { id: '132', name: 'Santa Claus', translation: 'सांता क्लॉज़', canFly: true, emoji: '🎅' }, // In sleigh
  // { id: '133', name: 'Sock', translation: 'मोजा', canFly: false, emoji: '🧦' },
  // { id: '134', name: 'Cupid', translation: 'कामदेव', canFly: true, emoji: '💘' },
  // { id: '135', name: 'Ring', translation: 'अंगूठी', canFly: false, emoji: '💍' },
  // { id: '136', name: 'Vampire Bat', translation: 'चमगादड़', canFly: true, emoji: '🦇' },
  // { id: '137', name: 'Necklace', translation: 'हार', canFly: false, emoji: '📿' },
  // { id: '138', name: 'Flying Fish', translation: 'उड़न मछली', canFly: true, emoji: '🐟' }, // Glides
  // { id: '139', name: 'Umbrella', translation: 'छाता', canFly: false, emoji: '☂️' },
  // { id: '140', name: 'Flying Squirrel', translation: 'उड़न गिलहरी', canFly: true, emoji: '🐿️' }, // Glides
  // { id: '141', name: 'Wallet', translation: 'बटुआ', canFly: false, emoji: '👛' },
  // { id: '142', name: 'Pterodactyl', translation: 'टेरोसॉर', canFly: true, emoji: '🦕' },
  // { id: '143', name: 'Coin', translation: 'सिक्का', canFly: false, emoji: '🪙' },
  // { id: '144', name: 'Robin', translation: 'रॉबिन', canFly: true, emoji: '🐦' },
  // { id: '145', name: 'Credit Card', translation: 'क्रेडिट कार्ड', canFly: false, emoji: '💳' },
  // { id: '146', name: 'Blue Jay', translation: 'नीलकंठ', canFly: true, emoji: '🐦' },
  // { id: '147', name: 'Dollar', translation: 'डॉलर', canFly: false, emoji: '💵' },
  // { id: '148', name: 'Cardinal', translation: 'कार्डिनल', canFly: true, emoji: '🐦' },
  // { id: '149', name: 'Gold', translation: 'सोना', canFly: false, emoji: '🥇' },
  // { id: '150', name: 'Finch', translation: 'फिंच', canFly: true, emoji: '🐦' },


  // Final 40
  { id: '61', name: 'Maina', translation: 'Maina', canFly: true, emoji: '🐦' }, // THE HOOK: A standard bird to set the rhythm.
  { id: '62', name: 'Naina', translation: 'Naina', canFly: false, emoji: '👀' }, // RHYME TRAP: Sounds like Maina. Brain says "Fly," reality says "Eyes."
  { id: '63', name: 'Gidhh', translation: 'Gidhh', canFly: true, emoji: '🦅' }, // THE HOOK: Vulture. 
  { id: '64', name: 'Giddha', translation: 'Giddha', canFly: false, emoji: '💃' }, // RHYME TRAP: Sounds like Gidhh, but it's a Punjabi dance.
  { id: '65', name: 'Machchar', translation: 'Machchar', canFly: true, emoji: '🦟' }, // THE HOOK: Mosquito.
  { id: '66', name: 'Magarmach', translation: 'Magarmach', canFly: false, emoji: '🐊' }, // ASSOCIATION TRAP: Starts with "Mach," brain thinks Mosquito/Fly.
  { id: '67', name: 'Makhi', translation: 'Makhi', canFly: true, emoji: '🪰' }, // THE HOOK: Housefly.
  { id: '68', name: 'Makhkhan', translation: 'Makhkhan', canFly: false, emoji: '🧈' }, // ALLITERATION TRAP: Starts with "Makh," brain triggers Fly reflex.
  { id: '69', name: 'Baaz', translation: 'Baaz', canFly: true, emoji: '🦅' }, // THE HOOK: Eagle/Falcon.
  { id: '70', name: 'Baaja', translation: 'Baaja', canFly: false, emoji: '🎺' }, // RHYME TRAP: Sounds like Baaz, but it's a musical instrument.

  { id: '71', name: 'Kaua', translation: 'Kaua', canFly: true, emoji: '🐦‍⬛' }, // THE HOOK: Crow.
  { id: '72', name: 'Tawa', translation: 'Tawa', canFly: false, emoji: '🍳' }, // RHYME TRAP: The #1 trick used in India to make kids lose.
  { id: '73', name: 'Titli', translation: 'Titli', canFly: true, emoji: '🦋' }, // THE HOOK: Butterfly.
  { id: '74', name: 'Katli', translation: 'Katli', canFly: false, emoji: '🍰' }, // RHYME TRAP: Brain thinks of Titli, hits fly, gets a Kaju Katli instead.
  { id: '75', name: 'Cheel', translation: 'Cheel', canFly: true, emoji: '🦅' }, // THE HOOK: Eagle/Vulture.
  { id: '76', name: 'Kheel', translation: 'Kheel', canFly: false, emoji: '🍿' }, // RHYME TRAP: Sounds like Cheel, but it's just puffed rice.
  { id: '77', name: 'Kabutar', translation: 'Kabutar', canFly: true, emoji: '🐦' }, // THE HOOK: Pigeon.
  { id: '78', name: 'Katar', translation: 'Katar', canFly: false, emoji: '⚔️' }, // ALLITERATION TRAP: Starts with "Ka," sounds like Kabutar, but it's a dagger.
  { id: '79', name: 'Koyal', translation: 'Koyal', canFly: true, emoji: '🐦' }, // THE HOOK: Cuckoo.
  { id: '80', name: 'Koyla', translation: 'Koyla', canFly: false, emoji: '🪨' }, // VOWEL TRAP: Just one letter off from Koyal, but it's heavy coal.

  { id: '81', name: 'चील', translation: 'Cheel', canFly: true, emoji: '🦅' }, // THE HOOK: Standard flyer.
  { id: '82', name: 'झील', translation: 'Jheel', canFly: false, emoji: '🏞️' }, // RHYME TRAP: चील vs झील. Visually almost identical in Devanagari.
  { id: '83', name: 'तोता', translation: 'Tota', canFly: true, emoji: '🦜' }, // THE HOOK: Standard flyer.
  { id: '84', name: 'पोता', translation: 'Pota', canFly: false, emoji: '👶' }, // RHYME TRAP: तोता vs पोता. At high speed, the first letter is the only difference.
  { id: '85', name: 'मैना', translation: 'Maina', canFly: true, emoji: '🐦' }, // THE HOOK: Standard flyer.
  { id: '86', name: 'नैना', translation: 'Naina', canFly: false, emoji: '👀' }, // RHYME TRAP: मैना vs नैना. A classic "Chidiya Udd" trick.
  { id: '87', name: 'मक्खी', translation: 'Makkhi', canFly: true, emoji: '🪰' }, // THE HOOK: Housefly.
  { id: '88', name: 'मटकी', translation: 'Matki', canFly: false, emoji: '🍯' }, // VISUAL TRAP: Starts with 'म', ends with 'की'. Brain sees Makkhi.
  { id: '89', name: 'उल्लू', translation: 'Ullu', canFly: true, emoji: '🦉' }, // THE HOOK: Owl / Common slang.
  { id: '90', name: 'चुल्लू', translation: 'Chullu', canFly: false, emoji: '🤲' }, // RHYME TRAP: Ullu vs Chullu. (As in "Chullu bhar paani").

// final funny + bakchodi

  { id: '91', name: 'Red Bull', translation: 'रेड बुल', canFly: true, emoji: '🐃' }, // TRAP: "Red Bull gives you wings" (Logic says yes!)
  { id: '92', name: 'Choti Sutta', translation: 'छोटा गोल्ड फ्लेक', canFly: true, emoji: '🚬' }, // SLANG: "Dhuaan udaana" (Pure hostel logic)
  { id: '93', name: 'System', translation: 'सिस्टम', canFly: false, emoji: '🚜' }, // MEME TRAP: "System hang hota hai, udta nahi" 
  { id: '94', name: 'Placement', translation: 'प्लेसमेंट', canFly: true, emoji: '🎓' }, // CSE PAIN: "Aayi aur kab ud gayi pata nahi chala"
  { id: '95', name: 'Fufaji', translation: 'नाराज़ फूफाजी', canFly: false, emoji: '😠' }, // WEDDING TRAP: Too much ego/weight to ever fly
  { id: '96', name: 'Elon Musk', translation: 'एलन मस्क', canFly: true, emoji: '🚀' }, // REALITY: Man is literally trying to live in the air
  { id: '97', name: 'Maggi', translation: '2-मिनट मैगी', canFly: true, emoji: '🍜' }, // HOSTEL TRAP: Put it on the table and it "flies" in seconds
  { id: '98', name: 'Ex ki Yaadein', translation: 'एक्स की यादें', canFly: true, emoji: '💔' }, // PANIC TRAP: "Raat ko udti hui aati hain"
  { id: '99', name: 'Vibe', translation: 'वाइब', canFly: true, emoji: '🎧' }, // GEN Z: "Vibe ud rahi hai"
  { id: '100', name: 'Chidiya Udd', translation: 'चिड़िया उड़', canFly: true, emoji: '🕹️' }, // THE FINALE: The game itself MUST fly!
];

export const INITIAL_SPEED = 1400; 
export const MIN_SPEED = 500; 
export const SPEED_DECREMENT = 150; 
export const MAX_LIVES = 3;