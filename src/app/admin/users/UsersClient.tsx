'use client';

import { useState } from 'react';
import { deleteUser } from '@/actions/users';
import { useRouter } from 'next/navigation';
import { HiOutlineTrash } from 'react-icons/hi2';

type User = {
    id: string;
    email: string;
    name: string;
    role: string;
    createdAt: Date;
};

export default function UsersClient({ users, currentUserId }: { users: User[]; currentUserId: string }) {
    const router = useRouter();

    const handleDelete = async (id: string) => {
        if (id === currentUserId) {
            alert('Không thể xoá chính mình');
            return;
        }
        if (!confirm('Bạn có chắc muốn xoá người dùng này?')) return;
        try {
            await deleteUser(id);
            router.refresh();
        } catch (err: any) {
            alert('Lỗi: ' + (err.message || 'Không thể xoá'));
        }
    };

    return (
        <>
            <div className="admin-header">
                <h1>Người dùng</h1>
            </div>

            <div className="admin-content">

                <div className="data-table-container">
                    <div className="data-table-header">
                        <h3 style={{ fontSize: 16, fontWeight: 600 }}>Tất cả người dùng</h3>
                        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{users.length} người dùng</span>
                    </div>

                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Tên</th>
                                <th>Email</th>
                                <th>Vai trò</th>
                                <th>Ngày tạo</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td className="table-title">{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`badge ${user.role === 'ADMIN' ? 'badge-admin' : 'badge-employee'}`}>
                                            {user.role === 'ADMIN' ? 'Admin' : 'Nhân viên'}
                                        </span>
                                    </td>
                                    <td>{new Date(user.createdAt).toLocaleDateString('vi-VN')}</td>
                                    <td>
                                        {user.id !== currentUserId && (
                                            <button className="btn btn-icon" onClick={() => handleDelete(user.id)} style={{ color: 'var(--danger)' }} title="Xoá">
                                                <HiOutlineTrash />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
