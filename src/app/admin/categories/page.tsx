export const dynamic = "force-dynamic";

import { getCategoriesAll, deleteCategory } from '@/actions/categories';
import { auth } from '@/lib/auth';
import CategoriesClient from './CategoriesClient';

export default async function CategoriesPage() {
    const session = await auth();
    const isAdmin = session?.user?.role === 'ADMIN';
    const categories = await getCategoriesAll();

    return <CategoriesClient categories={categories} isAdmin={isAdmin} />;
}
