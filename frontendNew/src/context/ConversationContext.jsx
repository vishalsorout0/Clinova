import { createContext, useCallback, useMemo, useState } from 'react';
import * as conversationService from '../services/conversationService';
import { generateId } from '../utils/helpers';

export const ConversationContext = createContext(null);

export function ConversationProvider({ children }) {
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentType, setCurrentType] = useState('text');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [progress, setProgress] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRedFlag, setIsRedFlag] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [structuredHistory, setStructuredHistory] = useState(null);
  const [error, setError] = useState(null);

  const begin = useCallback(async (patientId) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await conversationService.startConversation(patientId);
      setConversationId(data.conversationId);
      setCurrentQuestion(data.question);
      setCurrentType(data.type);
      setProgress(data.progress);
      setTotalQuestions(data.totalQuestions);
      setCurrentIndex(data.currentIndex);
      setMessages([{ id: generateId('msg'), sender: 'ai', text: data.question }]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const respond = useCallback(
    async (answerText) => {
      setIsLoading(true);
      setError(null);
      setMessages((prev) => [...prev, { id: generateId('msg'), sender: 'patient', text: answerText }]);

      try {
        const data = await conversationService.sendAnswer({
          conversationId,
          currentIndex,
          answers,
          answerText,
        });

        if (data.redFlag) {
          setIsRedFlag(true);
          return data;
        }

        if (data.done) {
          setIsDone(true);
          setStructuredHistory(data.structuredHistory);
          return data;
        }

        setCurrentQuestion(data.question);
        setCurrentType(data.type);
        setProgress(data.progress);
        setTotalQuestions(data.totalQuestions);
        setCurrentIndex(data.currentIndex);
        setAnswers(data.answers);
        setMessages((prev) => [...prev, { id: generateId('msg'), sender: 'ai', text: data.question }]);
        return data;
      } catch (err) {
        setError(err.message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [conversationId, currentIndex, answers]
  );

  const reset = useCallback(() => {
    setConversationId(null);
    setMessages([]);
    setCurrentQuestion(null);
    setCurrentIndex(0);
    setAnswers([]);
    setProgress(0);
    setIsRedFlag(false);
    setIsDone(false);
    setStructuredHistory(null);
    setError(null);
  }, []);

  const value = useMemo(
    () => ({
      conversationId,
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
      error,
      begin,
      respond,
      reset,
    }),
    [
      conversationId,
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
      error,
      begin,
      respond,
      reset,
    ]
  );

  return <ConversationContext.Provider value={value}>{children}</ConversationContext.Provider>;
}
