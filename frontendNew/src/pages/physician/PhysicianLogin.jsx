import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Stethoscope } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import { useAuth } from '../../hooks/useAuth';
import * as authService from '../../services/authService';
import { ROUTES } from '../../utils/constants';
import { pageTransition } from '../../utils/helpers';

export default function PhysicianLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const session = await authService.loginPhysician({ employeeId, password });
      login(session);
      navigate(ROUTES.PHYSICIAN_DASHBOARD);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div {...pageTransition} className="flex min-h-screen items-center justify-center bg-ink-50 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl border border-ink-100 bg-white p-8 shadow-card">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink-800 text-white">
            <Stethoscope className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            <h1 className="font-heading text-xl font-semibold text-ink-800">Doctor sign in</h1>
            <p className="text-sm text-ink-500">Access your patient queue</p>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <Input label="Employee ID" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} placeholder="e.g. DOC1024" />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          {error && <ErrorMessage message={error} />}
          <Button type="submit" fullWidth isLoading={isLoading}>
            Sign in
          </Button>
          <p className="text-center text-xs text-ink-400">Demo mode: any employee ID and password works.</p>
        </div>
      </form>
    </motion.div>
  );
}
