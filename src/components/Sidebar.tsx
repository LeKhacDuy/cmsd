'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import {
    HiOutlineHome,
    HiOutlineNewspaper,
    HiOutlineFolder,
    HiOutlineGlobeAlt,
    HiOutlinePhoto,
    HiOutlineUsers,
    HiOutlineCog6Tooth,
    HiOutlineArrowRightOnRectangle,
    HiOutlineBriefcase,
    HiOutlineInboxArrowDown,
    HiOutlineRectangleGroup,
} from 'react-icons/hi2';

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: HiOutlineHome },
    { href: '/admin/posts', label: 'Tin tức / Sự kiện', icon: HiOutlineNewspaper },
    { href: '/admin/programs', label: 'Chương trình định cư', icon: HiOutlineBriefcase },
    { href: '/admin/projects', label: 'Quản lý Dự án', icon: HiOutlineFolder },
    { href: '/admin/programs/groups', label: 'Nhóm Dịch vụ', icon: HiOutlineFolder },
    { href: '/admin/consultations', label: 'Yêu cầu tư vấn', icon: HiOutlineInboxArrowDown },
    { href: '/admin/banners', label: 'Quản lý Banner', icon: HiOutlineRectangleGroup },
    { href: '/admin/categories', label: 'Danh mục', icon: HiOutlineFolder },
    { href: '/admin/countries', label: 'Quốc gia', icon: HiOutlineGlobeAlt },
    { href: '/admin/media', label: 'Media', icon: HiOutlinePhoto },
];

const adminOnlyItems = [
    { href: '/admin/users', label: 'Người dùng', icon: HiOutlineUsers },
    { href: '/admin/settings', label: 'Cài đặt', icon: HiOutlineCog6Tooth },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const isAdmin = session?.user?.role === 'ADMIN';

    const isActive = (href: string) => {
        if (href === '/admin') return pathname === '/admin';
        return pathname.startsWith(href);
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <h2>D Immigration</h2>
                <span>CMS Dashboard</span>
            </div>

            <nav className="sidebar-nav">
                <div className="sidebar-section">
                    <div className="sidebar-section-title">Menu</div>
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`sidebar-link ${isActive(item.href) ? 'active' : ''}`}
                        >
                            <item.icon />
                            {item.label}
                        </Link>
                    ))}
                </div>

                {isAdmin && (
                    <div className="sidebar-section">
                        <div className="sidebar-section-title">Quản trị</div>
                        {adminOnlyItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`sidebar-link ${isActive(item.href) ? 'active' : ''}`}
                            >
                                <item.icon />
                                {item.label}
                            </Link>
                        ))}
                    </div>
                )}
            </nav>

            <div className="sidebar-footer">
                <div className="sidebar-user">
                    <div className="sidebar-user-avatar">
                        {session?.user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="sidebar-user-info">
                        <div className="sidebar-user-name">{session?.user?.name}</div>
                        <div className="sidebar-user-role">
                            {session?.user?.role === 'ADMIN' ? 'Admin' : 'Nhân viên'}
                        </div>
                    </div>
                </div>
                <button
                    className="btn-logout"
                    onClick={() => signOut({ callbackUrl: '/login' })}
                >
                    <HiOutlineArrowRightOnRectangle />
                    Đăng xuất
                </button>
            </div>
        </aside>
    );
}
