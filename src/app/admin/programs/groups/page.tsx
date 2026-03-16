import { getServiceGroups } from '@/actions/programs';
import { auth } from '@/lib/auth';
import ServiceGroupsClient from './ServiceGroupsClient';

export default async function ServiceGroupsPage() {
    const [groups, session] = await Promise.all([getServiceGroups(), auth()]);
    const isAdmin = (session?.user as any)?.role === 'ADMIN';
    return <ServiceGroupsClient groups={groups as any} isAdmin={isAdmin} />;
}
