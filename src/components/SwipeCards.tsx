import { useState, useEffect, useCallback } from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from 'motion/react';
import { Card, type CardData } from './Card';

interface SwipeCardsProps {
  cards: CardData[];
}

export default function SwipeCards({ cards }: SwipeCardsProps) {
  const [index, setIndex] = useState(0);
  const [exitX, setExitX] = useState(0);

  const current = cards[index];
  const next = cards[index + 1];

  const goNext = useCallback(() => {
    setIndex((i) => Math.min(i + 1, cards.length));
  }, [cards.length]);

  const goPrev = useCallback(() => {
    setIndex((i) => Math.max(i - 1, 0));
  }, []);

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
          <p className="swipe-end-label">That's all for today</p>
          <h2 className="swipe-end-heading">Know a story we should tell?</h2>
          <p className="swipe-end-text">
            A ship with a wild backstory, a battle nobody talks about,
            a detail too absurd to be fiction.
          </p>
          <a href="/submit" className="swipe-end-btn">Submit a story &rarr;</a>
          <button
            className="swipe-end-restart"
            onClick={() => setIndex(0)}
          >
            or start over
          </button>
        </div>
      </div>
    );
  }

  if (!current) return null;

  return (
    <div className="swipe-container">
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
          onSwipe={(direction) => {
            setExitX(direction === 'right' ? 300 : -300);
            if (direction === 'right') goNext();
            else goPrev();
          }}
          exitX={exitX}
        />
      </AnimatePresence>

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

      {/* Card counter */}
      <div className="swipe-counter">
        {index + 1} / {cards.length}
      </div>
    </div>
  );
}

function DraggableCard({
  card,
  onSwipe,
  exitX,
}: {
  card: CardData;
  onSwipe: (direction: 'left' | 'right') => void;
  exitX: number;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-12, 0, 12]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);

  return (
    <motion.div
      className="swipe-card"
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
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
      <Card card={card} />
    </motion.div>
  );
}
