'use client';

import { useState, useRef } from 'react';
import { HiOutlinePhoto, HiOutlineArrowUpTray } from 'react-icons/hi2';

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    label?: string;
    height?: number;
}

export default function ImageUpload({ value, onChange, label, height = 220 }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const uploadFile = async (file: File) => {
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const data = await res.json();

            if (res.ok) {
                onChange(data.url);
            } else {
                alert(data.error || 'Lỗi khi tải ảnh lên');
            }
        } catch {
            alert('Lỗi khi tải ảnh lên');
        } finally {
            setUploading(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) uploadFile(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            uploadFile(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = () => {
        setDragOver(false);
    };

    return (
        <div className="img-upload-wrapper">
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
            />

            {value ? (
                <div className="img-upload-preview" style={{ maxHeight: height }}>
                    <img src={value} alt="Preview" />
                    <div className="img-upload-overlay">
                        <button type="button" className="img-upload-change" onClick={() => fileInputRef.current?.click()}>
                            <HiOutlineArrowUpTray /> Đổi ảnh
                        </button>
                        <button type="button" className="img-upload-remove" onClick={() => onChange('')}>
                            ✕ Xoá
                        </button>
                    </div>
                </div>
            ) : (
                <div
                    className={`img-upload-dropzone ${dragOver ? 'drag-over' : ''} ${uploading ? 'uploading' : ''}`}
                    style={{ minHeight: height }}
                    onClick={() => !uploading && fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                >
                    {uploading ? (
                        <>
                            <span className="spinner" />
                            <p>Đang tải lên...</p>
                        </>
                    ) : (
                        <>
                            <HiOutlinePhoto />
                            <p><strong>Bấm để chọn ảnh</strong> hoặc kéo thả vào đây</p>
                            <span>PNG, JPG, GIF, WebP — tối đa 5MB</span>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
