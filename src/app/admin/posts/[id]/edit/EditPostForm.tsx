'use client';

import { useState } from 'react';
import { updatePost } from '@/actions/posts';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { HiOutlineArrowLeft } from 'react-icons/hi2';
import BlockEditor, { Section } from '@/components/BlockEditor';
import ImageUpload from '@/components/ImageUpload';

type Category = { id: string; name: string };
type Country = { id: string; name: string; slug: string; flagIcon: string | null };
type Post = {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    categoryId: string | null;
    countryId: string | null;
    status: string;
    locale: string;
    featuredImage: string | null;
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

export default function EditPostForm({
    post,
    categories,
    countries,
}: {
    post: Post;
    categories: Category[];
    countries: Country[];
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ type: string; message: string } | null>(null);
    const [sections, setSections] = useState<Section[]>(parseContent(post.content));
    const [coverImage, setCoverImage] = useState(post.featuredImage || '');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setToast(null);

        try {
            const formData = new FormData(e.currentTarget);
            formData.set('content', JSON.stringify(sections));
            formData.set('featuredImage', coverImage);
            await updatePost(post.id, formData);
            setToast({ type: 'success', message: 'Cập nhật bài viết thành công!' });
            setTimeout(() => router.push('/admin/posts'), 1000);
        } catch (error) {
            setToast({ type: 'error', message: 'Lỗi khi cập nhật bài viết' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="admin-header">
                <h1>Sửa bài viết</h1>
            </div>
            <div className="admin-content">
                <Link href="/admin/posts" className="back-link">
                    <HiOutlineArrowLeft /> Quay lại danh sách
                </Link>

                <form onSubmit={handleSubmit} className="form-page">
                    {/* ====== COVER IMAGE ====== */}
                    <div className="form-card">
                        <h3>🖼️ Ảnh bìa</h3>
                        <ImageUpload value={coverImage} onChange={setCoverImage} height={250} />
                    </div>

                    {/* ====== BASIC INFO ====== */}
                    <div className="form-card">
                        <h3>Thông tin cơ bản</h3>

                        <div className="form-group">
                            <label>Tiêu đề *</label>
                            <input type="text" name="title" className="form-input" defaultValue={post.title} required />
                        </div>

                        <div className="form-group">
                            <label>Slug</label>
                            <input type="text" className="form-input" value={post.slug} disabled style={{ opacity: 0.6 }} />
                        </div>

                        <div className="form-group">
                            <label>Mô tả ngắn (Excerpt)</label>
                            <textarea name="excerpt" className="form-textarea" defaultValue={post.excerpt || ''} rows={3} />
                        </div>
                    </div>

                    <div className="form-card">
                        <h3>Nội dung bài viết</h3>
                        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: -8, marginBottom: 16 }}>
                            Thêm các section, mỗi section có thể chứa tiêu đề phụ, đoạn văn, hình ảnh, danh sách.
                        </p>
                        <BlockEditor initialSections={sections} onChange={setSections} hideAdvancedBlocks />
                    </div>

                    <div className="form-card">
                        <h3>Phân loại</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Danh mục</label>
                                <select name="categoryId" className="form-select" defaultValue={post.categoryId || ''}>
                                    <option value="">-- Chọn danh mục --</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Quốc gia</label>
                                <select name="countryId" className="form-select" defaultValue={post.countryId || ''}>
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
                                <select name="locale" className="form-select" defaultValue={post.locale || 'vi'}>
                                    <option value="vi">🇻🇳 Tiếng Việt</option>
                                    <option value="en">🇬🇧 English</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Trạng thái</label>
                                <select name="status" className="form-select" defaultValue={post.status}>
                                    <option value="DRAFT">Bản nháp (Draft)</option>
                                    <option value="PUBLISHED">Xuất bản (Published)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary" style={{ width: 'auto' }} disabled={loading}>
                            {loading ? <><span className="spinner" /> Đang lưu...</> : 'Cập nhật'}
                        </button>
                        <Link href="/admin/posts" className="btn btn-secondary">Huỷ</Link>
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
