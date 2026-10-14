// One-off: recompress public/images in place (max 1600px wide) and write 480px card variants to public/images/sm/.
import sharp from 'sharp';
import { readdir, stat, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const dir = 'public/images';
await mkdir(path.join(dir, 'sm'), { recursive: true });
for (const f of await readdir(dir)) {
  const p = path.join(dir, f);
  if (!/\.(jpe?g|png)$/i.test(f)) continue;
  const before = (await stat(p)).size;
  const png = /\.png$/i.test(f);
  const enc = (s) => (png ? s.png({ palette: true, quality: 85, compressionLevel: 9 }) : s.jpeg({ quality: 78, mozjpeg: true }));
  const full = await enc(sharp(p).resize({ width: 1600, withoutEnlargement: true })).toBuffer();
  if (full.length < before) await writeFile(p, full);
  await writeFile(path.join(dir, 'sm', f), await enc(sharp(p).resize({ width: 480, withoutEnlargement: true })).toBuffer());
  console.log(f, Math.round(before / 1024), '->', Math.round(Math.min(full.length, before) / 1024), 'KB');
}
