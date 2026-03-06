import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { parseNumber, maskCurrencyInput } from '../../utils/formatters';

/* ── Business Loan Constants ──────────────────────────── */
const BUSINESS_PURPOSES = [
    'Working Capital',
    'Equipment Purchase',
    'Business Expansion',
    'Inventory',
    'Commercial Real Estate',
    'Refinancing',
    'SBA Loan',
    'Line of Credit',
    'Other',
];

const BUSINESS_TERMS = [6, 12, 24, 36, 48, 60, 84, 120];

const COLLATERAL_TYPES = [
    'Real Estate',
    'Equipment',
    'Inventory',
    'Accounts Receivable',
    'None / Unsecured',
];

/* ── Schemas ──────────────────────────────────────────── */
const businessSchema = z.object({
    loanPurpose: z.string().min(1, 'Select a purpose'),
    loanAmount: z.preprocess(
        (val) => parseNumber(val),
        z.number({ invalid_type_error: 'Enter a valid amount' })
            .min(5000, 'Minimum $5,000')
            .max(5000000, 'Maximum $5,000,000')
    ),
    loanTerm: z
        .number({ invalid_type_error: 'Select a term' })
        .refine((v) => BUSINESS_TERMS.includes(v), 'Select a valid term'),
    collateralType: z.string().min(1, 'Select collateral type'),
});

/* ── Main Component ───────────────────────────────────── */
export default function LoanDetailsStep({ data, onNext, onBack }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(businessSchema),
        defaultValues: data,
        mode: 'onTouched',
    });

    return (
        <div className="step-content" key="step-loan">
            <h2 className="step-title">Business Loan Details</h2>
            <p className="step-subtitle">Specify the financing you need for your business</p>

            <form onSubmit={handleSubmit(onNext)} noValidate>
                <div className="form-grid">
                    {/* Loan Purpose */}
                    <div className="form-group">
                        <label className="form-label">Loan Purpose <span className="required">*</span></label>
                        <select
                            className={`form-select ${errors.loanPurpose ? 'error' : ''}`}
                            {...register('loanPurpose')}
                        >
                            <option value="">Select purpose</option>
                            {BUSINESS_PURPOSES.map((p) => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>
                        <span className="form-error">{errors.loanPurpose?.message}</span>
                    </div>

                    {/* Collateral Type */}
                    <div className="form-group">
                        <label className="form-label">Collateral Type <span className="required">*</span></label>
                        <select
                            className={`form-select ${errors.collateralType ? 'error' : ''}`}
                            {...register('collateralType')}
                        >
                            <option value="">Select collateral</option>
                            {COLLATERAL_TYPES.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                        <span className="form-error">{errors.collateralType?.message}</span>
                    </div>

                    {/* Loan Amount */}
                    <div className="form-group">
                        <label className="form-label">
                            Requested Amount ($) <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            className={`form-input ${errors.loanAmount ? 'error' : ''}`}
                            placeholder="250,000"
                            {...register('loanAmount', { 
                                onChange: (e) => (e.target.value = maskCurrencyInput(e.target.value)) 
                            })}
                        />
                        <span className="form-error">{errors.loanAmount?.message}</span>
                    </div>

                    {/* Loan Term */}
                    <div className="form-group">
                        <label className="form-label">Preferred Term <span className="required">*</span></label>
                        <select
                            className={`form-select ${errors.loanTerm ? 'error' : ''}`}
                            {...register('loanTerm', { valueAsNumber: true })}
                        >
                            <option value="">Select term</option>
                            {BUSINESS_TERMS.map((t) => (
                                <option key={t} value={t}>{t} months</option>
                            ))}
                        </select>
                        <span className="form-error">{errors.loanTerm?.message}</span>
                    </div>
                </div>

                <div className="btn-group">
                    <button type="button" className="btn btn-secondary" onClick={onBack}>
                        <ArrowLeft size={16} /> Back
                    </button>
                    <button type="submit" className="btn btn-primary">
                        Next <ArrowRight size={16} />
                    </button>
                </div>
            </form>
        </div>
    );
}
