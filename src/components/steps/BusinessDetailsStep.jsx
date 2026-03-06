import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { maskPhoneInput, maskEINInput } from '../../utils/formatters';

const US_STATES = [
    'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
    'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
    'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
    'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
    'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC',
];

const ENTITY_TYPES = [
    'Sole Proprietorship',
    'Partnership',
    'LLC',
    'Corporation',
    'S-Corporation',
    'Non-Profit',
];

const INDUSTRIES = [
    'Retail Trade',
    'Professional Services',
    'Healthcare',
    'Construction',
    'Manufacturing',
    'Food & Accommodation',
    'Transportation',
    'Technology',
    'Real Estate',
    'Agriculture',
    'Wholesale Trade',
    'Finance & Insurance',
    'Other',
];

const schema = z.object({
    legalName: z.string().min(2, 'At least 2 characters'),
    dba: z.string().optional(),
    ein: z.string().regex(/^\d{2}-\d{7}$/, 'Format: XX-XXXXXXX'),
    entityType: z.string().min(1, 'Select entity type'),
    stateOfIncorporation: z.string().min(1, 'Select state'),
    dateEstablished: z.string().min(1, 'Required'),
    industry: z.string().min(1, 'Select industry'),
    businessPhone: z.string().min(1, 'Required').refine((val) => val.replace(/\D/g, '').length === 10, 'Enter a 10-digit phone number'),
    businessAddress: z.string().min(1, 'Required'),
    businessSuite: z.string().optional(),
    businessCity: z.string().min(1, 'Required'),
    businessState: z.string().min(1, 'Select a state'),
    businessZip: z.string().regex(/^\d{5}$/, 'Enter a 5-digit ZIP code'),
});

export default function BusinessDetailsStep({ data, onNext, onBack }) {
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
        <div className="step-content" key="step-business-details">
            <h2 className="step-title">Business Details</h2>
            <p className="step-subtitle">Tell us about your business</p>

            <form onSubmit={handleSubmit(onNext)} noValidate>
                <div className="form-grid">
                    {/* Legal Name */}
                    <div className="form-group">
                        <label className="form-label">Legal Business Name <span className="required">*</span></label>
                        <input
                            className={`form-input ${errors.legalName ? 'error' : ''}`}
                            placeholder="Acme Corporation"
                            {...register('legalName')}
                        />
                        <span className="form-error">{errors.legalName?.message}</span>
                    </div>

                    {/* DBA */}
                    <div className="form-group">
                        <label className="form-label">DBA / Trade Name</label>
                        <input
                            className="form-input"
                            placeholder="Acme Co. (optional)"
                            {...register('dba')}
                        />
                    </div>

                    {/* EIN */}
                    <div className="form-group">
                        <label className="form-label">EIN <span className="required">*</span></label>
                        <input
                            className={`form-input ${errors.ein ? 'error' : ''}`}
                            placeholder="12-3456789"
                            {...register('ein', { onChange: maskEINInput })}
                        />
                        <span className="form-error">{errors.ein?.message}</span>
                    </div>

                    {/* Entity Type */}
                    <div className="form-group">
                        <label className="form-label">Entity Type <span className="required">*</span></label>
                        <select
                            className={`form-select ${errors.entityType ? 'error' : ''}`}
                            {...register('entityType')}
                        >
                            <option value="">Select type</option>
                            {ENTITY_TYPES.map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                        <span className="form-error">{errors.entityType?.message}</span>
                    </div>

                    {/* State of Incorporation */}
                    <div className="form-group">
                        <label className="form-label">State of Incorporation <span className="required">*</span></label>
                        <select
                            className={`form-select ${errors.stateOfIncorporation ? 'error' : ''}`}
                            {...register('stateOfIncorporation')}
                        >
                            <option value="">Select state</option>
                            {US_STATES.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                        <span className="form-error">{errors.stateOfIncorporation?.message}</span>
                    </div>

                    {/* Date Established */}
                    <div className="form-group">
                        <label className="form-label">Date Established <span className="required">*</span></label>
                        <input
                            type="date"
                            className={`form-input ${errors.dateEstablished ? 'error' : ''}`}
                            {...register('dateEstablished')}
                        />
                        <span className="form-error">{errors.dateEstablished?.message}</span>
                    </div>

                    {/* Industry */}
                    <div className="form-group full-width">
                        <label className="form-label">Industry <span className="required">*</span></label>
                        <select
                            className={`form-select ${errors.industry ? 'error' : ''}`}
                            {...register('industry')}
                        >
                            <option value="">Select industry</option>
                            {INDUSTRIES.map((i) => (
                                <option key={i} value={i}>{i}</option>
                            ))}
                        </select>
                        <span className="form-error">{errors.industry?.message}</span>
                    </div>

                    {/* Business Phone */}
                    <div className="form-group full-width">
                        <label className="form-label">Business Phone <span className="required">*</span></label>
                        <input
                            type="tel"
                            className={`form-input ${errors.businessPhone ? 'error' : ''}`}
                            placeholder="(555) 123-4567"
                            {...register('businessPhone', { onChange: maskPhoneInput })}
                        />
                        <span className="form-error">{errors.businessPhone?.message}</span>
                    </div>

                    {/* Business Address */}
                    <div className="form-group full-width">
                        <label className="form-label">Business Address <span className="required">*</span></label>
                        <input
                            className={`form-input ${errors.businessAddress ? 'error' : ''}`}
                            placeholder="123 Business Ave"
                            {...register('businessAddress')}
                        />
                        <span className="form-error">{errors.businessAddress?.message}</span>
                    </div>

                    <div className="form-group full-width">
                        <label className="form-label">Suite / Unit</label>
                        <input
                            className="form-input"
                            placeholder="Suite 200 (optional)"
                            {...register('businessSuite')}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">City <span className="required">*</span></label>
                        <input
                            className={`form-input ${errors.businessCity ? 'error' : ''}`}
                            placeholder="San Francisco"
                            {...register('businessCity')}
                        />
                        <span className="form-error">{errors.businessCity?.message}</span>
                    </div>

                    <div className="form-group">
                        <label className="form-label">State <span className="required">*</span></label>
                        <select
                            className={`form-select ${errors.businessState ? 'error' : ''}`}
                            {...register('businessState')}
                        >
                            <option value="">Select state</option>
                            {US_STATES.map((s) => (
                                <option key={`bus-${s}`} value={s}>{s}</option>
                            ))}
                        </select>
                        <span className="form-error">{errors.businessState?.message}</span>
                    </div>

                    <div className="form-group full-width">
                        <label className="form-label">ZIP Code <span className="required">*</span></label>
                        <input
                            className={`form-input ${errors.businessZip ? 'error' : ''}`}
                            placeholder="94105"
                            {...register('businessZip')}
                        />
                        <span className="form-error">{errors.businessZip?.message}</span>
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
