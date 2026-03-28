'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createServiceGroup, deleteServiceGroup } from '@/actions/programs';
import { HiOutlineArrowLeft, HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi2';

type ServiceGroup = {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
    locale: string;
    sortOrder: number;
    _count: { programs: number };
};

export default function ServiceGroupsClient({ groups, isAdmin }: { groups: ServiceGroup[]; isAdmin: boolean }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ type: string; message: string } | null>(null);

    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData(e.currentTarget);
            await createServiceGroup(formData);
            setToast({ type: 'success', message: 'Đã tạo nhóm dịch vụ' });
            (e.target as HTMLFormElement).reset();
            router.refresh();
        } catch (error) {
            setToast({ type: 'error', message: 'Lỗi khi tạo nhóm' });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Xoá nhóm "${name}"?`)) return;
        try {
            await deleteServiceGroup(id);
            setToast({ type: 'success', message: 'Đã xoá nhóm' });
            router.refresh();
        } catch (error: any) {
            setToast({ type: 'error', message: error.message || 'Lỗi khi xoá' });
        }
    };

    return (
        <>
            <div className="admin-header">
                <h1>Quản lý nhóm dịch vụ</h1>
            </div>
            <div className="admin-content">
                <Link href="/admin/programs" className="back-link">
                    <HiOutlineArrowLeft /> Quay lại danh sách chương trình
                </Link>

                <div className="form-card" style={{ marginBottom: 24 }}>
                    <h3>Thêm nhóm dịch vụ mới</h3>
                    <form onSubmit={handleCreate} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                        <div className="form-group" style={{ flex: 1, minWidth: 200 }}>
                            <label>Tên nhóm *</label>
                            <input type="text" name="name" className="form-input" placeholder="VD: Đầu tư & Định cư Mỹ" required />
                        </div>
                        <div className="form-group" style={{ width: 100 }}>
                            <label>Icon</label>
                            <input type="text" name="icon" className="form-input" placeholder="🇺🇸" />
                        </div>
                        <div className="form-group" style={{ width: 140 }}>
                            <label>Ngôn ngữ</label>
                            <select name="locale" className="form-select" defaultValue="vi">
                                <option value="vi">🇻🇳 Tiếng Việt</option>
                                <option value="en">🇬🇧 English</option>
                            </select>
                        </div>
                        <div className="form-group" style={{ width: 80 }}>
                            <label>Thứ tự</label>
                            <input type="number" name="sortOrder" className="form-input" defaultValue={0} />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={loading} style={{ height: 42 }}>
                            <HiOutlinePlus /> {loading ? 'Đang lưu...' : 'Thêm'}
                        </button>
                    </form>
                </div>

                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th style={{ width: 50 }}>#</th>
                                <th>Icon</th>
                                <th>Tên nhóm</th>
                                <th>Slug</th>
                                <th>Ngôn ngữ</th>
                                <th>Số chương trình</th>
                                {isAdmin && <th style={{ width: 80 }}>Xoá</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {groups.length === 0 ? (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                                        Chưa có nhóm dịch vụ nào
                                    </td>
                                </tr>
                            ) : (
                                groups.map((g) => (
                                    <tr key={g.id}>
                                        <td style={{ color: 'var(--text-muted)' }}>{g.sortOrder}</td>
                                        <td style={{ fontSize: 20 }}>{g.icon || '—'}</td>
                                        <td><strong>{g.name}</strong></td>
                                        <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{g.slug}</td>
                                        <td><span className={`locale-badge locale-${g.locale || 'vi'}`}>{g.locale === 'en' ? '🇬🇧 EN' : '🇻🇳 VI'}</span></td>
                                        <td>{g._count.programs}</td>
                                        {isAdmin && (
                                            <td>
                                                <button
                                                    className="btn-icon btn-icon-danger"
                                                    onClick={() => handleDelete(g.id, g.name)}
                                                    title={g._count.programs > 0 ? 'Xoá hết chương trình trước' : 'Xoá'}
                                                >
                                                    <HiOutlineTrash />
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {toast && (
                <div className={`toast toast-${toast.type}`}>
                    {toast.message}
                </div>
            )}
        </>
    );
}
