export const dynamic = "force-dynamic";

import { getPrograms } from '@/actions/programs';
import { getServiceGroups } from '@/actions/programs';
import { getCountriesAll } from '@/actions/countries';
import { auth } from '@/lib/auth';
import ProgramsClient from './ProgramsClient';

export default async function ProgramsPage() {
    const [programs, serviceGroups, countries, session] = await Promise.all([
        getPrograms(),
        getServiceGroups(),
        getCountriesAll(),
        auth(),
    ]);
    const isAdmin = (session?.user as any)?.role === 'ADMIN';

    return <ProgramsClient programs={programs as any} serviceGroups={serviceGroups as any} countries={countries as any} isAdmin={isAdmin} />;
}
