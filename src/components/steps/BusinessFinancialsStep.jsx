import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { parseNumber, maskCurrencyInput } from '../../utils/formatters';

const currencySchema = z.preprocess(
    (val) => parseNumber(val),
    z.number({ invalid_type_error: 'Enter a valid amount' }).min(0, 'Cannot be negative')
);

const schema = z.object({
    annualRevenue: currencySchema,
    monthlyRevenue: currencySchema,
    annualNetProfit: z.preprocess(
        (val) => parseNumber(val),
        z.number({ invalid_type_error: 'Enter a valid amount' })
    ),
    numberOfEmployees: z
        .number({ invalid_type_error: 'Enter a number' })
        .min(0, 'Cannot be negative')
        .int('Must be a whole number'),
    hasOutstandingDebt: z.string().min(1, 'Select an option'),
    outstandingDebtAmount: z.preprocess(
        (val) => parseNumber(val),
        z.number({ invalid_type_error: 'Enter a valid amount' })
            .min(0, 'Cannot be negative')
            .optional()
            .or(z.null())
            .or(z.literal(undefined))
    ),
});


export default function BusinessFinancialsStep({ data, dateEstablished, onNext, onBack }) {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: data,
        mode: 'onTouched',
    });

    const hasDebt = useWatch({ control, name: 'hasOutstandingDebt' });

    return (
        <div className="step-content" key="step-financials">
            <h2 className="step-title">Business Financials</h2>
            <p className="step-subtitle">Financial snapshot of your business</p>

            <form onSubmit={handleSubmit(onNext)} noValidate>
                <div className="form-grid">
                    <div className="form-group">
                        <label className="form-label">Annual Gross Revenue ($) <span className="required">*</span></label>
                        <input
                            type="text"
                            className={`form-input ${errors.annualRevenue ? 'error' : ''}`}
                            placeholder="500,000"
                            {...register('annualRevenue', { 
                                onChange: (e) => (e.target.value = maskCurrencyInput(e.target.value)) 
                            })}
                        />
                        <span className="form-error">{errors.annualRevenue?.message}</span>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Monthly Revenue ($) <span className="required">*</span></label>
                        <input
                            type="text"
                            className={`form-input ${errors.monthlyRevenue ? 'error' : ''}`}
                            placeholder="42,000"
                            {...register('monthlyRevenue', { 
                                onChange: (e) => (e.target.value = maskCurrencyInput(e.target.value)) 
                            })}
                        />
                        <span className="form-error">{errors.monthlyRevenue?.message}</span>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Annual Net Profit ($) <span className="required">*</span></label>
                        <input
                            type="text"
                            className={`form-input ${errors.annualNetProfit ? 'error' : ''}`}
                            placeholder="75,000"
                            {...register('annualNetProfit', { 
                                onChange: (e) => (e.target.value = maskCurrencyInput(e.target.value)) 
                            })}
                        />
                        <span className="form-error">{errors.annualNetProfit?.message}</span>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Number of Employees <span className="required">*</span></label>
                        <input
                            type="number"
                            className={`form-input ${errors.numberOfEmployees ? 'error' : ''}`}
                            placeholder="12"
                            {...register('numberOfEmployees', { valueAsNumber: true })}
                        />
                        <span className="form-error">{errors.numberOfEmployees?.message}</span>
                    </div>

                    <div className="form-group full-width">
                        <label className="form-label">Outstanding Debt Obligations? <span className="required">*</span></label>
                        <div className="toggle-group">
                            <label className={`toggle-option ${hasDebt === 'yes' ? 'active' : ''}`}>
                                <input type="radio" value="yes" {...register('hasOutstandingDebt')} />
                                Yes
                            </label>
                            <label className={`toggle-option ${hasDebt === 'no' ? 'active' : ''}`}>
                                <input type="radio" value="no" {...register('hasOutstandingDebt')} />
                                No
                            </label>
                        </div>
                        <span className="form-error">{errors.hasOutstandingDebt?.message}</span>
                    </div>

                    {hasDebt === 'yes' && (
                        <div className="form-group full-width">
                            <label className="form-label">Total Outstanding Debt ($)</label>
                            <input
                                type="text"
                                className={`form-input ${errors.outstandingDebtAmount ? 'error' : ''}`}
                                placeholder="50,000"
                                {...register('outstandingDebtAmount', { 
                                    onChange: (e) => (e.target.value = maskCurrencyInput(e.target.value)) 
                                })}
                            />
                            <span className="form-error">{errors.outstandingDebtAmount?.message}</span>
                        </div>
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
