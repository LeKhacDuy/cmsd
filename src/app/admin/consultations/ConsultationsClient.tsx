'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    markConsultationRead,
    markConsultationUnread,
    deleteConsultation,
} from '@/actions/consultations';
import {
    HiOutlineTrash,
    HiOutlineEnvelope,
    HiOutlineEnvelopeOpen,
    HiOutlinePhone,
} from 'react-icons/hi2';

type Consultation = {
    id: string;
    fullName: string;
    phone: string;
    city: string;
    email: string | null;
    program: string;
    note: string | null;
    isRead: boolean;
    createdAt: string;
};

export default function ConsultationsClient({
    consultations,
    stats,
}: {
    consultations: Consultation[];
    stats: { total: number; unread: number };
}) {
    const router = useRouter();
    const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
    const [toast, setToast] = useState<{ type: string; message: string } | null>(null);

    const filtered = consultations.filter((c) => {
        if (filter === 'unread') return !c.isRead;
        if (filter === 'read') return c.isRead;
        return true;
    });

    const showToast = (type: string, message: string) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3000);
    };

    const handleToggleRead = async (c: Consultation) => {
        try {
            if (c.isRead) {
                await markConsultationUnread(c.id);
            } else {
                await markConsultationRead(c.id);
            }
            router.refresh();
        } catch {
            showToast('error', 'Lỗi');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Xoá yêu cầu tư vấn này?')) return;
        try {
            await deleteConsultation(id);
            showToast('success', 'Đã xoá');
            router.refresh();
        } catch {
            showToast('error', 'Lỗi khi xoá');
        }
    };

    const formatDate = (d: string) => {
        return new Date(d).toLocaleString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    };

    return (
        <>
            <div className="admin-header">
                <h1>Yêu cầu tư vấn</h1>
            </div>

            <div className="admin-content">
                {/* Stats */}
                <div className="consult-stats">
                    <div className="consult-stat-card">
                        <span className="consult-stat-num">{stats.total}</span>
                        <span className="consult-stat-label">Tổng cộng</span>
                    </div>
                    <div className="consult-stat-card consult-stat-unread">
                        <span className="consult-stat-num">{stats.unread}</span>
                        <span className="consult-stat-label">Chưa đọc</span>
                    </div>
                    <div className="consult-stat-card">
                        <span className="consult-stat-num">{stats.total - stats.unread}</span>
                        <span className="consult-stat-label">Đã xử lý</span>
                    </div>
                </div>

                {/* Filter */}
                <div className="filter-bar">
                    <div className="consult-filter-tabs">
                        <button className={`consult-tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
                            Tất cả ({stats.total})
                        </button>
                        <button className={`consult-tab ${filter === 'unread' ? 'active' : ''}`} onClick={() => setFilter('unread')}>
                            Chưa đọc ({stats.unread})
                        </button>
                        <button className={`consult-tab ${filter === 'read' ? 'active' : ''}`} onClick={() => setFilter('read')}>
                            Đã xử lý ({stats.total - stats.unread})
                        </button>
                    </div>
                </div>

                {/* List */}
                {filtered.length === 0 ? (
                    <div className="empty-state">
                        <p>Chưa có yêu cầu tư vấn nào.</p>
                    </div>
                ) : (
                    <div className="consult-list">
                        {filtered.map((c) => (
                            <div key={c.id} className={`consult-card ${!c.isRead ? 'consult-card-unread' : ''}`}>
                                <div className="consult-card-main">
                                    <div className="consult-card-left">
                                        <div className="consult-card-name">
                                            {!c.isRead && <span className="consult-dot" />}
                                            <strong>{c.fullName}</strong>
                                        </div>
                                        <div className="consult-card-details">
                                            <span><HiOutlinePhone /> {c.phone}</span>
                                            <span>📍 {c.city}</span>
                                            {c.email && <span>✉️ {c.email}</span>}
                                        </div>
                                        <div className="consult-card-program">
                                            🎯 {c.program}
                                        </div>
                                    </div>
                                    <div className="consult-card-right">
                                        <span className="consult-card-date">{formatDate(c.createdAt)}</span>
                                        <div className="consult-card-actions">
                                            <button
                                                className="btn-icon"
                                                onClick={() => handleToggleRead(c)}
                                                title={c.isRead ? 'Đánh dấu chưa đọc' : 'Đánh dấu đã đọc'}
                                            >
                                                {c.isRead ? <HiOutlineEnvelopeOpen /> : <HiOutlineEnvelope />}
                                            </button>
                                            <button className="btn-icon btn-icon-danger" onClick={() => handleDelete(c.id)} title="Xoá">
                                                <HiOutlineTrash />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {toast && (
                <div className={`toast toast-${toast.type}`}>
                    {toast.message}
                </div>
            )}
        </>
    );
}
