import React from 'react';
import { ApplicationFormData } from '../ApplicationPage';

type Props = {
  data: ApplicationFormData;
  onChange: <K extends keyof ApplicationFormData>(key: K, value: ApplicationFormData[K]) => void;
};

const DocumentUpload = ({ data, onChange }: Props) => {
  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const names = Array.from(files).map((f) => f.name);
    onChange('documents', names as any);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">Upload supporting documents (ID, address proof, income proof). You can upload multiple files.</p>
      <input type="file" multiple onChange={handleFiles} className="w-full" />

      {data.documents && data.documents.length > 0 && (
        <div className="mt-2 text-sm text-gray-700">
          <strong>Selected files:</strong>
          <ul className="list-disc pl-5 mt-1">
            {data.documents.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
