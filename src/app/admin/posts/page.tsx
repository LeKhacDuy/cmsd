export const dynamic = "force-dynamic";

import { getPosts, getCategories, getCountries, deletePost } from '@/actions/posts';
import { auth } from '@/lib/auth';
import Link from 'next/link';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineNewspaper } from 'react-icons/hi2';
import DeletePostButton from './DeletePostButton';

export default async function PostsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
    const params = await searchParams;
    const session = await auth();
    const isAdmin = session?.user?.role === 'ADMIN';

    const [{ posts, total, totalPages, currentPage }, categories, countries] = await Promise.all([
        getPosts({
            search: params.search,
            categoryId: params.categoryId,
            countryId: params.countryId,
            status: params.status,
            page: params.page ? parseInt(params.page) : 1,
        }),
        getCategories(),
        getCountries(),
    ]);

    return (
        <>
            <div className="admin-header">
                <h1>Tin tức / Sự kiện</h1>
                <div className="admin-header-actions">
                    <Link href="/admin/posts/new" className="btn btn-primary" style={{ width: 'auto' }}>
                        <HiOutlinePlus /> Tạo bài viết
                    </Link>
                </div>
            </div>

            <div className="admin-content">
                <div className="data-table-container">
                    <div className="data-table-header">
                        <div className="data-table-search">
                            <form method="GET" className="data-table-search" style={{ display: 'contents' }}>
                                <div className="search-wrapper">
                                    <input
                                        type="text"
                                        name="search"
                                        className="search-input"
                                        placeholder="Tìm kiếm bài viết..."
                                        defaultValue={params.search || ''}
                                    />
                                </div>
                                <select name="categoryId" className="filter-select" defaultValue={params.categoryId || ''}>
                                    <option value="">Tất cả danh mục</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                <select name="countryId" className="filter-select" defaultValue={params.countryId || ''}>
                                    <option value="">Tất cả quốc gia</option>
                                    {countries.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                <select name="status" className="filter-select" defaultValue={params.status || ''}>
                                    <option value="">Tất cả trạng thái</option>
                                    <option value="PUBLISHED">Published</option>
                                    <option value="DRAFT">Draft</option>
                                </select>
                                <button type="submit" className="btn btn-secondary btn-sm">Lọc</button>
                            </form>
                        </div>
                        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{total} bài viết</span>
                    </div>

                    {posts.length === 0 ? (
                        <div className="empty-state">
                            <HiOutlineNewspaper style={{ fontSize: 48, color: 'var(--text-muted)', display: 'block', margin: '0 auto 16px' }} />
                            <h3>Chưa có bài viết nào</h3>
                            <p>Bắt đầu tạo bài viết đầu tiên</p>
                            <Link href="/admin/posts/new" className="btn btn-primary" style={{ width: 'auto', display: 'inline-flex' }}>
                                <HiOutlinePlus /> Tạo bài viết
                            </Link>
                        </div>
                    ) : (
                        <>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Tiêu đề</th>
                                        <th>Danh mục</th>
                                        <th>Ngôn ngữ</th>
                                        <th>Tác giả</th>
                                        <th>Trạng thái</th>
                                        <th>Ngày tạo</th>
                                        <th>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {posts.map((post) => (
                                        <tr key={post.id}>
                                            <td className="table-title" style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {post.title}
                                            </td>
                                            <td>{post.category?.name || '—'}</td>
                                            <td>
                                                <span style={{
                                                    fontSize: 12,
                                                    fontWeight: 600,
                                                    padding: '2px 8px',
                                                    borderRadius: 12,
                                                    background: (post as any).locale === 'en' ? '#e8f4fd' : '#e8f7ee',
                                                    color: (post as any).locale === 'en' ? '#1a6fa8' : '#1a7a3f',
                                                }}>
                                                    {(post as any).locale === 'en' ? '🇬🇧 EN' : '🇻🇳 VI'}
                                                </span>
                                            </td>
                                            <td>{post.author.name}</td>
                                            <td>
                                                <span className={`badge ${post.status === 'PUBLISHED' ? 'badge-published' : 'badge-draft'}`}>
                                                    {post.status === 'PUBLISHED' ? 'Published' : 'Draft'}
                                                </span>
                                            </td>
                                            <td>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</td>
                                            <td>
                                                <div className="table-actions">
                                                    <Link href={`/admin/posts/${post.id}/edit`} className="btn btn-icon" title="Sửa">
                                                        <HiOutlinePencil />
                                                    </Link>
                                                    {isAdmin && (
                                                        <DeletePostButton postId={post.id} postTitle={post.title} />
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {totalPages > 1 && (
                                <div className="pagination">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <Link
                                            key={page}
                                            href={`/admin/posts?page=${page}${params.search ? `&search=${params.search}` : ''}${params.categoryId ? `&categoryId=${params.categoryId}` : ''}${params.countryId ? `&countryId=${params.countryId}` : ''}${params.status ? `&status=${params.status}` : ''}`}
                                            className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                                        >
                                            {page}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
