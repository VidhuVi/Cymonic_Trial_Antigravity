"use client";

import { useState, useRef } from "react";
import { UploadCloud, FileText, CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function Uploader() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateAndAddFiles = (newFiles: File[]) => {
    setError(null);
    const validExtensions = ['.txt', '.vtt'];
    
    for (const file of newFiles) {
      const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
      if (!validExtensions.includes(ext)) {
        setError(`Unsupported file format: ${file.name}. Only .txt and .vtt are supported.`);
        return;
      }
    }

    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndAddFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndAddFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    setIsUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      files.forEach(f => formData.append("files", f));
      
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      
      if (!res.ok) throw new Error("Upload failed. Please try again.");
      
      setFiles([]);
      // Reload the page to catch new data in the dashboard stats
      window.location.reload(); 
    } catch(err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full">
      <div 
        className={`glass-panel flex flex-col items-center justify-center p-12 text-center transition-all gap-6 ${isDragging ? 'shadow-xl' : ''}`} 
        style={{
          borderStyle: isDragging ? 'solid' : 'dashed', 
          borderWidth: '2px', 
          borderColor: isDragging ? 'var(--primary-color)' : error ? 'var(--error-color)' : 'var(--primary-color)', 
          minHeight: '320px',
          background: isDragging ? 'rgba(99, 102, 241, 0.05)' : 'var(--surface-color)',
          transform: isDragging ? 'scale(1.02)' : 'scale(1)'
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          multiple 
          accept=".txt,.vtt" 
          className="hidden" 
          style={{display: 'none'}} 
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        
        <div className="p-6" style={{background: 'rgba(99, 102, 241, 0.1)', borderRadius: '50%'}}>
          <UploadCloud size={56} color={isDragging ? '#818cf8' : "var(--primary-color)"} />
        </div>
        <h2 style={{fontSize: '1.75rem', margin: 0}}>
          {isDragging ? 'Drop files here' : 'Upload Transcripts'}
        </h2>
        <p className="text-secondary max-w-md mx-auto" style={{maxWidth: '430px', margin: 0}}>
          Drag and drop your meeting transcripts (.txt or .vtt) here to begin AI processing.
        </p>
        <button className="btn btn-primary" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
          Browse Files
        </button>
      </div>

      {error && (
        <div className="mt-4 p-4 rounded-lg flex items-center gap-3 animate-fade-in" style={{background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: 'var(--error-color)'}}>
          <XCircle size={20} />
          {error}
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-8 animate-fade-in">
          <h3 style={{marginBottom: '1rem'}}>Selected Files ({files.length})</h3>
          <div className="flex flex-col gap-3 mb-6">
            {files.map((file, idx) => (
              <div key={idx} className="glass-panel flex items-center justify-between" style={{padding: '1rem', borderRadius: '8px'}}>
                <div className="flex items-center gap-3">
                  <FileText size={20} className="text-secondary" />
                  <div>
                    <p style={{fontWeight: 500}}>{file.name}</p>
                    <p className="text-secondary" style={{fontSize: '0.8rem'}}>{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button 
                  className="text-secondary hover:text-red-400" 
                  style={{background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)'}}
                  onClick={(e) => {
                    e.stopPropagation();
                    setFiles(files.filter((_, i) => i !== idx));
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button 
            className="btn btn-primary" 
            style={{width: '100%', justifyContent: 'center'}} 
            onClick={handleUpload}
            disabled={isUploading}
          >
            {isUploading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
            {isUploading ? "Processing..." : "Process Transcripts"}
          </button>
        </div>
      )}
    </div>
  );
}
