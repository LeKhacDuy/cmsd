'use client';

import { useState } from 'react';
import { createCountry, deleteCountry } from '@/actions/countries';
import { useRouter } from 'next/navigation';
import { HiOutlinePlus, HiOutlineTrash, HiOutlineGlobeAlt } from 'react-icons/hi2';

type Country = {
    id: string;
    name: string;
    slug: string;
    flagIcon: string | null;
    locale: string;
    _count: { posts: number };
};

export default function CountriesClient({ countries, isAdmin }: { countries: Country[]; isAdmin: boolean }) {
    const router = useRouter();
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData(e.currentTarget);
            await createCountry(formData);
            setShowForm(false);
            router.refresh();
        } catch { }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc muốn xoá quốc gia này?')) return;
        await deleteCountry(id);
        router.refresh();
    };

    return (
        <>
            <div className="admin-header">
                <h1>Quốc gia</h1>
                <div className="admin-header-actions">
                    <button className="btn btn-primary" style={{ width: 'auto' }} onClick={() => setShowForm(!showForm)}>
                        <HiOutlinePlus /> Thêm quốc gia
                    </button>
                </div>
            </div>

            <div className="admin-content">
                {showForm && (
                    <div className="form-card" style={{ marginBottom: 24 }}>
                        <h3>Thêm quốc gia mới</h3>
                        <form onSubmit={handleCreate}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Tên quốc gia *</label>
                                    <input type="text" name="name" className="form-input" placeholder="VD: Hoa Kỳ" required />
                                </div>
                                <div className="form-group">
                                    <label>Icon cờ (emoji)</label>
                                    <input type="text" name="flagIcon" className="form-input" placeholder="VD: 🇺🇸" />
                                </div>
                                <div className="form-group">
                                    <label>Ngôn ngữ</label>
                                    <select name="locale" className="form-select" defaultValue="vi">
                                        <option value="vi">🇻🇳 Tiếng Việt</option>
                                        <option value="en">🇬🇧 English</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="btn btn-primary" style={{ width: 'auto' }} disabled={loading}>
                                    {loading ? 'Đang lưu...' : 'Thêm'}
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Huỷ</button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="data-table-container">
                    <div className="data-table-header">
                        <h3 style={{ fontSize: 16, fontWeight: 600 }}>Tất cả quốc gia</h3>
                        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{countries.length} quốc gia</span>
                    </div>

                    {countries.length === 0 ? (
                        <div className="empty-state">
                            <HiOutlineGlobeAlt style={{ fontSize: 48, color: 'var(--text-muted)', display: 'block', margin: '0 auto 16px' }} />
                            <h3>Chưa có quốc gia nào</h3>
                        </div>
                    ) : (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Cờ</th>
                                    <th>Tên</th>
                                    <th>Slug</th>
                                    <th>Ngôn ngữ</th>
                                    <th>Số bài viết</th>
                                    {isAdmin && <th>Thao tác</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {countries.map((c) => (
                                    <tr key={c.id}>
                                        <td style={{ fontSize: 24 }}>{c.flagIcon || '🏳️'}</td>
                                        <td className="table-title">{c.name}</td>
                                        <td>{c.slug}</td>
                                        <td><span className={`locale-badge locale-${c.locale || 'vi'}`}>{c.locale === 'en' ? '🇬🇧 EN' : '🇻🇳 VI'}</span></td>
                                        <td>{c._count.posts}</td>
                                        {isAdmin && (
                                            <td>
                                                <button className="btn btn-icon" onClick={() => handleDelete(c.id)} style={{ color: 'var(--danger)' }} title="Xoá">
                                                    <HiOutlineTrash />
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </>
    );
}
