'use client';

import { useState } from 'react';
import { updateProject } from '@/actions/projects';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { HiOutlineArrowLeft } from 'react-icons/hi2';
import BlockEditor, { Section } from '@/components/BlockEditor';
import ImageUpload from '@/components/ImageUpload';

type Program = { id: string; name: string };
type Project = {
    id: string;
    name: string;
    slug: string;
    excerpt: string | null;
    content: string;
    featuredImage: string | null;
    status: string;
    availability: string;
    locale: string;
    sortOrder: number;
    programId: string;
};

function parseContent(content: string): Section[] {
    try {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) return parsed;
        return [];
    } catch {
        if (content && content.trim()) {
            return [{
                id: Math.random().toString(36).substr(2, 9),
                title: '',
                blocks: [{
                    id: Math.random().toString(36).substr(2, 9),
                    type: 'paragraph' as const,
                    content: content,
                }],
            }];
        }
        return [];
    }
}

export default function EditProjectForm({ project, programs }: { project: Project; programs: Program[] }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ type: string; message: string } | null>(null);
    const [sections, setSections] = useState<Section[]>(parseContent(project.content));
    const [coverImage, setCoverImage] = useState(project.featuredImage || '');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setToast(null);

        try {
            const formData = new FormData(e.currentTarget);
            formData.set('content', JSON.stringify(sections));
            formData.set('featuredImage', coverImage);
            await updateProject(project.id, formData);
            setToast({ type: 'success', message: 'Cập nhật thành công!' });
            setTimeout(() => router.push('/admin/projects'), 1000);
        } catch {
            setToast({ type: 'error', message: 'Lỗi khi cập nhật' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="admin-header">
                <h1>Sửa dự án</h1>
            </div>
            <div className="admin-content">
                <Link href="/admin/projects" className="back-link">
                    <HiOutlineArrowLeft /> Quay lại danh sách
                </Link>

                <form onSubmit={handleSubmit} className="form-page">
                    <div className="form-card">
                        <h3>🖼️ Ảnh bìa</h3>
                        <ImageUpload value={coverImage} onChange={setCoverImage} height={250} />
                    </div>

                    <div className="form-card">
                        <h3>Thông tin cơ bản</h3>
                        <div className="form-group">
                            <label>Tên dự án *</label>
                            <input type="text" name="name" className="form-input" defaultValue={project.name} required />
                        </div>
                        <div className="form-group">
                            <label>Slug</label>
                            <input type="text" className="form-input" value={project.slug} disabled style={{ opacity: 0.6 }} />
                        </div>
                        <div className="form-group">
                            <label>Mô tả ngắn</label>
                            <textarea name="excerpt" className="form-textarea" defaultValue={project.excerpt || ''} rows={3} />
                        </div>
                        <div className="form-group">
                            <label>Translation Key</label>
                            <input type="text" name="translationKey" className="form-input" defaultValue={(project as any).translationKey || ''} placeholder="VD: mother-gaston" />
                            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Nhập cùng key cho bài VI và EN để liên kết bản dịch.</span>
                        </div>
                    </div>

                    <div className="form-card">
                        <h3>Nội dung chi tiết</h3>
                        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: -8, marginBottom: 16 }}>
                            Thêm các section cho nội dung chi tiết về dự án.
                        </p>
                        <BlockEditor initialSections={sections} onChange={setSections} hideListBlock hiddenBlockTypes={['requirements']} />
                    </div>

                    <div className="form-card">
                        <h3>Phân loại & Xuất bản</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Thuộc Chương trình *</label>
                                <select name="programId" className="form-select" defaultValue={project.programId} required>
                                    <option value="">-- Chọn chương trình --</option>
                                    {programs.map((p) => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Ngôn ngữ</label>
                                <select name="locale" className="form-select" defaultValue={project.locale || 'vi'}>
                                    <option value="vi">🇻🇳 Tiếng Việt</option>
                                    <option value="en">🇬🇧 English</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-row" style={{ marginTop: 16 }}>
                            <div className="form-group">
                                <label>Trạng thái</label>
                                <select name="status" className="form-select" defaultValue={project.status}>
                                    <option value="DRAFT">Bản nháp</option>
                                    <option value="PUBLISHED">Công khai</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Tình trạng suất</label>
                                <select name="availability" className="form-select" defaultValue={project.availability || 'AVAILABLE'}>
                                    <option value="AVAILABLE">🟢 Còn suất</option>
                                    <option value="SOLD_OUT">🔴 Hết suất</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Thứ tự hiển thị</label>
                                <input type="number" name="sortOrder" className="form-input" defaultValue={project.sortOrder} />
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary" style={{ width: 'auto' }} disabled={loading}>
                            {loading ? <><span className="spinner" /> Đang cập nhật...</> : 'Cập nhật'}
                        </button>
                        <Link href="/admin/projects" className="btn btn-secondary">Huỷ</Link>
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
