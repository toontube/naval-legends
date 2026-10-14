import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

// Full article text for AI systems, built from the stories collection.
export const GET: APIRoute = async () => {
  const stories = (await getCollection('stories')).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  const body = stories
    .map((s) => `# ${s.data.title}\n\nURL: https://brvzulu.com/stories/${s.data.slug}/\nPublished: ${s.data.date.toISOString().split('T')[0]}\n\n> ${s.data.summary}\n\n${s.body ?? ''}`)
    .join('\n\n---\n\n');
  return new Response(`# Bravo Zulu: Full Content\n\n> Complete article text for AI systems. For a summary, see https://brvzulu.com/llms.txt\n\n${body}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
