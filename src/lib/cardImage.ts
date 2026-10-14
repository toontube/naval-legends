// Card images: 480px variants live in public/images/sm/ (made by scripts/optimize-images.mjs).
export const cardSrcset = (src: string) =>
  src.startsWith('/images/') ? `${src.replace('/images/', '/images/sm/')} 480w, ${src} 1200w` : undefined;

export const CARD_SIZES = '(max-width: 600px) 100vw, 400px';
