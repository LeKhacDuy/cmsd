'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SettingsClient({ settings }: { settings: Record<string, string> }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ type: string; message: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setToast(null);

        try {
            const formData = new FormData(e.currentTarget);
            const res = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    site_name: formData.get('site_name'),
                    site_description: formData.get('site_description'),
                }),
            });

            if (res.ok) {
                setToast({ type: 'success', message: 'Cài đặt đã được lưu!' });
                router.refresh();
            } else {
                setToast({ type: 'error', message: 'Lỗi khi lưu cài đặt' });
            }
        } catch {
            setToast({ type: 'error', message: 'Lỗi khi lưu cài đặt' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="admin-header">
                <h1>Cài đặt</h1>
            </div>

            <div className="admin-content">
                <form onSubmit={handleSubmit} className="form-page">
                    <div className="form-card">
                        <h3>Cài đặt chung</h3>

                        <div className="form-group">
                            <label>Tên website</label>
                            <input type="text" name="site_name" className="form-input" defaultValue={settings.site_name || ''} />
                        </div>

                        <div className="form-group">
                            <label>Mô tả website</label>
                            <textarea name="site_description" className="form-textarea" defaultValue={settings.site_description || ''} rows={3} />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary" style={{ width: 'auto' }} disabled={loading}>
                            {loading ? 'Đang lưu...' : 'Lưu cài đặt'}
                        </button>
                    </div>
                </form>
            </div>

            {toast && (
                <div className={`toast toast-${toast.type}`}>
                    {toast.message}
                </div>
            )}
        </>
    );
}
