import { useState, useCallback } from 'react';
import { ArrowRight, ArrowLeft, Landmark, CheckCircle, Link2, AlertCircle } from 'lucide-react';

// Note: In production, link_token comes from your backend via POST /link/token/create.
// This is a demo component; Plaid Link requires a valid server-generated token to actually open.
// The component architecture is production-ready — just swap the token source.

export default function PlaidLinkStep({ data, onNext, onBack }) {
    const [bankData, setBankData] = useState(data || {
        connected: false,
        institutionName: '',
        accountMask: '',
        accountType: '',
    });
    const [isConnecting, setIsConnecting] = useState(false);

    // Simulate Plaid Link flow for demo purposes
    // In production: use usePlaidLink({ token: linkTokenFromBackend, onSuccess, onExit })
    const handleConnectBank = useCallback(() => {
        setIsConnecting(true);

        // Simulate a Plaid Link interaction (2-second delay)
        setTimeout(() => {
            setBankData({
                connected: true,
                institutionName: 'Chase Business Banking',
                accountMask: '4829',
                accountType: 'Business Checking',
            });
            setIsConnecting(false);
        }, 2000);
    }, []);

    const handleDisconnect = useCallback(() => {
        setBankData({
            connected: false,
            institutionName: '',
            accountMask: '',
            accountType: '',
        });
    }, []);

    const handleNext = () => {
        onNext(bankData);
    };

    const handleSkip = () => {
        onNext({
            connected: false,
            institutionName: '',
            accountMask: '',
            accountType: '',
            skipped: true,
        });
    };

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
                        <div className="plaid-logo-ring">
                            <Link2 size={40} />
                        </div>
                    </div>

                    <button
                        type="button"
                        className="btn btn-plaid"
                        onClick={handleConnectBank}
                        disabled={isConnecting}
                        id="plaid-connect-btn"
                    >
                        {isConnecting ? (
                            <>
                                <span className="plaid-spinner" />
                                Connecting…
                            </>
                        ) : (
                            <>
                                <Landmark size={18} />
                                Connect with Plaid
                            </>
                        )}
                    </button>

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
                            <span className="plaid-detail-value">{bankData.institutionName}</span>
                        </div>
                        <div className="plaid-detail-row">
                            <span className="plaid-detail-label">Account</span>
                            <span className="plaid-detail-value">
                                {bankData.accountType} ••••{bankData.accountMask}
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
