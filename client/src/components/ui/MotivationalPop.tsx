import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const quotes = [
  { text: 'Ship it. Perfect is the enemy of done.', author: 'Voltaire (adapted)' },
  { text: 'الكود الشغال أحسن من الكود المثالي اللي في دماغك بس.', author: 'DevOS' },
  { text: 'Every expert was once a beginner who didn\'t quit.', author: 'Unknown' },
  { text: 'اليوم ده فرصة إنك تبني حاجة تفخر بيها.', author: 'DevOS' },
  { text: 'One commit a day keeps the regrets away.', author: 'DevOS' },
  { text: 'الفرق بين المبتدئ والمحترف هو عدد المرات اللي استمر فيها.', author: 'DevOS' },
  { text: 'Build in public. Learn out loud.', author: 'DevOS' },
  { text: 'اشتغل على مشروعك زي ما حد بيتفرج عليك.', author: 'DevOS' },
  { text: 'Done is better than perfect.', author: 'Mark Zuckerberg' },
  { text: 'كل سطر كود بتكتبه هو استثمار في نفسك.', author: 'DevOS' },
  { text: 'The best time to start was yesterday. The next best time is now.', author: 'Unknown' },
  { text: 'debug مش فشل، ده جزء من العملية.', author: 'DevOS' },
  { text: 'Stay consistent. The results will surprise you.', author: 'DevOS' },
  { text: 'إنت مش بتبني features، إنت بتبني مستقبلك.', author: 'DevOS' },
  { text: 'Great software is built by people who care.', author: 'DevOS' },
  { text: 'خد break، رجع، وهتشوف المشكلة اتحلت لوحدها.', author: 'DevOS' },
  { text: 'Your GitHub is your resume. Make it count.', author: 'DevOS' },
  { text: 'كل مشروع بيعلمك حاجة المشروع اللي قبله ماعلهاكش.', author: 'DevOS' },
  { text: 'Focus on progress, not perfection.', author: 'DevOS' },
  { text: 'النوم مهم. الكود هيفضل موجود.', author: 'DevOS' },
  { text: 'The only bad commit is the one you didn\'t make.', author: 'DevOS' },
  { text: 'مفيش حاجة اسمها fail، فيه حاجة اسمها first attempt in learning.', author: 'DevOS' },
];

export default function MotivationalPop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const today = new Date().toDateString();
    const shown = localStorage.getItem('devos-quote-date');
    if (shown === today) return;

    const timer = setTimeout(() => {
      setVisible(true);
      localStorage.setItem('devos-quote-date', today);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => setVisible(false), 6000);
    return () => clearTimeout(timer);
  }, [visible]);

  const quote = quotes[new Date().getDate() % quotes.length];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: -20, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -20, y: 20 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          onClick={() => setVisible(false)}
          style={{
            position: 'fixed',
            bottom: 24,
            left: 24,
            zIndex: 2001,
            maxWidth: 280,
            background: 'var(--surface)',
            border: '1.5px solid var(--accent-subtle)',
            borderLeft: '3px solid var(--accent)',
            borderRadius: 'var(--radius)',
            boxShadow: 'var(--shadow-md)',
            padding: '14px 16px',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setVisible(false); }}
            style={{
              position: 'absolute',
              top: 6,
              right: 6,
              background: 'none',
              border: 'none',
              color: 'var(--text-2)',
              cursor: 'pointer',
              padding: 2,
              display: 'flex',
              minHeight: 'auto',
              lineHeight: 1,
            }}
          >
            <X size={12} />
          </button>
          <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6, marginBottom: 8, paddingRight: 16 }}>
            {quote.text}
          </p>
          <p style={{ fontSize: 11, color: 'var(--text-2)', fontFamily: 'var(--font-mono)' }}>
            — {quote.author}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
