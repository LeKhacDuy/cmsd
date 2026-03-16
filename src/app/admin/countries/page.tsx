export const dynamic = "force-dynamic";

import { getCountriesAll } from '@/actions/countries';
import { auth } from '@/lib/auth';
import CountriesClient from './CountriesClient';

export default async function CountriesPage() {
    const session = await auth();
    const isAdmin = session?.user?.role === 'ADMIN';
    const countries = await getCountriesAll();

    return <CountriesClient countries={countries} isAdmin={isAdmin} />;
}
