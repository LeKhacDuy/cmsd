export const dynamic = "force-dynamic";

import { getConsultations, getConsultationStats } from '@/actions/consultations';
import ConsultationsClient from './ConsultationsClient';

export default async function ConsultationsPage() {
    const [consultations, stats] = await Promise.all([
        getConsultations(),
        getConsultationStats(),
    ]);

    return <ConsultationsClient consultations={consultations as any} stats={stats} />;
}
