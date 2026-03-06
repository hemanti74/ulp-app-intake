import { useState } from 'react';
import Stepper from './Stepper';
import BusinessDetailsStep from './steps/BusinessDetailsStep';
import OwnerDetailsStep from './steps/OwnerDetailsStep';
import BusinessFinancialsStep from './steps/BusinessFinancialsStep';
import PlaidLinkStep from './steps/PlaidLinkStep';
import LoanDetailsStep from './steps/LoanDetailsStep';
import DocumentUploadStep from './steps/DocumentUploadStep';
import Summary from './Summary';

/* ── Initial State Objects (pre-filled for prototyping) ── */
const INITIAL_LOAN_BUSINESS = {
    loanPurpose: 'Working Capital', loanAmount: '250,000', loanTerm: 60, collateralType: 'Equipment',
};

const INITIAL_BUSINESS = {
    legalName: 'Acme Solutions LLC', dba: 'Acme Co', ein: '12-3456789', entityType: 'LLC',
    stateOfIncorporation: 'CA', dateEstablished: '2019-03-10', industry: 'Technology',
    businessPhone: '(555) 987-6543', businessAddress: '456 Commerce Drive', businessSuite: 'Suite 200',
    businessCity: 'San Francisco', businessState: 'CA', businessZip: '94105',
};

const INITIAL_OWNER = {
    ownerFirstName: 'Jane', ownerLastName: 'Smith', ownerTitle: 'CEO',
    ownershipPercent: 75, ownerSSN: '123-45-6789', ownerDOB: '1985-08-22',
    ownerEmail: 'jane@acmesolutions.com', ownerPhone: '(555) 987-1234', ownerAddress: '789 Residential Blvd',
    ownerCity: 'San Francisco', ownerState: 'CA', ownerZip: '94102',
    personalGuarantee: true,
};

const INITIAL_FINANCIALS = {
    annualRevenue: '1,200,000', monthlyRevenue: '100,000', annualNetProfit: '180,000',
    numberOfEmployees: 15, hasOutstandingDebt: 'yes', outstandingDebtAmount: '75,000',
};

const INITIAL_PLAID = {
    connected: false, institutionName: '', accountMask: '', accountType: '',
};

/* ── Step Definitions ──────────────────────────────── */
const BUSINESS_STEPS = [
    { label: 'Business Info' },
    { label: 'Owner' },
    { label: 'Financials' },
    { label: 'Link Bank' },
    { label: 'Loan Details' },
    { label: 'Documents' },
];

/* ── Main Component ────────────────────────────────── */
export default function IntakeWizard() {
    const [step, setStep] = useState(0);
    const [submitted, setSubmitted] = useState(false);

    // Business loan state
    const [businessData, setBusinessData] = useState(INITIAL_BUSINESS);
    const [ownerData, setOwnerData] = useState(INITIAL_OWNER);
    const [financialsData, setFinancialsData] = useState(INITIAL_FINANCIALS);
    const [plaidData, setPlaidData] = useState(INITIAL_PLAID);
    const [loanDataBusiness, setLoanDataBusiness] = useState(INITIAL_LOAN_BUSINESS);
    const [docDataBusiness, setDocDataBusiness] = useState({});

    /* ── Business Loan Handlers ──────────────────────── */
    const handleBusinessNext = (data) => { setBusinessData(data); setStep(1); };
    const handleOwnerNext = (data) => { setOwnerData(data); setStep(2); };
    const handleFinancialsNext = (data) => { setFinancialsData(data); setStep(3); };
    const handlePlaidNext = (data) => { setPlaidData(data); setStep(4); };
    const handleBusinessLoanNext = (data) => { setLoanDataBusiness(data); setStep(5); };
    const handleBusinessDocSubmit = (data) => {
        setDocDataBusiness(data);
        console.log('📋 Business Loan Submitted:', {
            business: businessData, owner: ownerData, financials: financialsData,
            plaid: plaidData, loan: loanDataBusiness,
            documents: Object.fromEntries(Object.entries(data).map(([k, v]) => [k, v?.name])),
        });
        setSubmitted(true);
    };

    /* ── Render ───────────────────────────────────────── */
    // Summary screen
    if (submitted) {
        const summaryData = {
            business: businessData, owner: ownerData, financials: financialsData,
            plaid: plaidData, loan: loanDataBusiness, documents: docDataBusiness,
        };

        return (
            <div className="wizard-container glass-card wizard-wide">
                <Summary data={summaryData} />
            </div>
        );
    }

    return (
        <div className="wizard-container glass-card wizard-wide">
            <div className="wizard-header" style={{ textAlign: 'center' }}>
                <img src="/uncia-logo.svg" alt="Uncia Logo" style={{ maxWidth: '250px', marginBottom: '1.5rem', display: 'inline-block' }} />
                <h1>Business Loan Application</h1>
                <p>Complete the steps below to submit your application</p>
            </div>

            <Stepper steps={BUSINESS_STEPS} currentStep={step} />

            {/* ── Business Flow ─────────────────────────── */}
            {step === 0 && (
                <BusinessDetailsStep data={businessData} onNext={handleBusinessNext} />
            )}
            {step === 1 && (
                <OwnerDetailsStep data={ownerData} onNext={handleOwnerNext} onBack={() => setStep(0)} />
            )}
            {step === 2 && (
                <BusinessFinancialsStep
                    data={financialsData}
                    dateEstablished={businessData.dateEstablished}
                    onNext={handleFinancialsNext}
                    onBack={() => setStep(1)}
                />
            )}
            {step === 3 && (
                <PlaidLinkStep data={plaidData} onNext={handlePlaidNext} onBack={() => setStep(2)} />
            )}
            {step === 4 && (
                <LoanDetailsStep data={loanDataBusiness} onNext={handleBusinessLoanNext} onBack={() => setStep(3)} />
            )}
            {step === 5 && (
                <DocumentUploadStep data={docDataBusiness} onSubmit={handleBusinessDocSubmit} onBack={() => setStep(4)} />
            )}
        </div>
    );
}
