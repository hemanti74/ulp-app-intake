import { CheckCircle, FileText } from 'lucide-react';
import { formatPhone, formatEIN, formatSSN, formatDate, formatCurrency } from '../utils/formatters';

function SummarySection({ title, rows }) {
    return (
        <div className="summary-section">
            <div className="summary-section-title">{title}</div>
            {rows.map(([label, value], idx) => (
                <div className="summary-row" key={idx}>
                    <span className="summary-row-label">{label}</span>
                    <span className="summary-row-value">{value}</span>
                </div>
            ))}
        </div>
    );
}

function DocumentRows({ documents }) {
    const entries = Object.entries(documents).filter(([, v]) => v?.name);
    if (entries.length === 0) return null;

    return (
        <div className="summary-section">
            <div className="summary-section-title">Documents</div>
            {entries.map(([key, file]) => (
                <div className="summary-row" key={key}>
                    <span className="summary-row-label">{key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</span>
                    <span className="summary-row-value" style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                        <FileText size={14} /> {file.name}
                    </span>
                </div>
            ))}
        </div>
    );
}

export default function Summary({ data }) {
    const { business, owner, financials, plaid, loan, documents } = data;

    return (
        <div className="success-container">
            <div className="success-icon">
                <CheckCircle size={40} />
            </div>
            <h2 className="success-title">Application Submitted!</h2>
            <p className="success-subtitle">
                Thank you. We've received your business loan application and will be in touch shortly.
            </p>

            <SummarySection
                title="Business Details"
                rows={[
                    ['Legal Name', business.legalName],
                    business.dba ? ['DBA', business.dba] : null,
                    ['EIN', formatEIN(business.ein)],
                    ['Entity Type', business.entityType],
                    ['Industry', business.industry],
                    ['State of Incorporation', business.stateOfIncorporation],
                    ['Date Established', formatDate(business.dateEstablished)],
                    ['Business Phone', formatPhone(business.businessPhone)],
                    ['Address', `${business.businessAddress}${business.businessSuite ? `, ${business.businessSuite}` : ''}, ${business.businessCity}, ${business.businessState} ${business.businessZip}`],
                ].filter(Boolean)}
            />

            <SummarySection
                title="Owner / Guarantor"
                rows={[
                    ['Name', `${owner.ownerFirstName} ${owner.ownerLastName}`],
                    ['Title', owner.ownerTitle],
                    ['Ownership', `${owner.ownershipPercent}%`],
                    ['SSN', formatSSN(owner.ownerSSN)],
                    ['DOB', formatDate(owner.ownerDOB)],
                    ['Email', owner.ownerEmail],
                    ['Phone', formatPhone(owner.ownerPhone)],
                    ['Personal Guarantee', owner.personalGuarantee ? '✓ Agreed' : 'Not provided'],
                ]}
            />

            <SummarySection
                title="Business Financials"
                rows={[
                    ['Annual Revenue', formatCurrency(financials.annualRevenue)],
                    ['Monthly Revenue', formatCurrency(financials.monthlyRevenue)],
                    ['Annual Net Profit', formatCurrency(financials.annualNetProfit)],
                    ['Employees', financials.numberOfEmployees],
                    ['Outstanding Debt', financials.hasOutstandingDebt === 'yes'
                        ? formatCurrency(financials.outstandingDebtAmount || 0)
                        : 'None'],
                ]}
            />

            <SummarySection
                title="Bank Connection"
                rows={
                    plaid.connected
                        ? [
                            ['Status', '✓ Connected via Plaid'],
                            ['Institution', plaid.institutionName],
                            ['Account', `${plaid.accountType} ••••${plaid.accountMask}`],
                        ]
                        : [['Status', plaid.skipped ? 'Skipped — pending manual review' : 'Not connected']]
                }
            />

            <SummarySection
                title="Loan Details"
                rows={[
                    ['Purpose', loan.loanPurpose],
                    ['Amount', formatCurrency(loan.loanAmount)],
                    ['Term', `${loan.loanTerm} months`],
                    ['Collateral', loan.collateralType],
                ]}
            />

            <DocumentRows documents={documents} />
        </div>
    );
}
