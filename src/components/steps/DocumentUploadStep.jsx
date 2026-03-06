import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ArrowLeft, Upload, FileText, Image, X, Send } from 'lucide-react';

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ACCEPTED = {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'application/pdf': ['.pdf'],
};

const BUSINESS_DOCUMENTS = [
    { key: 'businessTaxReturns', title: 'Business Tax Returns (2 years)', description: 'IRS Form 1120, 1120-S, or 1065', required: true },
    { key: 'profitAndLoss', title: 'Profit & Loss Statement', description: 'Current year-to-date P&L', required: true },
    { key: 'balanceSheet', title: 'Balance Sheet', description: 'Most recent balance sheet', required: true },
    { key: 'bankStatements', title: 'Business Bank Statements (3 months)', description: 'Last 3 months of primary business account', required: true },
    { key: 'articlesOfIncorporation', title: 'Articles of Incorporation / Operating Agreement', description: 'Legal formation documents', required: false },
    { key: 'businessLicense', title: 'Business License', description: 'Current business license or permit', required: false },
];

function formatBytes(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function FilePreview({ file, onRemove }) {
    const isImage = file.type.startsWith('image/');
    const [preview] = useState(() => (isImage ? URL.createObjectURL(file) : null));

    return (
        <div className="file-preview">
            {isImage ? (
                <img src={preview} alt={file.name} className="file-preview-thumb" />
            ) : (
                <div className="file-preview-thumb" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText size={24} style={{ color: 'var(--text-muted)' }} />
                </div>
            )}
            <div className="file-preview-info">
                <div className="file-preview-name">{file.name}</div>
                <div className="file-preview-size">{formatBytes(file.size)}</div>
            </div>
            <button type="button" className="file-preview-remove" onClick={onRemove} aria-label="Remove file">
                <X size={18} />
            </button>
        </div>
    );
}

function UploadZone({ title, description, file, onDrop, onRemove, error, required }) {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: ACCEPTED,
        maxSize: MAX_SIZE,
        multiple: false,
        onDrop: (accepted) => {
            if (accepted.length > 0) onDrop(accepted[0]);
        },
    });

    return (
        <div className="upload-section">
            <div className="upload-section-title">
                {title} {required && <span className="required">*</span>}
            </div>
            <div className="upload-section-desc">{description}</div>

            {!file ? (
                <div
                    {...getRootProps()}
                    className={`dropzone ${isDragActive ? 'drag-active' : ''}`}
                >
                    <input {...getInputProps()} />
                    <div className="dropzone-icon">
                        {isDragActive ? <Image size={32} /> : <Upload size={32} />}
                    </div>
                    <div className="dropzone-text">
                        Drag & drop or <span>browse files</span>
                    </div>
                    <div className="dropzone-hint">JPG, PNG, or PDF — max 5 MB</div>
                </div>
            ) : (
                <FilePreview file={file} onRemove={onRemove} />
            )}

            {error && <span className="form-error" style={{ marginTop: '0.5rem' }}>{error}</span>}
        </div>
    );
}

export default function DocumentUploadStep({ data, onSubmit, onBack }) {
    const [files, setFiles] = useState(() => {
        const initial = {};
        BUSINESS_DOCUMENTS.forEach((doc) => {
            initial[doc.key] = data?.[doc.key] || null;
        });
        return initial;
    });
    const [errors, setErrors] = useState({});

    const handleDrop = (key, file) => {
        setFiles((prev) => ({ ...prev, [key]: file }));
    };

    const handleRemove = (key) => {
        setFiles((prev) => ({ ...prev, [key]: null }));
    };

    const handleSubmit = () => {
        const newErrors = {};
        BUSINESS_DOCUMENTS.forEach((doc) => {
            if (doc.required && !files[doc.key]) {
                newErrors[doc.key] = `${doc.title} is required`;
            }
        });

        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            onSubmit(files);
        }
    };

    return (
        <div className="step-content" key="step-documents">
            <h2 className="step-title">Upload Documents</h2>
            <p className="step-subtitle">
                Provide business financial documents for underwriting
            </p>

            {BUSINESS_DOCUMENTS.map((doc) => (
                <UploadZone
                    key={doc.key}
                    title={doc.title}
                    description={doc.description}
                    file={files[doc.key]}
                    onDrop={(file) => handleDrop(doc.key, file)}
                    onRemove={() => handleRemove(doc.key)}
                    error={errors[doc.key]}
                    required={doc.required}
                />
            ))}

            <div className="btn-group">
                <button type="button" className="btn btn-secondary" onClick={onBack}>
                    <ArrowLeft size={16} /> Back
                </button>
                <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                    Submit Application <Send size={16} />
                </button>
            </div>
        </div>
    );
}
