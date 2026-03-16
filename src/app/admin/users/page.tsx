export const dynamic = "force-dynamic";

import { getUsers } from '@/actions/users';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import UsersClient from './UsersClient';

export default async function UsersPage() {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') redirect('/admin');

    const users = await getUsers();

    return <UsersClient users={users} currentUserId={(session.user as any).id} />;
}
