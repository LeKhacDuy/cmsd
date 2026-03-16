export const dynamic = "force-dynamic";

import { getProjects, getProgramsForSelect } from '@/actions/projects';
import ProjectsClient from './ProjectsClient';

export default async function ProjectsPage({
    searchParams,
}: {
    searchParams: { search?: string; programId?: string };
}) {
    const projects = await getProjects({
        search: searchParams.search,
        programId: searchParams.programId,
    });
    const programs = await getProgramsForSelect();

    return <ProjectsClient projects={projects} programs={programs} />;
}
