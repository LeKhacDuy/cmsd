export const dynamic = "force-dynamic";

import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function MediaPage() {
    return (
        <>
            <div className="admin-header">
                <h1>Media Library</h1>
            </div>
            <div className="admin-content">
                <div className="data-table-container">
                    <div className="empty-state">
                        <div style={{ fontSize: 48, color: 'var(--text-muted)', marginBottom: 16 }}>📁</div>
                        <h3>Media Library</h3>
                        <p>Chức năng upload media sẽ được phát triển tiếp theo.</p>
                        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Hiện tại bạn có thể dùng URL ảnh bên ngoài khi tạo bài viết.</p>
                    </div>
                </div>
            </div>
        </>
    );
}
