import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import fs from 'node:fs';
import path from 'node:path';

// Resolve from project root (works in both dev and build)
const projectRoot = process.cwd();
const fontsDir = path.join(projectRoot, 'src', 'fonts');

const playfair = fs.readFileSync(path.join(fontsDir, 'PlayfairDisplay-Bold.woff'));
const lora = fs.readFileSync(path.join(fontsDir, 'Lora-Regular.woff'));
const inter = fs.readFileSync(path.join(fontsDir, 'Inter-Medium.woff'));

export const getStaticPaths: GetStaticPaths = async () => {
  const stories = await getCollection('stories');
  return stories.map((s) => ({
    params: { slug: s.data.slug },
    props: { story: s },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const { story } = props as { story: Awaited<ReturnType<typeof getCollection<'stories'>>>[number] };

  const summary = story.data.summary.length > 120
    ? story.data.summary.slice(0, 117) + '...'
    : story.data.summary;

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #0c1929 0%, #1a1a2e 50%, #16213e 100%)',
          padding: '60px 80px',
          textAlign: 'center',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                gap: '20px',
              },
              children: [
                {
                  type: 'h1',
                  props: {
                    children: story.data.title,
                    style: {
                      fontFamily: 'Playfair Display',
                      fontSize: story.data.title.length > 80 ? '36px' : '44px',
                      fontWeight: 700,
                      color: '#ffffff',
                      lineHeight: 1.2,
                      margin: 0,
                    },
                  },
                },
                {
                  type: 'p',
                  props: {
                    children: summary,
                    style: {
                      fontFamily: 'Lora',
                      fontSize: '22px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      lineHeight: 1.4,
                      margin: 0,
                      maxWidth: '900px',
                    },
                  },
                },
              ],
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              },
              children: [
                {
                  type: 'span',
                  props: {
                    children: 'BRAVO ZULU',
                    style: {
                      fontFamily: 'Inter',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: 'rgba(255, 255, 255, 0.25)',
                      letterSpacing: '0.15em',
                    },
                  },
                },
                {
                  type: 'span',
                  props: {
                    children: '·',
                    style: {
                      fontFamily: 'Inter',
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.15)',
                    },
                  },
                },
                {
                  type: 'span',
                  props: {
                    children: 'brvzulu.com',
                    style: {
                      fontFamily: 'Inter',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: 'rgba(255, 255, 255, 0.25)',
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Playfair Display', data: playfair, weight: 700, style: 'normal' as const },
        { name: 'Lora', data: lora, weight: 400, style: 'normal' as const },
        { name: 'Inter', data: inter, weight: 500, style: 'normal' as const },
      ],
    }
  );

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width' as const, value: 1200 },
  });
  const png = resvg.render().asPng();

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
