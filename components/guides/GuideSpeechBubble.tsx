'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { GUIDES } from '@/lib/constants';

interface GuideSpeechBubbleProps {
  message: string;
  guideId: string;
  visible: boolean;
}

export default function GuideSpeechBubble({
  message,
  guideId,
  visible,
}: GuideSpeechBubbleProps) {
  const guide = GUIDES.find((g) => g.id === guideId);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.95 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative"
        >
          <div className="bg-gleea-cream rounded-2xl px-4 py-3 shadow-paper max-w-[260px]">
            {guide && (
              <p className="text-[11px] font-bold text-gleea-charcoal/50 mb-1">
                {guide.name}
              </p>
            )}
            <p className="text-sm text-gleea-charcoal leading-relaxed">
              {message}
            </p>
          </div>
          {/* Triangle pointer */}
          <div
            className="absolute -bottom-2 left-5 w-0 h-0
              border-l-[8px] border-l-transparent
              border-r-[8px] border-r-transparent
              border-t-[8px] border-t-gleea-cream"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
