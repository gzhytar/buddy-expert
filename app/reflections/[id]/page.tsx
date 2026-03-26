import { ReflectionReadOnly } from "@/components/reflection/reflection-readonly";
import { ReflectionWizard } from "@/components/reflection/reflection-wizard";
import { getReflectionForUser } from "@/lib/reflection/actions";
import { listWaitingPreparationsForUser } from "@/lib/preparation/actions";
import {
  getPrinciplesOrdered,
  getRolesGroupedByPhase,
} from "@/lib/queries/orientation";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

export default async function ReflectionDetailPage({ params }: Props) {
  const { id } = await params;
  const data = await getReflectionForUser(id);
  if (!data) notFound();

  const principles = await getPrinciplesOrdered();
  const roleGroups = await getRolesGroupedByPhase();

  const waitingPreparations =
    data.session.status === "draft" && !data.session.preparationId
      ? await listWaitingPreparationsForUser()
      : [];

  if (data.session.status === "complete") {
    return (
      <ReflectionReadOnly
        data={data}
        principles={principles}
        roleGroups={roleGroups}
      />
    );
  }

  return (
    <ReflectionWizard
      reflectionId={id}
      initial={data}
      principles={principles}
      roleGroups={roleGroups}
      waitingPreparations={waitingPreparations}
    />
  );
}
