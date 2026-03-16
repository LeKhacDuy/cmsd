export const dynamic = "force-dynamic";

import { getProgram, getServiceGroups } from '@/actions/programs';
import { getCountriesAll } from '@/actions/countries';
import { auth } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import EditProgramForm from './EditProgramForm';

export default async function EditProgramPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if ((session?.user as any)?.role !== 'ADMIN') redirect('/admin/programs');

    const { id } = await params;
    const [program, serviceGroups, countries] = await Promise.all([
        getProgram(id),
        getServiceGroups(),
        getCountriesAll(),
    ]);

    if (!program) notFound();

    return (
        <EditProgramForm
            program={program as any}
            serviceGroups={serviceGroups as any}
            countries={countries as any}
        />
    );
}
