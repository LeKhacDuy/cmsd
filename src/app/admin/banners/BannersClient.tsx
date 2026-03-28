'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
    createBanner,
    updateBanner,
    deleteBanner,
    addBannerImage,
    updateBannerImage,
    deleteBannerImage,
} from '@/actions/banners';
import {
    HiOutlinePlus,
    HiOutlineTrash,
    HiOutlinePencil,
    HiOutlinePhoto,
    HiOutlineCheckCircle,
    HiOutlineXCircle,
    HiOutlineArrowUpTray,
    HiOutlineLink,
    HiOutlineChevronDown,
    HiOutlineChevronRight,
} from 'react-icons/hi2';

type BannerImage = {
    id: string;
    url: string;
    title: string | null;
    titleEn: string | null;
    link: string | null;
    sortOrder: number;
    isActive: boolean;
};

type Banner = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    isActive: boolean;
    images: BannerImage[];
    _count: { images: number };
};

export default function BannersClient({ banners, isAdmin }: { banners: Banner[]; isAdmin: boolean }) {
    const router = useRouter();
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [expandedBanner, setExpandedBanner] = useState<string | null>(null);
    const [editingBanner, setEditingBanner] = useState<string | null>(null);
    const [editingImage, setEditingImage] = useState<string | null>(null);
    const [uploading, setUploading] = useState<string | null>(null);
    const [toast, setToast] = useState<{ type: string; message: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

    const showToast = (type: string, message: string) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3000);
    };

    const handleCreateBanner = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const fd = new FormData(e.currentTarget);
            await createBanner(fd);
            setShowCreateForm(false);
            (e.target as HTMLFormElement).reset();
            router.refresh();
            showToast('success', 'Đã tạo banner!');
        } catch {
            showToast('error', 'Lỗi khi tạo banner');
        }
        setLoading(false);
    };

    const handleUpdateBanner = async (e: React.FormEvent<HTMLFormElement>, id: string) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        try {
            await updateBanner(id, fd);
            setEditingBanner(null);
            router.refresh();
            showToast('success', 'Đã cập nhật banner!');
        } catch {
            showToast('error', 'Lỗi khi cập nhật');
        }
    };

    const handleDeleteBanner = async (id: string, name: string) => {
        if (!confirm(`Xoá banner "${name}"? Toàn bộ ảnh bên trong sẽ bị xoá.`)) return;
        try {
            await deleteBanner(id);
            router.refresh();
            showToast('success', 'Đã xoá banner!');
        } catch {
            showToast('error', 'Lỗi khi xoá');
        }
    };

    const handleUploadImage = async (bannerId: string, file: File) => {
        setUploading(bannerId);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const data = await res.json();
            if (!data.url) throw new Error('Upload failed');

            await addBannerImage(bannerId, { url: data.url, sortOrder: 0 });
            router.refresh();
            showToast('success', 'Đã tải ảnh lên!');
        } catch {
            showToast('error', 'Lỗi khi tải ảnh lên');
        }
        setUploading(null);
    };

    const handleUpdateImage = async (e: React.FormEvent<HTMLFormElement>, imageId: string) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        try {
            await updateBannerImage(imageId, {
                title: fd.get('title') as string,
                titleEn: fd.get('titleEn') as string,
                link: fd.get('link') as string,
                sortOrder: parseInt(fd.get('sortOrder') as string) || 0,
            });
            setEditingImage(null);
            router.refresh();
            showToast('success', 'Đã cập nhật ảnh!');
        } catch {
            showToast('error', 'Lỗi khi cập nhật');
        }
    };

    const handleDeleteImage = async (id: string) => {
        if (!confirm('Xoá ảnh này?')) return;
        try {
            await deleteBannerImage(id);
            router.refresh();
            showToast('success', 'Đã xoá ảnh!');
        } catch {
            showToast('error', 'Lỗi khi xoá ảnh');
        }
    };

    const handleToggleImageActive = async (img: BannerImage) => {
        try {
            await updateBannerImage(img.id, { isActive: !img.isActive });
            router.refresh();
        } catch {
            showToast('error', 'Lỗi khi cập nhật');
        }
    };

    return (
        <>
            {/* Header */}
            <div className="admin-header">
                <h1>Quản lý Banner</h1>
                <div className="admin-header-actions">
                    <button className="btn btn-primary" style={{ width: 'auto' }} onClick={() => setShowCreateForm(!showCreateForm)}>
                        <HiOutlinePlus /> Tạo banner mới
                    </button>
                </div>
            </div>

            <div className="admin-content">
                {/* Create Form */}
                {showCreateForm && (
                    <div className="form-card" style={{ marginBottom: 24 }}>
                        <h3>Tạo banner mới</h3>
                        <form onSubmit={handleCreateBanner}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Tên banner *</label>
                                    <input type="text" name="name" className="form-input" placeholder="VD: Banner trang chủ" required />
                                </div>
                                <div className="form-group">
                                    <label>Mô tả</label>
                                    <input type="text" name="description" className="form-input" placeholder="Mô tả ngắn..." />
                                </div>
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="btn btn-primary" style={{ width: 'auto' }} disabled={loading}>
                                    {loading ? 'Đang tạo...' : 'Tạo banner'}
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateForm(false)}>Huỷ</button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Banners List */}
                {banners.length === 0 ? (
                    <div className="empty-state">
                        <HiOutlinePhoto style={{ fontSize: 48, color: 'var(--text-muted)', display: 'block', margin: '0 auto 16px' }} />
                        <h3>Chưa có banner nào</h3>
                        <p>Tạo banner đầu tiên để quản lý ảnh hiển thị trên website</p>
                        <button className="btn btn-primary" style={{ width: 'auto', display: 'inline-flex' }} onClick={() => setShowCreateForm(true)}>
                            <HiOutlinePlus /> Tạo banner
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {banners.map((banner) => (
                            <div key={banner.id} className="form-card" style={{ padding: 0, overflow: 'hidden' }}>
                                {/* Banner Header */}
                                <div
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px',
                                        cursor: 'pointer', borderBottom: expandedBanner === banner.id ? '1px solid var(--border)' : 'none',
                                        background: expandedBanner === banner.id ? 'var(--bg-secondary)' : 'transparent',
                                    }}
                                    onClick={() => setExpandedBanner(expandedBanner === banner.id ? null : banner.id)}
                                >
                                    <span style={{ color: 'var(--text-muted)', fontSize: 18 }}>
                                        {expandedBanner === banner.id ? <HiOutlineChevronDown /> : <HiOutlineChevronRight />}
                                    </span>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600, fontSize: 15 }}>{banner.name}</div>
                                        {banner.description && <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{banner.description}</div>}
                                    </div>
                                    <span style={{ fontSize: 13, color: 'var(--text-muted)', marginRight: 8 }}>
                                        {banner._count.images} ảnh
                                    </span>
                                    <span className={`badge ${banner.isActive ? 'badge-published' : 'badge-draft'}`}>
                                        {banner.isActive ? 'Đang bật' : 'Đang tắt'}
                                    </span>

                                    {/* Banner Actions */}
                                    <div style={{ display: 'flex', gap: 4 }} onClick={(e) => e.stopPropagation()}>
                                        <button
                                            className="btn btn-icon" title="Sửa banner"
                                            onClick={() => setEditingBanner(editingBanner === banner.id ? null : banner.id)}
                                        >
                                            <HiOutlinePencil />
                                        </button>
                                        {isAdmin && (
                                            <button
                                                className="btn btn-icon" title="Xoá banner"
                                                style={{ color: 'var(--danger)' }}
                                                onClick={() => handleDeleteBanner(banner.id, banner.name)}
                                            >
                                                <HiOutlineTrash />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Edit Banner Form */}
                                {editingBanner === banner.id && (
                                    <div style={{ padding: '16px 20px', background: '#fafbff', borderBottom: '1px solid var(--border)' }}>
                                        <form onSubmit={(e) => handleUpdateBanner(e, banner.id)}>
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>Tên banner <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400 }}>(không thể thay đổi)</span></label>
                                                    <input type="text" className="form-input" defaultValue={banner.name} disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} />
                                                </div>
                                                <div className="form-group">
                                                    <label>Mô tả</label>
                                                    <input type="text" name="description" className="form-input" defaultValue={banner.description || ''} />
                                                </div>
                                                <div className="form-group" style={{ maxWidth: 160 }}>
                                                    <label>Trạng thái</label>
                                                    <select name="isActive" className="form-select" defaultValue={banner.isActive ? 'true' : 'false'}>
                                                        <option value="true">Đang bật</option>
                                                        <option value="false">Đang tắt</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="form-actions">
                                                <button type="submit" className="btn btn-primary" style={{ width: 'auto' }}>Lưu</button>
                                                <button type="button" className="btn btn-secondary" onClick={() => setEditingBanner(null)}>Huỷ</button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {/* Expanded: Images */}
                                {expandedBanner === banner.id && (
                                    <div style={{ padding: '20px' }}>
                                        {/* Upload new image */}
                                        <div style={{ marginBottom: 20 }}>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                ref={(el) => { fileInputRefs.current[banner.id] = el; }}
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) handleUploadImage(banner.id, file);
                                                    e.target.value = '';
                                                }}
                                            />
                                            <button
                                                className="btn btn-secondary"
                                                style={{ width: 'auto' }}
                                                disabled={uploading === banner.id}
                                                onClick={() => fileInputRefs.current[banner.id]?.click()}
                                            >
                                                <HiOutlineArrowUpTray />
                                                {uploading === banner.id ? 'Đang tải lên...' : 'Tải ảnh lên'}
                                            </button>
                                        </div>

                                        {/* Images Grid */}
                                        {banner.images.length === 0 ? (
                                            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                                                <HiOutlinePhoto style={{ fontSize: 40, display: 'block', margin: '0 auto 8px' }} />
                                                <p style={{ margin: 0 }}>Chưa có ảnh nào. Tải ảnh đầu tiên lên!</p>
                                            </div>
                                        ) : (
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
                                                {banner.images.map((img) => (
                                                    <div
                                                        key={img.id}
                                                        style={{
                                                            border: '1px solid var(--border)',
                                                            borderRadius: 10,
                                                            overflow: 'hidden',
                                                            opacity: img.isActive ? 1 : 0.55,
                                                        }}
                                                    >
                                                        <div style={{ position: 'relative' }}>
                                                            <img
                                                                src={img.url}
                                                                alt={img.title || ''}
                                                                style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }}
                                                            />
                                                            {!img.isActive && (
                                                                <div style={{
                                                                    position: 'absolute', top: 8, left: 8,
                                                                    background: 'rgba(0,0,0,0.6)', color: '#fff',
                                                                    fontSize: 11, padding: '2px 8px', borderRadius: 12,
                                                                }}>
                                                                    Đang tắt
                                                                </div>
                                                            )}
                                                        </div>

                                                        {editingImage === img.id ? (
                                                            <form onSubmit={(e) => handleUpdateImage(e, img.id)} style={{ padding: 12 }}>
                                                                <div className="form-group" style={{ marginBottom: 8 }}>
                                                                    <label style={{ fontSize: 12 }}>Tiêu đề (Việt)</label>
                                                                    <input type="text" name="title" className="form-input" defaultValue={img.title || ''} placeholder="Tiêu đề tiếng Việt" style={{ padding: '6px 10px', fontSize: 13 }} />
                                                                </div>
                                                                <div className="form-group" style={{ marginBottom: 8 }}>
                                                                    <label style={{ fontSize: 12 }}>Tiêu đề (English)</label>
                                                                    <input type="text" name="titleEn" className="form-input" defaultValue={img.titleEn || ''} placeholder="English title" style={{ padding: '6px 10px', fontSize: 13 }} />
                                                                </div>
                                                                <div className="form-group" style={{ marginBottom: 8 }}>
                                                                    <label style={{ fontSize: 12 }}>Link khi click</label>
                                                                    <input type="text" name="link" className="form-input" defaultValue={img.link || ''} placeholder="https://..." style={{ padding: '6px 10px', fontSize: 13 }} />
                                                                </div>
                                                                <div className="form-group" style={{ marginBottom: 12 }}>
                                                                    <label style={{ fontSize: 12 }}>Thứ tự</label>
                                                                    <input type="number" name="sortOrder" className="form-input" defaultValue={img.sortOrder} style={{ padding: '6px 10px', fontSize: 13 }} />
                                                                </div>
                                                                <div style={{ display: 'flex', gap: 8 }}>
                                                                    <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '6px 0', fontSize: 13 }}>Lưu</button>
                                                                    <button type="button" className="btn btn-secondary" style={{ flex: 1, padding: '6px 0', fontSize: 13 }} onClick={() => setEditingImage(null)}>Huỷ</button>
                                                                </div>
                                                            </form>
                                                        ) : (
                                                            <div style={{ padding: '10px 12px' }}>
                                                                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, minHeight: 20 }}>
                                                                    {img.title || <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>Chưa có tiêu đề</span>}
                                                                </div>
                                                                {img.link && (
                                                                    <div style={{ fontSize: 12, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                        <HiOutlineLink /> {img.link}
                                                                    </div>
                                                                )}
                                                                <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                                                                    <button className="btn btn-icon" title="Sửa" onClick={() => setEditingImage(img.id)}>
                                                                        <HiOutlinePencil />
                                                                    </button>
                                                                    <button
                                                                        className="btn btn-icon"
                                                                        title={img.isActive ? 'Tắt ảnh' : 'Bật ảnh'}
                                                                        onClick={() => handleToggleImageActive(img)}
                                                                    >
                                                                        {img.isActive ? <HiOutlineCheckCircle style={{ color: 'var(--success)' }} /> : <HiOutlineXCircle style={{ color: 'var(--text-muted)' }} />}
                                                                    </button>
                                                                    {isAdmin && (
                                                                        <button className="btn btn-icon" title="Xoá ảnh" style={{ color: 'var(--danger)', marginLeft: 'auto' }} onClick={() => handleDeleteImage(img.id)}>
                                                                            <HiOutlineTrash />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {toast && (
                <div className={`toast toast-${toast.type}`}>{toast.message}</div>
            )}
        </>
    );
}
