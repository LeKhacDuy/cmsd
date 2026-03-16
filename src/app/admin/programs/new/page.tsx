import { getServiceGroups } from '@/actions/programs';
import { getCountriesAll } from '@/actions/countries';
import ProgramForm from './ProgramForm';

export default async function NewProgramPage() {
    const [serviceGroups, countries] = await Promise.all([
        getServiceGroups(),
        getCountriesAll(),
    ]);

    return <ProgramForm serviceGroups={serviceGroups as any} countries={countries as any} />;
}
