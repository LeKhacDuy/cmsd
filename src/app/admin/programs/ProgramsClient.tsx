'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { deleteProgram } from '@/actions/programs';
import { HiOutlinePlus, HiOutlinePencilSquare, HiOutlineTrash } from 'react-icons/hi2';

type ServiceGroup = { id: string; name: string; icon: string | null };
type Country = { id: string; name: string; flagIcon: string | null };
type Program = {
    id: string;
    name: string;
    slug: string;
    status: string;
    sortOrder: number;
    featuredImage: string | null;
    serviceGroup: ServiceGroup;
    country: Country | null;
};

export default function ProgramsClient({
    programs,
    serviceGroups,
    countries,
    isAdmin,
}: {
    programs: Program[];
    serviceGroups: ServiceGroup[];
    countries: Country[];
    isAdmin: boolean;
}) {
    const router = useRouter();
    const [filter, setFilter] = useState('');
    const [toast, setToast] = useState<{ type: string; message: string } | null>(null);

    const filtered = filter
        ? programs.filter((p) => p.serviceGroup.id === filter)
        : programs;

    // Group by service group
    const grouped: Record<string, Program[]> = {};
    filtered.forEach((p) => {
        const key = p.serviceGroup.name;
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(p);
    });

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Xoá chương trình "${name}"?`)) return;
        try {
            await deleteProgram(id);
            setToast({ type: 'success', message: 'Đã xoá chương trình' });
            router.refresh();
        } catch {
            setToast({ type: 'error', message: 'Lỗi khi xoá' });
        }
    };

    return (
        <>
            <div className="admin-header">
                <h1>Chương trình định cư</h1>
                <div style={{ display: 'flex', gap: 8 }}>
                    <Link href="/admin/programs/groups" className="btn btn-secondary">
                        Quản lý nhóm dịch vụ
                    </Link>
                    <Link href="/admin/programs/new" className="btn btn-primary">
                        <HiOutlinePlus /> Thêm chương trình
                    </Link>
                </div>
            </div>

            <div className="admin-content">
                <div className="filter-bar">
                    <select
                        className="form-select"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        style={{ maxWidth: 280 }}
                    >
                        <option value="">Tất cả nhóm dịch vụ</option>
                        {serviceGroups.map((g) => (
                            <option key={g.id} value={g.id}>{g.icon} {g.name}</option>
                        ))}
                    </select>
                </div>

                {Object.keys(grouped).length === 0 ? (
                    <div className="empty-state">
                        <p>Chưa có chương trình nào.</p>
                        <Link href="/admin/programs/new" className="btn btn-primary">
                            <HiOutlinePlus /> Thêm chương trình đầu tiên
                        </Link>
                    </div>
                ) : (
                    Object.entries(grouped).map(([groupName, progs]) => (
                        <div key={groupName} style={{ marginBottom: 28 }}>
                            <h3 style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 12, fontWeight: 600 }}>
                                {groupName} <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>({progs.length})</span>
                            </h3>
                            <div className="table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th style={{ width: 50 }}>#</th>
                                            <th>Tên chương trình</th>
                                            <th>Quốc gia</th>
                                            <th>Trạng thái</th>
                                            <th style={{ width: 100 }}>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {progs.map((prog) => (
                                            <tr key={prog.id}>
                                                <td style={{ color: 'var(--text-muted)' }}>{prog.sortOrder}</td>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                        {prog.featuredImage && (
                                                            <img
                                                                src={prog.featuredImage}
                                                                alt=""
                                                                style={{ width: 40, height: 30, objectFit: 'cover', borderRadius: 4 }}
                                                            />
                                                        )}
                                                        <strong>{prog.name}</strong>
                                                    </div>
                                                </td>
                                                <td>{prog.country ? `${prog.country.flagIcon || ''} ${prog.country.name}` : '—'}</td>
                                                <td>
                                                    <span className={`status-badge status-${prog.status.toLowerCase()}`}>
                                                        {prog.status === 'PUBLISHED' ? 'Công khai' : 'Nháp'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="table-actions">
                                                        <Link href={`/admin/programs/${prog.id}/edit`} className="btn-icon" title="Sửa">
                                                            <HiOutlinePencilSquare />
                                                        </Link>
                                                        {isAdmin && (
                                                            <button className="btn-icon btn-icon-danger" onClick={() => handleDelete(prog.id, prog.name)} title="Xoá">
                                                                <HiOutlineTrash />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))
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
