'use client';

import { useState } from 'react';
import { createPost } from '@/actions/posts';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { HiOutlineArrowLeft } from 'react-icons/hi2';
import BlockEditor, { Section } from '@/components/BlockEditor';
import ImageUpload from '@/components/ImageUpload';

type Category = { id: string; name: string };
type Country = { id: string; name: string; slug: string; flagIcon: string | null };

export default function PostForm({
    categories,
    countries,
}: {
    categories: Category[];
    countries: Country[];
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ type: string; message: string } | null>(null);
    const [sections, setSections] = useState<Section[]>([]);
    const [coverImage, setCoverImage] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setToast(null);

        try {
            const formData = new FormData(e.currentTarget);
            formData.set('content', JSON.stringify(sections));
            formData.set('featuredImage', coverImage);
            await createPost(formData);
            setToast({ type: 'success', message: 'Tạo bài viết thành công!' });
            setTimeout(() => router.push('/admin/posts'), 1000);
        } catch (error) {
            setToast({ type: 'error', message: 'Lỗi khi tạo bài viết' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="admin-header">
                <h1>Tạo bài viết mới</h1>
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
                            <input type="text" name="title" className="form-input" placeholder="Nhập tiêu đề bài viết" required />
                        </div>

                        <div className="form-group">
                            <label>Mô tả ngắn (Excerpt)</label>
                            <textarea name="excerpt" className="form-textarea" placeholder="Nhập mô tả ngắn cho bài viết..." rows={3} />
                        </div>

                        <div className="form-group">
                            <label>Translation Key</label>
                            <input type="text" name="translationKey" className="form-input" placeholder="VD: us-immigration" />
                            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Nhập cùng key cho bài VI và EN để liên kết bản dịch.</span>
                        </div>
                    </div>

                    <div className="form-card">
                        <h3>Nội dung bài viết</h3>
                        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: -8, marginBottom: 16 }}>
                            Thêm các section, mỗi section có thể chứa tiêu đề phụ, đoạn văn, hình ảnh, danh sách.
                        </p>
                        <BlockEditor initialSections={[]} onChange={setSections} hideAdvancedBlocks />
                    </div>

                    <div className="form-card">
                        <h3>Phân loại</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Danh mục</label>
                                <select name="categoryId" className="form-select">
                                    <option value="">-- Chọn danh mục --</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Quốc gia</label>
                                <select name="countryId" className="form-select">
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
                                <select name="locale" className="form-select" defaultValue="vi">
                                    <option value="vi">🇻🇳 Tiếng Việt</option>
                                    <option value="en">🇬🇧 English</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Trạng thái</label>
                                <select name="status" className="form-select">
                                    <option value="DRAFT">Bản nháp (Draft)</option>
                                    <option value="PUBLISHED">Xuất bản (Published)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary" style={{ width: 'auto' }} disabled={loading}>
                            {loading ? <><span className="spinner" /> Đang lưu...</> : 'Tạo bài viết'}
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
