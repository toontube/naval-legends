import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

// Built from the stories collection so every published story is listed.
export const GET: APIRoute = async () => {
  const stories = (await getCollection('stories')).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  const lines = [
    '# Bravo Zulu',
    '',
    '> Bravo Zulu is a naval history research site publishing daily stories and in-depth articles about the world\'s warships. The name comes from the NATO signal flag code "BZ" meaning "well done." Each story starts with a surprising fact and goes deep into primary sources.',
    '',
    'Full text of every article: https://brvzulu.com/llms-full.txt',
    '',
    '## Articles',
    '',
    ...stories.map((s) => `- [${s.data.title}](https://brvzulu.com/stories/${s.data.slug}/): ${s.data.summary}`),
    '',
    '## Topics Covered',
    '',
    `Naval history, warship battles, WWII Pacific theater, WWI naval warfare, commerce raiders, naval engineering failures, ship design flaws, nuclear testing on warships, Cold War naval history, Battle of Tassafaronga, Battle of Penang 1914, Battle of Cherbourg 1864, Operation Crossroads Bikini Atoll, Iron Bottom Sound, treaty cruisers, pocket battleships, Falklands War, Battle of Surigao Strait, K-class submarines, steam-powered submarines, Battle of May Island, St Nazaire Raid, Operation Chariot, French Revolutionary Wars, cavalry vs navy, Den Helder 1795, IJN Shinano, USS Archerfish, USS Pueblo, North Korea, Pearl Harbor, Chaplain Forgy, Praise the Lord and Pass the Ammunition.`,
    '',
    '## Contact',
    '',
    'stories@bravozulu.co',
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
