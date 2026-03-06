import { useState, useRef, useEffect } from 'react';
import './PasswordGate.css';

const GATE_PASSWORD = 'Uncia2026';
const STORAGE_KEY = 'app_authenticated';

export default function PasswordGate({ children }) {
  const [authenticated, setAuthenticated] = useState(
    () => sessionStorage.getItem(STORAGE_KEY) === 'true'
  );
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!authenticated && inputRef.current) {
      inputRef.current.focus();
    }
  }, [authenticated]);

  if (authenticated) return children;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === GATE_PASSWORD) {
      setError(false);
      setUnlocking(true);
      setTimeout(() => {
        sessionStorage.setItem(STORAGE_KEY, 'true');
        setAuthenticated(true);
      }, 350);
    } else {
      setError(true);
      setPassword('');
      inputRef.current?.focus();
      setTimeout(() => setError(false), 600);
    }
  };

  return (
    <div className={`password-gate ${unlocking ? 'unlocking' : ''}`}>
      <div className="password-gate-card">
        <div className="password-gate-lock">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <h1 className="password-gate-title">Access Protected</h1>
        <p className="password-gate-subtitle">Enter the password to continue</p>
        <form className="password-gate-form" onSubmit={handleSubmit}>
          <div className="password-gate-input-wrapper">
            <input
              ref={inputRef}
              type="password"
              className={`password-gate-input ${error ? 'error' : ''}`}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="off"
            />
          </div>
          <p className="password-gate-error">{error ? 'Incorrect password' : ''}</p>
          <button type="submit" className="password-gate-btn">
            Unlock
          </button>
        </form>
      </div>
    </div>
  );
}
