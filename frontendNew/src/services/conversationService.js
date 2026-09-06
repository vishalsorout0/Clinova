import { api, isMockMode, mockDelay } from './api';
import { generateId } from '../utils/helpers';

// A small adaptive question bank used only in mock mode. In production this
// entire flow is driven by the FastAPI backend — the frontend never assumes
// a fixed script of questions.
const MOCK_QUESTION_FLOW = [
  { question: 'How are you feeling today? Please describe what is bothering you.', type: 'voice' },
  { question: 'When did this first start?', type: 'text' },
  { question: 'On a scale of 1 to 10, how severe is it right now?', type: 'scale' },
  { question: 'Where exactly are you experiencing this?', type: 'voice' },
  { question: 'Have you noticed anything that makes it better or worse?', type: 'text' },
  { question: 'Are you currently taking any medication for this?', type: 'text' },
  { question: 'Do you have any known allergies we should know about?', type: 'text' },
];

const RED_FLAG_KEYWORDS = ['chest pain', 'can\'t breathe', 'cannot breathe', 'severe bleeding', 'unconscious'];

function buildMockStructuredHistory(answers) {
  return {
    chiefComplaint: answers[0]?.answer || 'Not specified',
    duration: answers[1]?.answer || 'Not specified',
    severity: Number.parseInt(answers[2]?.answer, 10) || 5,
    location: answers[3]?.answer || 'Not specified',
    aggravatingRelievingFactors: answers[4]?.answer || 'Not specified',
    associatedSymptoms: ['Mild fatigue', 'Occasional breathlessness'],
    currentMedications: answers[5]?.answer || 'None reported',
    allergies: answers[6]?.answer || 'None reported',
    pastMedicalHistory: ['Type 2 diabetes (2019)', 'Seasonal allergic rhinitis'],
  };
}

export async function startConversation(patientId = 'pat_001') {
  if (isMockMode) {
    await mockDelay(500);
    return {
      conversationId: generateId('conv'),
      question: MOCK_QUESTION_FLOW[0].question,
      type: MOCK_QUESTION_FLOW[0].type,
      progress: Math.round((1 / MOCK_QUESTION_FLOW.length) * 100),
      totalQuestions: MOCK_QUESTION_FLOW.length,
      currentIndex: 0,
    };
  }
  const { data } = await api.post('/conversation/start', { patientId });
  return data;
}

/**
 * Sends the patient's answer and returns either the next adaptive question,
 * a red-flag alert, or completion with a structured clinical history.
 */
export async function sendAnswer({ conversationId, currentIndex, answers, answerText }) {
  if (isMockMode) {
    await mockDelay(650);

    const lowered = (answerText || '').toLowerCase();
    if (RED_FLAG_KEYWORDS.some((keyword) => lowered.includes(keyword))) {
      return {
        redFlag: true,
        message: 'Priority medical attention required',
      };
    }

    const nextIndex = currentIndex + 1;
    const updatedAnswers = [...answers, { question: MOCK_QUESTION_FLOW[currentIndex]?.question, answer: answerText }];

    if (nextIndex >= MOCK_QUESTION_FLOW.length) {
      return {
        done: true,
        conversationId,
        structuredHistory: buildMockStructuredHistory(updatedAnswers),
      };
    }

    return {
      done: false,
      redFlag: false,
      question: MOCK_QUESTION_FLOW[nextIndex].question,
      type: MOCK_QUESTION_FLOW[nextIndex].type,
      progress: Math.round(((nextIndex + 1) / MOCK_QUESTION_FLOW.length) * 100),
      totalQuestions: MOCK_QUESTION_FLOW.length,
      currentIndex: nextIndex,
      answers: updatedAnswers,
    };
  }

  const { data } = await api.post('/conversation/answer', { conversationId, currentIndex, answerText });
  return data;
}

export async function getStructuredHistory(conversationId) {
  if (isMockMode) {
    await mockDelay(400);
    return buildMockStructuredHistory([]);
  }
  const { data } = await api.get(`/conversation/${conversationId}/history`);
  return data;
}
