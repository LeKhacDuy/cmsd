'use client';

import { useState } from 'react';
import { createCategory, deleteCategory } from '@/actions/categories';
import { useRouter } from 'next/navigation';
import { HiOutlinePlus, HiOutlineTrash, HiOutlineFolder } from 'react-icons/hi2';

type Category = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    locale: string;
    _count: { posts: number };
};

export default function CategoriesClient({ categories, isAdmin }: { categories: Category[]; isAdmin: boolean }) {
    const router = useRouter();
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData(e.currentTarget);
            await createCategory(formData);
            setShowForm(false);
            router.refresh();
        } catch { }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc muốn xoá danh mục này?')) return;
        await deleteCategory(id);
        router.refresh();
    };

    return (
        <>
            <div className="admin-header">
                <h1>Danh mục</h1>
                <div className="admin-header-actions">
                    <button className="btn btn-primary" style={{ width: 'auto' }} onClick={() => setShowForm(!showForm)}>
                        <HiOutlinePlus /> Thêm danh mục
                    </button>
                </div>
            </div>

            <div className="admin-content">
                {showForm && (
                    <div className="form-card" style={{ marginBottom: 24 }}>
                        <h3>Thêm danh mục mới</h3>
                        <form onSubmit={handleCreate}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Tên danh mục *</label>
                                    <input type="text" name="name" className="form-input" placeholder="VD: Định cư" required />
                                </div>
                                <div className="form-group">
                                    <label>Mô tả</label>
                                    <input type="text" name="description" className="form-input" placeholder="Mô tả ngắn..." />
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
                        <h3 style={{ fontSize: 16, fontWeight: 600 }}>Tất cả danh mục</h3>
                        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{categories.length} danh mục</span>
                    </div>

                    {categories.length === 0 ? (
                        <div className="empty-state">
                            <HiOutlineFolder style={{ fontSize: 48, color: 'var(--text-muted)', display: 'block', margin: '0 auto 16px' }} />
                            <h3>Chưa có danh mục nào</h3>
                        </div>
                    ) : (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Tên</th>
                                    <th>Slug</th>
                                    <th>Mô tả</th>
                                    <th>Ngôn ngữ</th>
                                    <th>Số bài viết</th>
                                    {isAdmin && <th>Thao tác</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((cat) => (
                                    <tr key={cat.id}>
                                        <td className="table-title">{cat.name}</td>
                                        <td>{cat.slug}</td>
                                        <td>{cat.description || '—'}</td>
                                        <td><span className={`locale-badge locale-${cat.locale || 'vi'}`}>{cat.locale === 'en' ? '🇬🇧 EN' : '🇻🇳 VI'}</span></td>
                                        <td>{cat._count.posts}</td>
                                        {isAdmin && (
                                            <td>
                                                <button className="btn btn-icon" onClick={() => handleDelete(cat.id)} style={{ color: 'var(--danger)' }} title="Xoá">
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
