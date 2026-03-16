import { getBanners } from '@/actions/banners';
import { auth } from '@/lib/auth';
import BannersClient from './BannersClient';

export default async function BannersPage() {
    const [banners, session] = await Promise.all([getBanners(), auth()]);
    const isAdmin = (session?.user as any)?.role === 'ADMIN';

    return <BannersClient banners={banners as any} isAdmin={isAdmin} />;
}
