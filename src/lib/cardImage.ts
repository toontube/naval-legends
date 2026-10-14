// Card and hero images: 480px variants live in public/images/sm/ and every image has a .webp
// sibling (both made by scripts/optimize-images.mjs).
const local = (src: string) => src.startsWith('/images/');
const webp = (src: string) => src.replace(/\.(jpe?g|png)$/i, '.webp');
const small = (src: string) => src.replace('/images/', '/images/sm/');

export const cardSrcset = (src: string) => (local(src) ? `${small(src)} 480w, ${src} 1200w` : undefined);
export const cardSrcsetWebp = (src: string) =>
  local(src) ? `${webp(small(src))} 480w, ${webp(src)} 1200w` : undefined;

export const CARD_SIZES = '(max-width: 600px) 100vw, 400px';
