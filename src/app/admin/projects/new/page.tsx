import { getProgramsForSelect } from '@/actions/projects';
import ProjectForm from './ProjectForm';

export default async function NewProjectPage() {
    const programs = await getProgramsForSelect();
    return <ProjectForm programs={programs} />;
}
