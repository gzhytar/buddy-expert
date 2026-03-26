import { PreparationWizard } from "@/components/preparation/preparation-wizard";
import { getPreparationForUser } from "@/lib/preparation/actions";
import { getLatestReflectionLearningEchoForUser } from "@/lib/reflection/actions";
import { getRolesGroupedByPhase } from "@/lib/queries/orientation";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

export default async function PreparationDetailPage({ params }: Props) {
  const { id } = await params;
  const data = await getPreparationForUser(id);
  if (!data) notFound();

  const [roleGroups, learningEcho] = await Promise.all([
    getRolesGroupedByPhase(),
    getLatestReflectionLearningEchoForUser(),
  ]);

  return (
    <PreparationWizard
      preparationId={id}
      initial={data}
      roleGroups={roleGroups}
      learningEcho={learningEcho}
    />
  );
}
