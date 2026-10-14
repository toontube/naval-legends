// Topic hubs at /topics/<slug>/. Each lists its stories explicitly so a hub never
// depends on inconsistent story tags.
export interface Topic {
  slug: string;
  name: string;
  title: string; // <title> without the " | Bravo Zulu" suffix
  intro: string;
  stories: string[];
}

export const TOPICS: Topic[] = [
  {
    slug: 'wwii-naval-history',
    name: 'World War II',
    title: 'WWII Naval History: Stories and Battles',
    intro:
      'From the Arctic convoys to Ironbottom Sound, the Second World War was the largest naval war ever fought. These are the ships, crews and decisions behind it: cruisers held together with coconut logs, a carrier sunk seventeen hours into her maiden voyage, and a destroyer packed with explosives and rammed into a drydock.',
    stories: [
      'uss-indianapolis-sharks', 'shinano-maiden-voyage', 'hms-campbeltown-st-nazaire', 'barents-sea-new-years-eve',
      'hms-edinburgh-gold', 'ironbottom-sound', 'karel-doorman-java-sea', 'uss-new-orleans-coconut-bow',
      'uss-new-orleans-pearl-harbor', 'uss-porter-torpedo-fdr', 'mogami-cardboard-cruiser', 'cleveland-class-top-heavy',
      'uss-wichita-pig-iron', 'hms-zubian-frankenship', 'genoa-cathedral-shell', 'deutschland-renamed', 'prinz-eugen-bikini',
      'uss-phoenix-belgrano', 'hms-glorious-doyly-hughes', 'bismarck-last-battle', 'yamato-last-sortie', 'battle-of-midway'],
  },
  {
    slug: 'wwi-naval-history',
    name: 'World War I',
    title: 'WWI Naval History: Raiders, Mutinies and Scuttlings',
    intro:
      'The First World War at sea was the age of the dreadnought, the commerce raider and the experimental submarine. Read how SMS Emden faked a funnel to raid Penang, how the Royal Navy lost steam submarines to its own fleet, and how Germany sank its entire interned navy at Scapa Flow.',
    stories: [
      'emden-penang-raid', 'k-class-kalamity', 'scapa-flow-scuttling', 'uss-cyclops-vanished', 'aurora-friendly-fire',
      'uss-olympia-unknown-soldier',
    ],
  },
  {
    slug: 'cold-war-naval-history',
    name: 'Cold War and modern',
    title: 'Cold War and Modern Naval History',
    intro:
      'After 1945 the navies changed shape: nuclear tests on captured battleships, a spy ship still held in Pyongyang, a night collision that cut a destroyer in half, a Falklands sinking by a 1920s torpedo, an unfinished Soviet carrier bought as a casino that became China\'s first aircraft carrier, the loss of the submarine Kursk in 2000, and the cruiser Moskva, sunk off Odesa in 2022.',
    stories: ['uss-pueblo-captured', 'uss-hobson-wasp-collision', 'uss-phoenix-belgrano', 'varyag-casino-carrier', 'prinz-eugen-bikini', 'kursk-submarine-disaster', 'moskva-sinking-2022'],
  },
  {
    slug: 'age-of-sail',
    name: 'Age of Sail and Civil War',
    title: 'Age of Sail and Civil War Naval History',
    intro:
      'Before steel and steam took over: the Mary Rose sinking in front of Henry VIII, Sweden\'s Vasa capsizing on her maiden voyage, USS Constitution and her "iron" sides, French cavalry capturing a Dutch fleet frozen in the ice at Den Helder in 1795, and the Confederate raider CSS Alabama, which took 65 Union ships before sinking off Cherbourg in front of a crowd of spectators.',
    stories: ['den-helder-cavalry-fleet', 'css-alabama-semmes', 'vasa-maiden-voyage', 'uss-constitution-old-ironsides', 'mary-rose-solent-1545'],
  },
  {
    slug: 'us-navy',
    name: 'US Navy',
    title: 'US Navy History: Ships, Disasters and Survivors',
    intro:
      'Stories of United States Navy ships from the War of 1812 to the Cold War: USS Constitution, USS Indianapolis and the sharks, USS New Orleans and her coconut-log bow, the collier Cyclops that vanished with 306 men, and USS Pueblo, still held in North Korea.',
    stories: [
      'uss-indianapolis-sharks', 'uss-new-orleans-coconut-bow', 'uss-new-orleans-pearl-harbor', 'uss-cyclops-vanished',
      'uss-pueblo-captured', 'uss-hobson-wasp-collision', 'uss-porter-torpedo-fdr', 'uss-olympia-unknown-soldier',
      'uss-wichita-pig-iron', 'uss-phoenix-belgrano', 'cleveland-class-top-heavy', 'ironbottom-sound', 'uss-constitution-old-ironsides', 'battle-of-midway'],
  },
  {
    slug: 'royal-navy',
    name: 'Royal Navy',
    title: 'Royal Navy History: Raids, Convoys and Disasters',
    intro:
      'The Royal Navy at its most daring and its most unlucky: the St Nazaire raid, the gold of HMS Edinburgh, two broken destroyers welded into one, steam submarines that sank each other, and six destroyers that held off a pocket battleship on New Year\'s Eve.',
    stories: [
      'hms-campbeltown-st-nazaire', 'hms-edinburgh-gold', 'hms-zubian-frankenship', 'k-class-kalamity', 'barents-sea-new-years-eve',
      'genoa-cathedral-shell', 'scapa-flow-scuttling', 'hms-glorious-doyly-hughes', 'bismarck-last-battle', 'mary-rose-solent-1545'],
  },
  {
    slug: 'german-navy',
    name: 'German Navy',
    title: 'German Navy History: Kaiserliche Marine and Kriegsmarine',
    intro:
      'From the Kaiser\'s raiders to Hitler\'s Kriegsmarine: SMS Emden at Penang, the scuttling of the High Seas Fleet, a pocket battleship renamed out of fear of a headline, and Prinz Eugen, which survived two atomic bombs.',
    stories: ['emden-penang-raid', 'scapa-flow-scuttling', 'deutschland-renamed', 'prinz-eugen-bikini', 'barents-sea-new-years-eve', 'bismarck-last-battle', 'hms-glorious-doyly-hughes'],
  },
  {
    slug: 'imperial-japanese-navy',
    name: 'Imperial Japanese Navy',
    title: 'Imperial Japanese Navy History: Shinano, Mogami and More',
    intro:
      'The Imperial Japanese Navy built some of the largest and most aggressive warships of the Second World War. Read about Shinano, the Yamato-class carrier sunk on her maiden voyage, Mogami, the treaty-busting cruiser, and the night battles off Guadalcanal.',
    stories: ['shinano-maiden-voyage', 'mogami-cardboard-cruiser', 'ironbottom-sound', 'karel-doorman-java-sea', 'uss-indianapolis-sharks', 'yamato-last-sortie', 'battle-of-midway'],
  },
  {
    slug: 'russian-soviet-navy',
    name: 'Russian and Soviet Navy',
    title: 'Russian and Soviet Navy History: Aurora to Moskva',
    intro:
      'From the Tsar\'s fleet to Putin\'s: the cruiser Aurora, shot at by her own squadron and later famous for the revolution, the Zhemchug sunk at anchor in Penang, the unfinished carrier Varyag, the submarine Kursk lost with 118 men, and the cruiser Moskva, sunk by two missiles in 2022.',
    stories: ['aurora-friendly-fire', 'emden-penang-raid', 'varyag-casino-carrier', 'kursk-submarine-disaster', 'moskva-sinking-2022'],
  },
  {
    slug: 'naval-mysteries-and-disasters',
    name: 'Mysteries and disasters',
    title: 'Naval Mysteries and Disasters: Lost Ships and Worst Losses',
    intro:
      'Ships that vanished without a trace, the deadliest sinkings ever recorded, and the accidents navies would rather forget. Start with the ranked list of the worst naval disasters, then the ships that disappeared.',
    stories: [
      'worst-naval-disasters', 'ships-that-disappeared', 'uss-cyclops-vanished', 'uss-hobson-wasp-collision', 'k-class-kalamity',
      'shinano-maiden-voyage', 'uss-indianapolis-sharks', 'vasa-maiden-voyage', 'kursk-submarine-disaster', 'mary-rose-solent-1545'],
  },
];

export const topicsForStory = (slug: string) => TOPICS.filter((t) => t.stories.includes(slug));
