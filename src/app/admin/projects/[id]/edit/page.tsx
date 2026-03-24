export const dynamic = "force-dynamic";

import { getProjectById, getProgramsForSelect } from '@/actions/projects';
import { notFound } from 'next/navigation';
import EditProjectForm from './EditProjectForm';

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const [project, programs] = await Promise.all([
        getProjectById(id),
        getProgramsForSelect()
    ]);

    if (!project) notFound();

    return <EditProjectForm project={project} programs={programs} />;
}
