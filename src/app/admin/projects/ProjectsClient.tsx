'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HiOutlinePlus, HiOutlinePencilSquare, HiOutlineTrash, HiOutlineMagnifyingGlass } from 'react-icons/hi2';
import { deleteProject } from '@/actions/projects';

type Project = {
    id: string;
    name: string;
    status: string;
    locale: string;
    createdAt: Date;
    program: { id: string; name: string };
};

export default function ProjectsClient({
    projects,
    programs,
}: {
    projects: Project[];
    programs: { id: string; name: string }[];
}) {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [programId, setProgramId] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (programId) params.set('programId', programId);
        router.push(`/admin/projects?${params.toString()}`);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc muốn xoá dự án này?')) return;
        try {
            await deleteProject(id);
            alert('Xoá thành công');
        } catch (err: any) {
            alert(err.message || 'Lỗi khi xoá');
        }
    };

    return (
        <>
            <div className="admin-header">
                <h1>Dự án</h1>
                <div className="admin-header-actions">
                    <Link href="/admin/projects/new" className="btn btn-primary" style={{ width: 'auto' }}>
                        <HiOutlinePlus /> Thêm dự án mới
                    </Link>
                </div>
            </div>

            <div className="admin-content">
                <div className="data-table-container">
                    <div className="data-table-header">
                        <div className="data-table-search">
                            <form onSubmit={handleSearch} className="data-table-search" style={{ display: 'contents' }}>
                                <div className="search-wrapper">
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm dự án..."
                                        className="search-input"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                                <select
                                    className="filter-select"
                                    value={programId}
                                    onChange={(e) => setProgramId(e.target.value)}
                                >
                                    <option value="">Tất cả chương trình</option>
                                    {programs.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                                <button type="submit" className="btn btn-secondary btn-sm">Lọc</button>
                            </form>
                        </div>
                        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{projects.length} dự án</span>
                    </div>

                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Tên dự án</th>
                                <th>Chương trình</th>
                                <th>Ngôn ngữ</th>
                                <th>Trạng thái</th>
                                <th>Ngày tạo</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map((item) => (
                                <tr key={item.id}>
                                    <td className="table-title">{item.name}</td>
                                    <td>{item.program.name}</td>
                                    <td>
                                        <span style={{
                                            fontSize: 12,
                                            fontWeight: 600,
                                            padding: '2px 8px',
                                            borderRadius: 12,
                                            background: item.locale === 'en' ? '#e8f4fd' : '#e8f7ee',
                                            color: item.locale === 'en' ? '#1a6fa8' : '#1a7a3f',
                                        }}>
                                            {item.locale === 'en' ? '🇬🇧 EN' : '🇻🇳 VI'}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`status-badge status-${item.status.toLowerCase()}`}>
                                            {item.status === 'PUBLISHED' ? 'Công khai' : 'Nháp'}
                                        </span>
                                    </td>
                                    <td>{new Date(item.createdAt).toLocaleDateString('vi-VN')}</td>
                                    <td>
                                        <div className="table-actions">
                                            <Link href={`/admin/projects/${item.id}/edit`} className="btn-icon" title="Sửa">
                                                <HiOutlinePencilSquare />
                                            </Link>
                                            <button className="btn-icon btn-icon-danger" onClick={() => handleDelete(item.id)} title="Xoá">
                                                <HiOutlineTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {projects.length === 0 && (
                        <div className="empty-state">Không có dự án nào.</div>
                    )}
                </div>
            </div>
        </>
    );
}
