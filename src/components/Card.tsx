import { useState, type CSSProperties } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface CardSpecs {
  type: string;
  displacement: string;
  armament: string;
  speed: string;
  built: string;
}

export interface CardData {
  hook: string;
  reveal: string;
  specs?: CardSpecs;
  year: number;
  ship: string;
  image?: string;
  linkedStory: string;
  order: number;
}

const gradients: string[] = [
  'linear-gradient(135deg, #0c1929 0%, #1a1a2e 50%, #16213e 100%)',
  'linear-gradient(135deg, #0f1a2e 0%, #1b2838 50%, #0d2137 100%)',
  'linear-gradient(135deg, #141e30 0%, #243b55 50%, #141e30 100%)',
  'linear-gradient(135deg, #0a1628 0%, #1c2541 50%, #0a1628 100%)',
  'linear-gradient(135deg, #131a2a 0%, #1f3044 50%, #0e1b2d 100%)',
  'linear-gradient(135deg, #0d1b2a 0%, #1b2a49 50%, #162032 100%)',
  'linear-gradient(135deg, #101d2e 0%, #203040 50%, #0f1925 100%)',
  'linear-gradient(135deg, #0b1520 0%, #1a2940 50%, #0e1e30 100%)',
  'linear-gradient(135deg, #0a1220 0%, #152238 50%, #0d1a2c 100%)',
];

interface CardProps {
  card: CardData;
  style?: CSSProperties;
  onReveal?: () => void;
}

export function Card({ card, style, onReveal }: CardProps) {
  const [revealed, setRevealed] = useState(false);
  const gradient = gradients[(card.order - 1) % gradients.length];
  const hasArticle = card.linkedStory !== 'placeholder';
  const storyUrl = hasArticle ? `/stories/${card.linkedStory}` : undefined;

  const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('a, button')) return;
    if (!revealed) {
      setRevealed(true);
      onReveal?.();
      (window as any).gtag?.('event', 'card_reveal', {
        card_ship: card.ship,
        card_year: card.year,
      });
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const specsLine = card.specs
      ? `\n${card.specs.type} · ${card.specs.displacement} · ${card.specs.armament} · ${card.specs.speed}`
      : '';
    const text = `"${card.hook}"\n\n${card.reveal}${specsLine}`;
    const url = hasArticle
      ? `https://brvzulu.com/stories/${card.linkedStory}`
      : 'https://brvzulu.com';

    (window as any).gtag?.('event', 'card_share', {
      card_ship: card.ship,
      method: navigator.share ? 'native' : 'clipboard',
    });

    if (navigator.share) {
      navigator.share({ title: card.ship, text, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${text}\n\n${url}`).then(() => {
        const btn = e.currentTarget as HTMLButtonElement;
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = 'Share'; }, 2000);
      });
    }
  };

  return (
    <div className="card" style={{ ...style, background: gradient }} onClick={handleTap}>
      {card.image && (
        <div
          className="card-bg"
          style={{
            backgroundImage: `url(${card.image})`,
            opacity: revealed ? 0.12 : 0.3,
          }}
        />
      )}

      <div className="card-content">
        {!revealed ? (
          <>
            <span className="card-year">{card.year}</span>
            <h2 className="card-hook">"{card.hook}"</h2>
            <p className="card-ship">{card.ship}</p>
            <p className="card-tap-hint">Tap to find out</p>
          </>
        ) : (
          <AnimatePresence>
            <motion.div
              className="card-revealed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <p className="card-reveal-text">{card.reveal}</p>

              <div className="card-reveal-actions">
                {hasArticle && (
                  <a
                    href={storyUrl}
                    className="card-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      (window as any).gtag?.('event', 'read_full_story', {
                        card_ship: card.ship,
                        story_slug: card.linkedStory,
                      });
                    }}
                  >
                    Read full story
                  </a>
                )}
                <button className="card-share-btn" onClick={handleShare}>
                  Share
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
