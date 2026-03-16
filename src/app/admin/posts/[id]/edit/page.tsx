export const dynamic = "force-dynamic";

import { getPost, getCategories, getCountries } from '@/actions/posts';
import { auth } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import EditPostForm from './EditPostForm';

export default async function EditPostPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') redirect('/admin/posts');

    const { id } = await params;
    const [post, categories, countries] = await Promise.all([
        getPost(id),
        getCategories(),
        getCountries(),
    ]);

    if (!post) notFound();

    return <EditPostForm post={post} categories={categories} countries={countries} />;
}
