'use client';

import { useState } from 'react';
import { deletePost } from '@/actions/posts';
import { useRouter } from 'next/navigation';
import { HiOutlineTrash } from 'react-icons/hi2';

export default function DeletePostButton({ postId, postTitle }: { postId: string; postTitle: string }) {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        setLoading(true);
        try {
            await deletePost(postId);
            setShowModal(false);
            router.refresh();
        } catch (error) {
            alert('Lỗi khi xoá bài viết');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button className="btn btn-icon" title="Xoá" onClick={() => setShowModal(true)} style={{ color: 'var(--danger)' }}>
                <HiOutlineTrash />
            </button>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Xoá bài viết</h3>
                        <p>Bạn có chắc chắn muốn xoá bài viết &quot;{postTitle}&quot;? Hành động này không thể hoàn tác.</p>
                        <div className="modal-actions">
                            <button className="btn btn-secondary" onClick={() => setShowModal(false)} disabled={loading}>
                                Huỷ
                            </button>
                            <button className="btn btn-danger" onClick={handleDelete} disabled={loading}>
                                {loading ? <><span className="spinner" /> Đang xoá...</> : 'Xoá'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
