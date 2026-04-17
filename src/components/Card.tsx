import type { CSSProperties } from 'react';

export interface CardData {
  hook: string;
  year: number;
  ship: string;
  image?: string;
  linkedStory: string;
  order: number;
}

// Each card gets a unique gradient based on order
const gradients: string[] = [
  'linear-gradient(135deg, #0c1929 0%, #1a1a2e 50%, #16213e 100%)',
  'linear-gradient(135deg, #0f1a2e 0%, #1b2838 50%, #0d2137 100%)',
  'linear-gradient(135deg, #141e30 0%, #243b55 50%, #141e30 100%)',
  'linear-gradient(135deg, #0a1628 0%, #1c2541 50%, #0a1628 100%)',
  'linear-gradient(135deg, #131a2a 0%, #1f3044 50%, #0e1b2d 100%)',
  'linear-gradient(135deg, #0d1b2a 0%, #1b2a49 50%, #162032 100%)',
  'linear-gradient(135deg, #101d2e 0%, #203040 50%, #0f1925 100%)',
  'linear-gradient(135deg, #0b1520 0%, #1a2940 50%, #0e1e30 100%)',
];

interface CardProps {
  card: CardData;
  style?: CSSProperties;
}

export function Card({ card, style }: CardProps) {
  const gradient = gradients[(card.order - 1) % gradients.length];
  const hasArticle = card.linkedStory !== 'placeholder';
  const storyUrl = hasArticle ? `/stories/${card.linkedStory}` : undefined;

  return (
    <div className="card" style={{ ...style, background: gradient }}>
      {card.image && (
        <div
          className="card-bg"
          style={{ backgroundImage: `url(${card.image})` }}
        />
      )}

      <div className="card-content">
        <span className="card-year">{card.year}</span>

        <h2 className="card-hook">"{card.hook}"</h2>

        <p className="card-ship">{card.ship}</p>

        <div className="card-action">
          {hasArticle ? (
            <a
              href={storyUrl}
              className="card-btn"
              onClick={(e) => {
                e.stopPropagation();
                (window as any).gtag?.('event', 'read_full_story', {
                  card_ship: card.ship,
                  card_year: card.year,
                  story_slug: card.linkedStory,
                });
              }}
            >
              Read full story &rarr;
            </a>
          ) : (
            <span className="card-btn card-btn--soon">
              Full story coming soon
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
