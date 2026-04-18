import { useState, useEffect, useCallback, useRef } from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimate,
  AnimatePresence,
} from 'motion/react';
import { Card, type CardData } from './Card';

declare global {
  interface Window { gtag?: (...args: unknown[]) => void; }
}

function track(event: string, params?: Record<string, unknown>) {
  window.gtag?.('event', event, params);
}

interface SwipeCardsProps {
  cards: CardData[];
}

export default function SwipeCards({ cards }: SwipeCardsProps) {
  const [index, setIndex] = useState(0);
  const [exitX, setExitX] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [factsLearned, setFactsLearned] = useState(0);

  const current = cards[index];
  const next = cards[index + 1];

  const markInteracted = useCallback(() => {
    if (!hasInteracted) setHasInteracted(true);
  }, [hasInteracted]);

  const goNext = useCallback(() => {
    markInteracted();
    setIndex((prev) => {
      const next = Math.min(prev + 1, cards.length);
      const card = cards[next];
      if (card) {
        track('card_view', { card_ship: card.ship, card_index: next + 1, card_year: card.year });
      } else {
        track('cards_completed', { total_cards: cards.length });
      }
      return next;
    });
  }, [cards, markInteracted]);

  const goPrev = useCallback(() => {
    markInteracted();
    setIndex((i) => Math.max(i - 1, 0));
  }, [markInteracted]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        setExitX(300);
        goNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        setExitX(-300);
        goPrev();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goNext, goPrev]);

  const pastEnd = index >= cards.length;
  const isLast = index === cards.length - 1;
  const isFirst = index === 0;

  if (pastEnd) {
    return (
      <div className="swipe-container">
        <div className="swipe-end">
          {factsLearned > 0 && (
            <p className="swipe-end-count">{factsLearned} {factsLearned === 1 ? 'fact' : 'facts'} learned today</p>
          )}
          <h2 className="swipe-end-heading">Got a good one?</h2>
          <p className="swipe-end-text">
            If you know a ship story that belongs here, send it over.
          </p>
          <div className="swipe-end-actions">
            <a href="/submit" className="swipe-end-btn" onClick={() => track('click_submit_cta', { location: 'end_screen' })}>Submit a story &rarr;</a>
            <a href="/stories" className="swipe-end-link" onClick={() => track('click_browse_stories', { location: 'end_screen' })}>Browse all stories</a>
          </div>
          <button
            className="swipe-end-restart"
            onClick={() => { track('click_start_over'); setIndex(0); }}
          >
            &larr; Start over
          </button>
        </div>
      </div>
    );
  }

  if (!current) return null;

  return (
    <div className="swipe-container">
      {/* Facts counter or Today's badge */}
      {factsLearned > 0 ? (
        <div className="swipe-facts-counter">
          {factsLearned} {factsLearned === 1 ? 'fact' : 'facts'} learned
        </div>
      ) : isFirst && !hasInteracted ? (
        <div className="swipe-badge">Today's Stories</div>
      ) : null}

      {/* Next card (behind) */}
      {next && (
        <div className="swipe-card swipe-card--behind">
          <Card card={next} />
        </div>
      )}

      {/* Current card (draggable) */}
      <AnimatePresence mode="popLayout">
        <DraggableCard
          key={current.order}
          card={current}
          isFirst={isFirst && !hasInteracted}
          onSwipe={(direction) => {
            setExitX(direction === 'right' ? 300 : -300);
            if (direction === 'right') goNext();
            else goPrev();
          }}
          onDragStart={markInteracted}
          onReveal={() => setFactsLearned((n) => n + 1)}
          exitX={exitX}
        />
      </AnimatePresence>

      {/* Swipe hint — fades after first interaction */}
      {!hasInteracted && (
        <motion.div
          className="swipe-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <span className="swipe-hint-arrow">&larr;</span>
          <span>Swipe to explore</span>
          <span className="swipe-hint-arrow">&rarr;</span>
        </motion.div>
      )}

      {/* Arrow buttons (desktop) */}
      <button
        className="swipe-arrow swipe-arrow--left"
        onClick={() => { setExitX(-300); goPrev(); }}
        aria-label="Previous card"
        style={{ opacity: isFirst ? 0.2 : 1 }}
        disabled={isFirst}
      >
        &#8249;
      </button>
      <button
        className="swipe-arrow swipe-arrow--right"
        onClick={() => { setExitX(300); goNext(); }}
        aria-label="Next card"
        style={{ opacity: isLast ? 0.2 : 1 }}
        disabled={isLast}
      >
        &#8250;
      </button>

      {/* Progress dots */}
      <div className="swipe-dots">
        {cards.map((_, i) => (
          <span
            key={i}
            className={`swipe-dot ${i === index ? 'swipe-dot--active' : ''} ${i < index ? 'swipe-dot--seen' : ''}`}
          />
        ))}
      </div>
    </div>
  );
}

function DraggableCard({
  card,
  isFirst,
  onSwipe,
  onDragStart,
  onReveal,
  exitX,
}: {
  card: CardData;
  isFirst: boolean;
  onSwipe: (direction: 'left' | 'right') => void;
  onDragStart: () => void;
  onReveal: () => void;
  exitX: number;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-12, 0, 12]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);
  const [scope, animate] = useAnimate();
  const hintPlayed = useRef(false);

  // Nudge animation on first card to hint at swiping
  useEffect(() => {
    if (isFirst && !hintPlayed.current) {
      hintPlayed.current = true;
      const timer = setTimeout(async () => {
        try {
          await animate(scope.current, { x: -40 }, { duration: 0.4, ease: 'easeOut' });
          await animate(scope.current, { x: 0 }, { type: 'spring', stiffness: 400, damping: 15 });
        } catch {
          // component unmounted
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isFirst, animate, scope]);

  return (
    <motion.div
      ref={scope}
      className="swipe-card"
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragStart={onDragStart}
      onDragEnd={(_, info) => {
        const threshold = 100;
        const velocityThreshold = 500;
        if (
          info.offset.x > threshold ||
          info.velocity.x > velocityThreshold
        ) {
          onSwipe('right');
        } else if (
          info.offset.x < -threshold ||
          info.velocity.x < -velocityThreshold
        ) {
          onSwipe('left');
        }
      }}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ x: exitX, opacity: 0, transition: { duration: 0.3 } }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <Card card={card} onReveal={onReveal} />
    </motion.div>
  );
}
