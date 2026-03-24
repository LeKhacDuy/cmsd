'use client';

import { useState } from 'react';
import { updateProgram } from '@/actions/programs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { HiOutlineArrowLeft } from 'react-icons/hi2';
import BlockEditor, { Section } from '@/components/BlockEditor';
import ImageUpload from '@/components/ImageUpload';

type ServiceGroup = { id: string; name: string; icon: string | null };
type Country = { id: string; name: string; flagIcon: string | null };
type Program = {
    id: string;
    name: string;
    slug: string;
    excerpt: string | null;
    content: string;
    featuredImage: string | null;
    status: string;
    locale: string;
    sortOrder: number;
    serviceGroupId: string;
    countryId: string | null;
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

export default function EditProgramForm({
    program,
    serviceGroups,
    countries,
}: {
    program: Program;
    serviceGroups: ServiceGroup[];
    countries: Country[];
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ type: string; message: string } | null>(null);
    const [sections, setSections] = useState<Section[]>(parseContent(program.content));
    const [coverImage, setCoverImage] = useState(program.featuredImage || '');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setToast(null);

        try {
            const formData = new FormData(e.currentTarget);
            formData.set('content', JSON.stringify(sections));
            formData.set('featuredImage', coverImage);
            await updateProgram(program.id, formData);
            setToast({ type: 'success', message: 'Cập nhật thành công!' });
            setTimeout(() => router.push('/admin/programs'), 1000);
        } catch {
            setToast({ type: 'error', message: 'Lỗi khi cập nhật' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="admin-header">
                <h1>Sửa chương trình</h1>
            </div>
            <div className="admin-content">
                <Link href="/admin/programs" className="back-link">
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
                            <label>Tên chương trình *</label>
                            <input type="text" name="name" className="form-input" defaultValue={program.name} required />
                        </div>
                        <div className="form-group">
                            <label>Slug</label>
                            <input type="text" className="form-input" value={program.slug} disabled style={{ opacity: 0.6 }} />
                        </div>
                        <div className="form-group">
                            <label>Mô tả ngắn</label>
                            <textarea name="excerpt" className="form-textarea" defaultValue={program.excerpt || ''} rows={3} />
                        </div>
                    </div>

                    <div className="form-card">
                        <h3>Nội dung chi tiết</h3>
                        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: -8, marginBottom: 16 }}>
                            Thêm các section cho nội dung chi tiết về chương trình.
                        </p>
                        <BlockEditor initialSections={sections} onChange={setSections} maxSections={1} hideListBlock />
                    </div>

                    <div className="form-card">
                        <h3>Phân loại</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Nhóm dịch vụ *</label>
                                <select name="serviceGroupId" className="form-select" defaultValue={program.serviceGroupId} required>
                                    <option value="">-- Chọn nhóm dịch vụ --</option>
                                    {serviceGroups.map((g) => (
                                        <option key={g.id} value={g.id}>{g.icon} {g.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Quốc gia</label>
                                <select name="countryId" className="form-select" defaultValue={program.countryId || ''}>
                                    <option value="">-- Chọn quốc gia --</option>
                                    {countries.map((c) => (
                                        <option key={c.id} value={c.id}>{c.flagIcon} {c.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-card">
                        <h3>Xuất bản</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Ngôn ngữ</label>
                                <select name="locale" className="form-select" defaultValue={program.locale || 'vi'}>
                                    <option value="vi">🇻🇳 Tiếng Việt</option>
                                    <option value="en">🇬🇧 English</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Trạng thái</label>
                                <select name="status" className="form-select" defaultValue={program.status}>
                                    <option value="DRAFT">Bản nháp</option>
                                    <option value="PUBLISHED">Công khai</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Thứ tự hiển thị</label>
                                <input type="number" name="sortOrder" className="form-input" defaultValue={program.sortOrder} />
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary" style={{ width: 'auto' }} disabled={loading}>
                            {loading ? <><span className="spinner" /> Đang lưu...</> : 'Cập nhật'}
                        </button>
                        <Link href="/admin/programs" className="btn btn-secondary">Huỷ</Link>
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
