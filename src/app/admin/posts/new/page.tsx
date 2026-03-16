import { getCategories, getCountries } from '@/actions/posts';
import PostForm from './PostForm';

export default async function NewPostPage() {
    const [categories, countries] = await Promise.all([
        getCategories(),
        getCountries(),
    ]);

    return <PostForm categories={categories} countries={countries} />;
}
