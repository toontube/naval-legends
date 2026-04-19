import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, type CardData } from './Card';

declare global {
  interface Window { gtag?: (...args: unknown[]) => void; }
}

function track(event: string, params?: Record<string, unknown>) {
  window.gtag?.('event', event, params);
}

// Determine today's card based on date
const START_DATE = new Date('2026-04-19');
function getDayNumber(): number {
  const now = new Date();
  const diff = now.getTime() - START_DATE.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function getTodayStr(): string {
  return new Date().toISOString().split('T')[0];
}

interface DailyCardProps {
  cards: CardData[];
}

export default function DailyCard({ cards }: DailyCardProps) {
  const [revealed, setRevealed] = useState(false);
  const [streak, setStreak] = useState(0);
  const [totalSeen, setTotalSeen] = useState(0);
  const [shareText, setShareText] = useState('');
  const [copied, setCopied] = useState(false);

  // Pick today's card
  const dayNum = getDayNumber();
  const todayIndex = ((dayNum % cards.length) + cards.length) % cards.length;
  const todayCard = cards[todayIndex];

  // Pick 3 archive cards (not today's)
  const archiveCards = cards
    .filter((_, i) => i !== todayIndex)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  // Load streak from localStorage
  useEffect(() => {
    const today = getTodayStr();
    const lastVisit = localStorage.getItem('bz-last-visit');
    const savedStreak = parseInt(localStorage.getItem('bz-streak') || '0');
    const seenCards: string[] = JSON.parse(localStorage.getItem('bz-seen') || '[]');

    setTotalSeen(seenCards.length);

    if (lastVisit === today) {
      // Already visited today
      setStreak(savedStreak);
      if (seenCards.includes(todayCard.ship)) {
        setRevealed(true);
      }
    } else {
      // New day
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      const newStreak = lastVisit === yesterdayStr ? savedStreak + 1 : 1;
      setStreak(newStreak);
      localStorage.setItem('bz-streak', String(newStreak));
      localStorage.setItem('bz-last-visit', today);
    }
  }, [todayCard.ship]);

  const handleReveal = () => {
    if (revealed) return;
    setRevealed(true);

    // Save to seen list
    const seenCards: string[] = JSON.parse(localStorage.getItem('bz-seen') || '[]');
    if (!seenCards.includes(todayCard.ship)) {
      seenCards.push(todayCard.ship);
      localStorage.setItem('bz-seen', JSON.stringify(seenCards));
      setTotalSeen(seenCards.length);
    }
    localStorage.setItem('bz-last-visit', getTodayStr());

    track('daily_reveal', {
      card_ship: todayCard.ship,
      day_number: dayNum,
      streak,
    });

    setShareText(
      `BZ #${dayNum + 1}\n"${todayCard.hook}"\nbrvzulu.com`
    );
  };

  const handleShare = () => {
    const text = `BZ #${dayNum + 1}\n"${todayCard.hook}"\n\n${todayCard.reveal}\n\nbrvzulu.com`;
    const url = todayCard.linkedStory !== 'placeholder'
      ? `https://brvzulu.com/stories/${todayCard.linkedStory}`
      : 'https://brvzulu.com';

    track('daily_share', { card_ship: todayCard.ship, day: dayNum + 1 });

    if (navigator.share) {
      navigator.share({ title: `BZ #${dayNum + 1}`, text, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${text}\n${url}`).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const hasArticle = todayCard.linkedStory !== 'placeholder';

  return (
    <div className="daily-container">
      {/* Header */}
      <div className="daily-header">
        <span className="daily-day">BZ #{dayNum + 1}</span>
        {streak > 1 && <span className="daily-streak">{streak} day streak</span>}
      </div>

      {/* Today's card */}
      <div className="daily-card-wrap" onClick={handleReveal}>
        <div className="daily-card" style={{
          background: todayCard.image
            ? undefined
            : 'linear-gradient(135deg, #0c1929 0%, #1a1a2e 50%, #16213e 100%)',
        }}>
          {todayCard.image && (
            <div className="daily-card-bg" style={{
              backgroundImage: `url(${todayCard.image})`,
              opacity: revealed ? 0.12 : 0.3,
            }} />
          )}

          <div className="daily-card-content">
            {!revealed ? (
              <>
                <span className="daily-year">{todayCard.year}</span>
                <h2 className="daily-hook">"{todayCard.hook}"</h2>
                <p className="daily-ship">{todayCard.ship}</p>
                <p className="daily-tap">Tap to find out</p>
              </>
            ) : (
              <AnimatePresence>
                <motion.div
                  className="daily-revealed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="daily-reveal-text">{todayCard.reveal}</p>
                  <div className="daily-actions">
                    {hasArticle && (
                      <a
                        href={`/stories/${todayCard.linkedStory}`}
                        className="daily-btn daily-btn--primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          track('read_full_story', { card_ship: todayCard.ship });
                        }}
                      >
                        Read full story
                      </a>
                    )}
                    <button className="daily-btn daily-btn--share" onClick={(e) => { e.stopPropagation(); handleShare(); }}>
                      {copied ? 'Copied!' : 'Share'}
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      {/* Stats bar */}
      {revealed && (
        <motion.div
          className="daily-stats"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span>{totalSeen} {totalSeen === 1 ? 'story' : 'stories'} learned</span>
          <span>Come back tomorrow for the next one</span>
        </motion.div>
      )}

      {/* Archive section */}
      {revealed && (
        <motion.div
          className="daily-archive"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="daily-archive-title">From the archive</h3>
          <div className="daily-archive-grid">
            {archiveCards.map((card) => (
              <div
                key={card.order}
                className="daily-archive-card"
                onClick={() => {
                  if (card.linkedStory !== 'placeholder') {
                    window.location.href = `/stories/${card.linkedStory}`;
                  }
                }}
              >
                <span className="daily-archive-year">{card.year}</span>
                <p className="daily-archive-hook">"{card.hook}"</p>
                <span className="daily-archive-ship">{card.ship}</span>
              </div>
            ))}
          </div>
          <a href="/stories" className="daily-browse-all">Browse all stories &rarr;</a>
        </motion.div>
      )}
    </div>
  );
}
