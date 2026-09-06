import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { AuthProvider } from './context/AuthContext';
import { PatientProvider } from './context/PatientContext';
import { ConversationProvider } from './context/ConversationContext';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <LanguageProvider>
      <AccessibilityProvider>
        <AuthProvider>
          <PatientProvider>
            <ConversationProvider>
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
            </ConversationProvider>
          </PatientProvider>
        </AuthProvider>
      </AccessibilityProvider>
    </LanguageProvider>
  );
}
