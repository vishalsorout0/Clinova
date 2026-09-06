import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { fadeInUp } from '../../utils/helpers';

export default function AIMessage({ text, isTyping = false }) {
  return (
    <motion.div {...fadeInUp} className="flex items-start gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-600 text-white">
        <Sparkles className="h-4 w-4" aria-hidden="true" />
      </span>
      <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-white border border-ink-100 px-4 py-3 shadow-card">
        {isTyping ? (
          <span className="flex items-center gap-1.5 py-1" aria-label="AI is typing">
            <span className="h-2 w-2 animate-pulseSoft rounded-full bg-teal-400" style={{ animationDelay: '0ms' }} />
            <span className="h-2 w-2 animate-pulseSoft rounded-full bg-teal-400" style={{ animationDelay: '150ms' }} />
            <span className="h-2 w-2 animate-pulseSoft rounded-full bg-teal-400" style={{ animationDelay: '300ms' }} />
          </span>
        ) : (
          <p className="text-base text-ink-700">{text}</p>
        )}
      </div>
    </motion.div>
  );
}
