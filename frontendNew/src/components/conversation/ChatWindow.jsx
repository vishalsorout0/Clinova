import { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import AIMessage from './AIMessage';
import PatientMessage from './PatientMessage';
import VoiceInput from './VoiceInput';
import TouchInput from './TouchInput';
import ConversationControls from './ConversationControls';
import ConversationProgress from './ConversationProgress';
import { useConversation } from '../../hooks/useConversation';
import { useLanguage } from '../../hooks/useLanguage';

export default function ChatWindow({ patientId, onRedFlag, onComplete }) {
  const { t } = useLanguage();
  const {
    messages,
    currentQuestion,
    currentType,
    progress,
    totalQuestions,
    currentIndex,
    isLoading,
    isRedFlag,
    isDone,
    structuredHistory,
    begin,
    respond,
  } = useConversation();

  const [mode, setMode] = useState('voice');
  const scrollRef = useRef(null);

  useEffect(() => {
    begin(patientId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (currentType === 'text' || currentType === 'scale') setMode('text');
    if (currentType === 'voice') setMode('voice');
  }, [currentType]);

  useEffect(() => {
    if (isRedFlag) onRedFlag?.();
  }, [isRedFlag, onRedFlag]);

  useEffect(() => {
    if (isDone && structuredHistory) onComplete?.(structuredHistory);
  }, [isDone, structuredHistory, onComplete]);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-ink-100 bg-ink-50/60 p-5 shadow-card">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-600 text-white">
          <Sparkles className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="font-heading font-semibold text-ink-800">{t('conversation.assistantName')}</p>
          <p className="text-xs text-ink-500">{t('conversation.aiDisclaimer')}</p>
        </div>
      </div>

      <ConversationProgress progress={progress} currentIndex={currentIndex} totalQuestions={totalQuestions} />

      <div ref={scrollRef} className="flex-1 min-h-[320px] max-h-[420px] overflow-y-auto py-3 flex flex-col gap-4">
        <AnimatePresence initial={false}>
          {messages.map((message) =>
            message.sender === 'ai' ? (
              <AIMessage key={message.id} text={message.text} />
            ) : (
              <PatientMessage key={message.id} text={message.text} />
            )
          )}
          {isLoading && <AIMessage key="typing" isTyping />}
        </AnimatePresence>
      </div>

      {!isDone && !isRedFlag && (
        <div className="mt-3 flex flex-col gap-4">
          {mode === 'voice' ? (
            <VoiceInput onResult={(text) => respond(text)} disabled={isLoading} />
          ) : (
            <TouchInput onSubmit={(text) => respond(text)} disabled={isLoading} />
          )}
          <ConversationControls mode={mode} onModeChange={setMode} questionText={currentQuestion} />
        </div>
      )}
    </div>
  );
}
