import { useCallback, useEffect, useRef, useState } from 'react';

function getSpeechRecognition() {
  if (typeof window === 'undefined') return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

/**
 * Wraps the browser's Web Speech API for speech-to-text and text-to-speech.
 * Falls back gracefully (isSupported: false) when the browser doesn't support it,
 * so callers can always offer a text-input alternative.
 */
export function useSpeech({ language = 'en-IN' } = {}) {
  const RecognitionCtor = getSpeechRecognition();
  const isRecognitionSupported = Boolean(RecognitionCtor);
  const isSynthesisSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [seconds, setSeconds] = useState(0);
  const [speechError, setSpeechError] = useState(null);
  const timerRef = useRef(null);

  useEffect(
    () => () => {
      recognitionRef.current?.stop?.();
      clearInterval(timerRef.current);
      if (isSynthesisSupported) window.speechSynthesis.cancel();
    },
    [isSynthesisSupported]
  );

  const startListening = useCallback(() => {
    if (!isRecognitionSupported) {
      setSpeechError('Voice input is not supported on this browser.');
      return;
    }
    setSpeechError(null);
    setTranscript('');
    setSeconds(0);

    const recognition = new RecognitionCtor();
    recognition.lang = language;
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      const text = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(' ');
      setTranscript(text);
    };
    recognition.onerror = (event) => {
      setSpeechError(event.error || 'Something went wrong with voice input.');
      setIsListening(false);
    };
    recognition.onend = () => {
      setIsListening(false);
      clearInterval(timerRef.current);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
    timerRef.current = setInterval(() => setSeconds((prev) => prev + 1), 1000);
  }, [RecognitionCtor, isRecognitionSupported, language]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop?.();
    clearInterval(timerRef.current);
    setIsListening(false);
  }, []);

  const speak = useCallback(
    (text) => {
      if (!isSynthesisSupported || !text) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = 0.98;
      window.speechSynthesis.speak(utterance);
    },
    [isSynthesisSupported, language]
  );

  const cancelSpeaking = useCallback(() => {
    if (isSynthesisSupported) window.speechSynthesis.cancel();
  }, [isSynthesisSupported]);

  return {
    isRecognitionSupported,
    isSynthesisSupported,
    isListening,
    transcript,
    seconds,
    speechError,
    startListening,
    stopListening,
    speak,
    cancelSpeaking,
    resetTranscript: () => setTranscript(''),
  };
}
