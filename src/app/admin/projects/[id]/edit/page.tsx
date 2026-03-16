import { getProjectById, getProgramsForSelect } from '@/actions/projects';
import { notFound } from 'next/navigation';
import EditProjectForm from './EditProjectForm';

export default async function EditProjectPage({ params }: { params: { id: string } }) {
    const [project, programs] = await Promise.all([
        getProjectById(params.id),
        getProgramsForSelect()
    ]);

    if (!project) notFound();

    return <EditProjectForm project={project} programs={programs} />;
}
