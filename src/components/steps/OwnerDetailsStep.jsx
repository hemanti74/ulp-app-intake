import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react';
import { maskPhoneInput, maskSSNInput } from '../../utils/formatters';

const US_STATES = [
    'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
    'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
    'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
    'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
    'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC',
];

const schema = z.object({
    ownerFirstName: z.string().min(2, 'At least 2 characters'),
    ownerLastName: z.string().min(2, 'At least 2 characters'),
    ownerTitle: z.string().min(1, 'Required'),
    ownershipPercent: z
        .number({ invalid_type_error: 'Enter a number' })
        .min(25, 'Minimum 25% ownership required')
        .max(100, 'Maximum 100%'),
    ownerSSN: z.string().regex(/^\d{3}-\d{2}-\d{4}$/, 'Format: XXX-XX-XXXX'),
    ownerDOB: z.string().min(1, 'Required').refine((val) => {
        const dob = new Date(val);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
        return age >= 18;
    }, 'Must be at least 18 years old'),
    ownerEmail: z.string().email('Enter a valid email'),
    ownerPhone: z.string().min(1, 'Required').refine((val) => val.replace(/\D/g, '').length === 10, 'Enter a 10-digit phone number'),
    ownerAddress: z.string().min(1, 'Required'),
    ownerCity: z.string().min(1, 'Required'),
    ownerState: z.string().min(1, 'Select a state'),
    ownerZip: z.string().regex(/^\d{5}$/, 'Enter a 5-digit ZIP code'),
    personalGuarantee: z.literal(true, {
        errorMap: () => ({ message: 'Personal guarantee is required' }),
    }),
});

export default function OwnerDetailsStep({ data, onNext, onBack }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: data,
        mode: 'onTouched',
    });

    return (
        <div className="step-content" key="step-owner">
            <h2 className="step-title">Owner / Guarantor</h2>
            <p className="step-subtitle">Primary owner with ≥ 25% ownership (required by SBA &amp; most lenders)</p>

            <form onSubmit={handleSubmit(onNext)} noValidate>
                <div className="form-grid">
                    <div className="form-group">
                        <label className="form-label">First Name <span className="required">*</span></label>
                        <input
                            className={`form-input ${errors.ownerFirstName ? 'error' : ''}`}
                            placeholder="Jane"
                            {...register('ownerFirstName')}
                        />
                        <span className="form-error">{errors.ownerFirstName?.message}</span>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Last Name <span className="required">*</span></label>
                        <input
                            className={`form-input ${errors.ownerLastName ? 'error' : ''}`}
                            placeholder="Smith"
                            {...register('ownerLastName')}
                        />
                        <span className="form-error">{errors.ownerLastName?.message}</span>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Title / Role <span className="required">*</span></label>
                        <input
                            className={`form-input ${errors.ownerTitle ? 'error' : ''}`}
                            placeholder="CEO, Managing Member, etc."
                            {...register('ownerTitle')}
                        />
                        <span className="form-error">{errors.ownerTitle?.message}</span>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Ownership % <span className="required">*</span></label>
                        <input
                            type="number"
                            className={`form-input ${errors.ownershipPercent ? 'error' : ''}`}
                            placeholder="51"
                            {...register('ownershipPercent', { valueAsNumber: true })}
                        />
                        <span className="form-error">{errors.ownershipPercent?.message}</span>
                    </div>

                    <div className="form-group">
                        <label className="form-label">SSN <span className="required">*</span></label>
                        <input
                            className={`form-input ${errors.ownerSSN ? 'error' : ''}`}
                            placeholder="XXX-XX-XXXX"
                            {...register('ownerSSN', { onChange: maskSSNInput })}
                        />
                        <span className="form-error">{errors.ownerSSN?.message}</span>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Date of Birth <span className="required">*</span></label>
                        <input
                            type="date"
                            className={`form-input ${errors.ownerDOB ? 'error' : ''}`}
                            {...register('ownerDOB')}
                        />
                        <span className="form-error">{errors.ownerDOB?.message}</span>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email <span className="required">*</span></label>
                        <input
                            type="email"
                            className={`form-input ${errors.ownerEmail ? 'error' : ''}`}
                            placeholder="jane@acme.com"
                            {...register('ownerEmail')}
                        />
                        <span className="form-error">{errors.ownerEmail?.message}</span>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Phone <span className="required">*</span></label>
                        <input
                            type="tel"
                            className={`form-input ${errors.ownerPhone ? 'error' : ''}`}
                            placeholder="(555) 987-6543"
                            {...register('ownerPhone', { onChange: maskPhoneInput })}
                        />
                        <span className="form-error">{errors.ownerPhone?.message}</span>
                    </div>

                    <div className="form-group full-width">
                        <label className="form-label">Home Address <span className="required">*</span></label>
                        <input
                            className={`form-input ${errors.ownerAddress ? 'error' : ''}`}
                            placeholder="456 Residential Blvd"
                            {...register('ownerAddress')}
                        />
                        <span className="form-error">{errors.ownerAddress?.message}</span>
                    </div>

                    <div className="form-grid-3 full-width">
                        <div className="form-group">
                            <label className="form-label">City <span className="required">*</span></label>
                            <input
                                className={`form-input ${errors.ownerCity ? 'error' : ''}`}
                                placeholder="Los Angeles"
                                {...register('ownerCity')}
                            />
                            <span className="form-error">{errors.ownerCity?.message}</span>
                        </div>

                        <div className="form-group">
                            <label className="form-label">State <span className="required">*</span></label>
                            <select
                                className={`form-select ${errors.ownerState ? 'error' : ''}`}
                                {...register('ownerState')}
                            >
                                <option value="">Select state</option>
                                {US_STATES.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                            <span className="form-error">{errors.ownerState?.message}</span>
                        </div>

                        <div className="form-group">
                            <label className="form-label">ZIP Code <span className="required">*</span></label>
                            <input
                                className={`form-input ${errors.ownerZip ? 'error' : ''}`}
                                placeholder="90001"
                                {...register('ownerZip')}
                            />
                            <span className="form-error">{errors.ownerZip?.message}</span>
                        </div>
                    </div>
                </div>

                {/* Personal Guarantee */}
                <div className="consent-box">
                    <ShieldCheck size={20} className="consent-icon" />
                    <label className="consent-label">
                        <input
                            type="checkbox"
                            className="consent-checkbox"
                            {...register('personalGuarantee')}
                        />
                        <span>
                            I agree to terms and conditions
                        </span>
                    </label>
                    {errors.personalGuarantee && (
                        <span className="form-error" style={{ marginTop: '0.5rem' }}>
                            {errors.personalGuarantee.message}
                        </span>
                    )}
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
