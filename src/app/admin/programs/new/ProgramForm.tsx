'use client';

import { useState } from 'react';
import { createProgram } from '@/actions/programs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { HiOutlineArrowLeft } from 'react-icons/hi2';
import BlockEditor, { Section } from '@/components/BlockEditor';
import ImageUpload from '@/components/ImageUpload';

type ServiceGroup = { id: string; name: string; icon: string | null };
type Country = { id: string; name: string; slug: string; flagIcon: string | null };

export default function ProgramForm({
    serviceGroups,
    countries,
}: {
    serviceGroups: ServiceGroup[];
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
            await createProgram(formData);
            setToast({ type: 'success', message: 'Tạo chương trình thành công!' });
            setTimeout(() => router.push('/admin/programs'), 1000);
        } catch {
            setToast({ type: 'error', message: 'Lỗi khi tạo chương trình' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="admin-header">
                <h1>Thêm chương trình mới</h1>
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
                            <input type="text" name="name" className="form-input" placeholder="VD: Visa EB-5" required />
                        </div>
                        <div className="form-group">
                            <label>Mô tả ngắn</label>
                            <textarea name="excerpt" className="form-textarea" placeholder="Mô tả ngắn về chương trình..." rows={3} />
                        </div>
                    </div>

                    <div className="form-card">
                        <h3>Nội dung chi tiết</h3>
                        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: -8, marginBottom: 16 }}>
                            Thêm các section cho nội dung chi tiết về chương trình.
                        </p>
                        <BlockEditor initialSections={[]} onChange={setSections} />
                    </div>

                    <div className="form-card">
                        <h3>Phân loại</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Nhóm dịch vụ *</label>
                                <select name="serviceGroupId" className="form-select" required>
                                    <option value="">-- Chọn nhóm dịch vụ --</option>
                                    {serviceGroups.map((g) => (
                                        <option key={g.id} value={g.id}>{g.icon} {g.name}</option>
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
                                    <option value="DRAFT">Bản nháp</option>
                                    <option value="PUBLISHED">Công khai</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Thứ tự hiển thị</label>
                                <input type="number" name="sortOrder" className="form-input" defaultValue={0} placeholder="0" />
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary" style={{ width: 'auto' }} disabled={loading}>
                            {loading ? <><span className="spinner" /> Đang lưu...</> : 'Tạo chương trình'}
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
