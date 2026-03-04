import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import PersonalDetails from './steps/PersonalDetails';

const DocumentUpload: React.FC<any> = ({ data, onChange }) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFiles = (filesList: FileList | null) => {
        if (!filesList) return;
        const names = Array.from(filesList).map((f) => f.name);
        onChange('documents', [...(data?.documents || []), ...names]);
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => handleFiles(e.target.files);

    const onRemove = (index: number) => {
        const arr = Array.from(data?.documents || []);
        arr.splice(index, 1);
        onChange('documents', arr);
    };

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

    return (
        <div className="grid gap-4">
            <div
                className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
                onDrop={onDrop}
                onDragOver={onDragOver}
                role="button"
                tabIndex={0}
            >
                <input ref={fileInputRef} type="file" multiple onChange={onFileChange} className="hidden" />
                <svg className="h-10 w-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16v-4a4 4 0 014-4h2a4 4 0 014 4v4m-9 4h6" />
                </svg>
                <p className="text-sm text-gray-600">Drag & drop files here, or click to browse</p>
                <p className="text-xs text-gray-400">Supported: PDF, JPG, PNG. Max 10MB each.</p>
            </div>

            <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Uploaded Documents</h4>
                <div className="space-y-2">
                    {(data?.documents || []).length ? (
                        (data.documents || []).map((d: string, idx: number) => (
                            <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-md shadow-sm border">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-gray-600">📄</div>
                                    <div className="text-sm text-gray-700 truncate max-w-xs">{d}</div>
                                </div>
                                <div>
                                    <button type="button" onClick={() => onRemove(idx)} className="text-sm text-red-600 hover:underline">Remove</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">No documents uploaded yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const ReviewSubmit: React.FC<any> = ({ data }) => {
    return (
        <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-md border">
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Personal Details</h3>
                    <p className="text-sm text-gray-700"><span className="font-medium">Name:</span> {data?.fullName || '-'}</p>
                    <p className="text-sm text-gray-700"><span className="font-medium">Mobile:</span> {data?.mobile || '-'}</p>
                    <p className="text-sm text-gray-700"><span className="font-medium">Email:</span> {data?.email || '-'}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-md border">
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Employment</h3>
                    <p className="text-sm text-gray-700"><span className="font-medium">Occupation:</span> {data?.occupation || '-'}</p>
                    <p className="text-sm text-gray-700"><span className="font-medium">Company:</span> {data?.company || '-'}</p>
                    <p className="text-sm text-gray-700"><span className="font-medium">Designation:</span> {data?.designation || '-'}</p>
                </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-md border">
                <h3 className="text-sm font-semibold text-gray-800 mb-2">Financials</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="text-sm text-gray-700"><span className="font-medium">Monthly Income:</span> {data?.monthlyIncome || '-'}</div>
                    <div className="text-sm text-gray-700"><span className="font-medium">Annual Turnover:</span> {data?.annualTurnover || '-'}</div>
                    <div className="text-sm text-gray-700"><span className="font-medium">Desired Loan Amount:</span> {data?.desiredLoanAmount || '-'}</div>
                    <div className="text-sm text-gray-700"><span className="font-medium">Tenure (months):</span> {data?.tenureMonths || '-'}</div>
                </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-md border">
                <h3 className="text-sm font-semibold text-gray-800 mb-2">Documents</h3>
                {data?.documents?.length ? (
                    <div className="flex flex-wrap gap-2">
                        {data.documents.map((d: string, i: number) => (
                            <div key={i} className="px-3 py-2 bg-white border rounded-md shadow-sm text-sm flex items-center gap-2">
                                <span className="text-gray-600">📄</span>
                                <span className="max-w-[180px] truncate">{d}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">No documents uploaded.</p>
                )}
            </div>
        </div>
    );
};

// Inline stub for EmploymentDetails to avoid missing-module error.
// Inline stub for EmploymentDetails to avoid missing-module error.
// Uses loose typing to avoid referencing ApplicationFormData before its declaration.
const EmploymentDetails: React.FC<any> = ({ data, onChange }) => {
    return (
        <div className="grid gap-4">
            <Input
                value={data?.occupation || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('occupation', e.target.value)}
                placeholder="Occupation"
            />
            <Input
                value={data?.company || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('company', e.target.value)}
                placeholder="Company"
            />
            <Input
                value={data?.designation || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('designation', e.target.value)}
                placeholder="Designation"
            />
        </div>
    );
};

const FinancialDetails: React.FC<any> = ({ data, onChange }) => {
    return (
        <div className="grid gap-4">
            <Input
                value={data?.monthlyIncome || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('monthlyIncome', e.target.value)}
                placeholder="Monthly Income"
            />
            <Input
                value={data?.annualTurnover || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('annualTurnover', e.target.value)}
                placeholder="Annual Turnover"
            />
            <Input
                value={data?.desiredLoanAmount || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('desiredLoanAmount', e.target.value)}
                placeholder="Desired Loan Amount"
            />
            <Input
                value={data?.tenureMonths || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('tenureMonths', e.target.value)}
                placeholder="Tenure (months)"
            />
        </div>
    );
};
export type ApplicationFormData = {
    fullName: string;
    mobile: string;
    email: string;
    occupation: string;
    company?: string;
    designation?: string;
    monthlyIncome?: string;
    annualTurnover?: string;
    desiredLoanAmount?: string;
    tenureMonths?: string;
    documents?: string[]; // stored as uploaded file names for mock
};

const initialData: ApplicationFormData = {
    fullName: '',
    mobile: '',
    email: '',
    occupation: '',
    company: '',
    designation: '',
    monthlyIncome: '',
    annualTurnover: '',
    desiredLoanAmount: '',
    tenureMonths: '',
    documents: [],
};

export const ApplicationPage = (): JSX.Element => {
    const [step, setStep] = useState(0);
    const [data, setData] = useState<ApplicationFormData>(initialData);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // Ensure page is at top when this route/component mounts (so form is visible)
    useEffect(() => {
        try { window.scrollTo({ top: 0, behavior: 'auto' }); } catch (e) { /* silent */ }
    }, []);

    const steps = [
        'Personal Details',
        'Employment',
        'Financials',
        'Documents',
        'Review & Submit',
    ];

    const updateField = <K extends keyof ApplicationFormData>(key: K, value: ApplicationFormData[K]) => {
        setData((d) => ({ ...d, [key]: value }));
    };

    const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
    const prev = () => setStep((s) => Math.max(s - 1, 0));

    const submitApplication = async () => {
        setSubmitting(true);
        // Mock API delay
        await new Promise((r) => setTimeout(r, 1200));
        setSubmitting(false);
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto max-w-4xl px-4">
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Loan Application</h1>
                    <p className="text-gray-600 mt-2">Complete the steps to submit your application.</p>
                </div>

                <div className="mb-6">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                        <div>{steps.map((s, i) => (
                            <span key={s} className={`inline-block px-3 py-1 ${i === step ? 'bg-[#0050B2] text-white rounded-lg' : 'bg-gray-100 text-gray-700 rounded-lg'} mr-2`}>{i+1}. {s.split(' ')[0]}</span>
                        ))}</div>
                        <div className="text-xs">Step {step + 1} of {steps.length}</div>
                    </div>
                </div>

                <Card className="shadow-2xl border-0 rounded-2xl bg-white">
                    <CardContent className="p-6">
                        {!submitted ? (
                            <div>
                                {step === 0 && (
                                    <PersonalDetails data={data} onChange={updateField} />
                                )}

                                {step === 1 && (
                                    <EmploymentDetails data={data} onChange={updateField} />
                                )}

                                {step === 2 && (
                                    <FinancialDetails data={data} onChange={updateField} />
                                )}

                                {step === 3 && (
                                    <DocumentUpload data={data} onChange={updateField} />
                                )}

                                {step === 4 && (
                                    <ReviewSubmit data={data} />
                                )}

                                <div className="mt-6 flex justify-between">
                                    <Button variant="ghost" onClick={prev} disabled={step === 0}>Back</Button>
                                    <div className="flex items-center gap-3">
                                        {step < steps.length - 1 ? (
                                            <Button onClick={next} className="bg-[#0050B2] hover:bg-[#003d8a] text-white">Next</Button>
                                        ) : (
                                            <Button onClick={submitApplication} className="bg-green-600 hover:bg-green-700 text-white" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Application'}</Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <svg className="w-20 h-20 mx-auto text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h2 className="text-2xl font-bold">Application Submitted</h2>
                                <p className="text-gray-600 mt-2">Thank you! We will contact you shortly with personalized offers.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ApplicationPage;