import { useState, useCallback, useEffect } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { ArrowRight, ArrowLeft, Landmark, CheckCircle, Link2, AlertCircle, AlertTriangle } from 'lucide-react';

export default function PlaidLinkStep({ data, onNext, onBack }) {
    const [bankData, setBankData] = useState(data || {
        connected: false,
        institutionName: '',
        accountMask: '',
        accountType: '',
    });
    const [linkToken, setLinkToken] = useState('');
    const [apiError, setApiError] = useState(false);

    // Use environment variable if deployed, otherwise fallback to local server
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

    // Call the backend to generate the link_token when step loads
    useEffect(() => {
        const createToken = async () => {
            try {
                // Point this to the dynamic API server
                const res = await fetch(`${API_BASE_URL}/api/create_link_token`, {
                    method: 'POST',
                });
                
                if (!res.ok) throw new Error('Failed to fetch link token. Is the API server running?');
                
                const { link_token } = await res.json();
                setLinkToken(link_token);
                setApiError(false);
            } catch (err) {
                console.warn('Plaid Server offline or missing token:', err);
                setApiError(true);
            }
        };

        if (!data?.connected) {
            createToken();
        }
    }, [data?.connected]);

    const onSuccess = useCallback(async (public_token, metadata) => {
        // Here you would normally quickly POST public_token to your backend exchange endpoint
        // For our UI flow, we immediately pull the institution name from the Plaid metadata payload.
        
        try {
            await fetch(`${API_BASE_URL}/api/exchange_public_token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ public_token }),
            });
        } catch (err) {
            console.error('Error exchanging public token. Server may be down, but continuing UI flow.', err);
        }

        setBankData({
            connected: true,
            institutionName: metadata.institution?.name || 'Linked Institution',
            accountMask: metadata.accounts?.[0]?.mask || 'XXXX',
            accountType: metadata.accounts?.[0]?.subtype || 'Checking',
            skipped: false,
        });
    }, []);

    const config = {
        token: linkToken,
        onSuccess,
        // onEvent: (eventName, metadata) => console.log(eventName, metadata),
        // onExit: (err, metadata) => console.log(err, metadata),
    };

    const { open, ready } = usePlaidLink(config);

    const handleDisconnect = useCallback(() => {
        setBankData({
            connected: false,
            institutionName: '',
            accountMask: '',
            accountType: '',
        });
    }, []);

    const handleNext = () => onNext(bankData);
    
    const handleSkip = () => onNext({
        connected: false,
        institutionName: '',
        accountMask: '',
        accountType: '',
        skipped: true,
    });

    return (
        <div className="step-content" key="step-plaid">
            <h2 className="step-title">Link Your Business Bank</h2>
            <p className="step-subtitle">
                Securely connect your bank account for instant cash flow verification
            </p>

            {/* Info Section */}
            <div className="plaid-info-section">
                <div className="plaid-info-card">
                    <Landmark size={20} />
                    <div>
                        <strong>Why connect your bank?</strong>
                        <p>
                            Lenders like OnDeck, Kabbage, Bluevine, and Lendio use bank data to
                            verify cash flow, accelerate approval, and reduce paperwork. Powered
                            by <strong>Plaid</strong> — trusted by 10,000+ financial institutions.
                        </p>
                    </div>
                </div>
            </div>

            {/* Connection Status */}
            {!bankData.connected ? (
                <div className="plaid-connect-area">
                    <div className="plaid-connect-visual">
                        <div className="plaid-logo-ring" style={{ border: apiError ? '2px dashed var(--danger-color)' : '' }}>
                            {apiError ? <AlertTriangle size={32} color="var(--danger-color)" /> : <Link2 size={40} />}
                        </div>
                    </div>

                    <button
                        type="button"
                        className="btn btn-plaid"
                        onClick={() => open()}
                        disabled={!ready || apiError}
                        id="plaid-connect-btn"
                        style={{ opacity: (!ready || apiError) ? 0.6 : 1 }}
                    >
                        {apiError ? (
                            'Backend Offline'
                        ) : !ready ? (
                            <>
                                <span className="plaid-spinner" /> Initialize Plaid…
                            </>
                        ) : (
                            <>
                                <Landmark size={18} /> Connect with Plaid
                            </>
                        )}
                    </button>
                    
                    {apiError && (
                        <p className="form-error" style={{ textAlign: 'center', marginTop: '10px' }}>
                            Start the Server: Please update the .env file with your Plaid keys and run `node index.js` in the `los-api` folder to test the link configuration.
                        </p>
                    )}

                    <p className="plaid-security-note">
                        🔒 Your credentials are never shared with us. Bank-level 256-bit encryption.
                    </p>
                </div>
            ) : (
                <div className="plaid-connected-card">
                    <div className="plaid-connected-header">
                        <CheckCircle size={24} className="plaid-check-icon" />
                        <span>Bank Account Connected</span>
                    </div>
                    <div className="plaid-connected-details">
                        <div className="plaid-detail-row">
                            <span className="plaid-detail-label">Institution</span>
                            <span className="plaid-detail-value" style={{ fontWeight: 'bold' }}>{bankData.institutionName}</span>
                        </div>
                        <div className="plaid-detail-row">
                            <span className="plaid-detail-label">Account</span>
                            <span className="plaid-detail-value">
                                {bankData.accountType.charAt(0).toUpperCase() + bankData.accountType.slice(1)} ••••{bankData.accountMask}
                            </span>
                        </div>
                    </div>
                    <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={handleDisconnect}
                    >
                        Disconnect &amp; reconnect
                    </button>
                </div>
            )}

            <div className="btn-group">
                <button type="button" className="btn btn-secondary" onClick={onBack}>
                    <ArrowLeft size={16} /> Back
                </button>
                <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                    {!bankData.connected && (
                        <button type="button" className="btn btn-ghost" onClick={handleSkip}>
                            <AlertCircle size={14} /> Skip for now
                        </button>
                    )}
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleNext}
                        disabled={!bankData.connected && !bankData.skipped}
                    >
                        Next <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
