import prisma from '@/lib/prisma';
import { HiOutlineNewspaper, HiOutlineFolder, HiOutlineGlobeAlt, HiOutlineUsers } from 'react-icons/hi2';

async function getStats() {
    const [postsCount, categoriesCount, countriesCount, usersCount, recentPosts] = await Promise.all([
        prisma.post.count(),
        prisma.category.count(),
        prisma.country.count(),
        prisma.user.count(),
        prisma.post.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { author: true, category: true, country: true },
        }),
    ]);

    return { postsCount, categoriesCount, countriesCount, usersCount, recentPosts };
}

export default async function DashboardPage() {
    const stats = await getStats();

    return (
        <>
            <div className="admin-header">
                <h1>Dashboard</h1>
            </div>
            <div className="admin-content">
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-card-header">
                            <div className="stat-card-icon purple"><HiOutlineNewspaper /></div>
                        </div>
                        <div className="stat-card-label">Bài viết</div>
                        <div className="stat-card-value">{stats.postsCount}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-header">
                            <div className="stat-card-icon green"><HiOutlineFolder /></div>
                        </div>
                        <div className="stat-card-label">Danh mục</div>
                        <div className="stat-card-value">{stats.categoriesCount}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-header">
                            <div className="stat-card-icon blue"><HiOutlineGlobeAlt /></div>
                        </div>
                        <div className="stat-card-label">Quốc gia</div>
                        <div className="stat-card-value">{stats.countriesCount}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-header">
                            <div className="stat-card-icon orange"><HiOutlineUsers /></div>
                        </div>
                        <div className="stat-card-label">Người dùng</div>
                        <div className="stat-card-value">{stats.usersCount}</div>
                    </div>
                </div>

                <div className="data-table-container">
                    <div className="data-table-header">
                        <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Bài viết gần đây</h3>
                    </div>
                    {stats.recentPosts.length === 0 ? (
                        <div className="empty-state">
                            <HiOutlineNewspaper style={{ fontSize: 48, color: 'var(--text-muted)' }} />
                            <h3>Chưa có bài viết nào</h3>
                            <p>Bắt đầu tạo bài viết đầu tiên</p>
                        </div>
                    ) : (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Tiêu đề</th>
                                    <th>Danh mục</th>
                                    <th>Quốc gia</th>
                                    <th>Trạng thái</th>
                                    <th>Ngày tạo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentPosts.map((post) => (
                                    <tr key={post.id}>
                                        <td className="table-title">{post.title}</td>
                                        <td>{post.category?.name || '—'}</td>
                                        <td>{post.country?.name || '—'}</td>
                                        <td>
                                            <span className={`badge ${post.status === 'PUBLISHED' ? 'badge-published' : 'badge-draft'}`}>
                                                {post.status === 'PUBLISHED' ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                        <td>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</td>
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
