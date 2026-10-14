// Run after adding images: node scripts/optimize-images.mjs
// Recompresses public/images originals that are still large (max 1600px wide) and writes
// missing 480px card variants to public/images/sm/. Already-optimized files are left alone,
// so re-running never recompresses an image twice.
import sharp from 'sharp';
import { readdir, stat, writeFile, mkdir, access } from 'node:fs/promises';
import path from 'node:path';

const dir = 'public/images';
const LIMIT = 250 * 1024;
await mkdir(path.join(dir, 'sm'), { recursive: true });
const exists = (p) => access(p).then(() => true, () => false);

for (const f of await readdir(dir)) {
  if (!/\.(jpe?g|png)$/i.test(f)) continue;
  const p = path.join(dir, f);
  const png = /\.png$/i.test(f);
  const enc = (s) => (png ? s.png({ palette: true, quality: 85, compressionLevel: 9 }) : s.jpeg({ quality: 78, mozjpeg: true }));
  const before = (await stat(p)).size;
  const { width } = await sharp(p).metadata();
  if (before > LIMIT || width > 1600) {
    const full = await enc(sharp(p).resize({ width: 1600, withoutEnlargement: true })).toBuffer();
    if (full.length < before) {
      await writeFile(p, full);
      console.log(f, Math.round(before / 1024), '->', Math.round(full.length / 1024), 'KB');
    }
  }
  const sm = path.join(dir, 'sm', f);
  if (!(await exists(sm))) {
    await writeFile(sm, await enc(sharp(p).resize({ width: 480, withoutEnlargement: true })).toBuffer());
    console.log('sm/' + f);
  }
}
