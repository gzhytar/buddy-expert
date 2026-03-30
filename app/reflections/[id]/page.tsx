import { auth } from "@/auth";
import type { PreparationRoleSelfEvalSnapshot } from "@/components/preparation/preparation-self-eval-context-hint";
import { ReflectionReadOnly } from "@/components/reflection/reflection-readonly";
import { ReflectionWizard } from "@/components/reflection/reflection-wizard";
import {
  getRoleSelfEvalSummaryForUser,
  type RoleSelfEvalSummary,
} from "@/lib/orientation/role-self-eval-queries";
import { listWaitingPreparationsForUser } from "@/lib/preparation/actions";
import { getReflectionForUser } from "@/lib/reflection/actions";
import {
  getPrinciplesOrdered,
  getRolesGroupedByPhase,
} from "@/lib/queries/orientation";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

function toWizardRoleSelfEval(
  summary: RoleSelfEvalSummary,
): PreparationRoleSelfEvalSnapshot {
  return {
    isComplete: summary.isComplete,
    focusRoleIds: summary.focusRoleIds,
    focusRoleNames: summary.focusRoleNames,
  };
}

export default async function ReflectionDetailPage({ params }: Props) {
  const { id } = await params;
  const data = await getReflectionForUser(id);
  if (!data) notFound();

  const session = await auth();
  const userId = session?.user?.id ?? null;

  const [principles, roleGroups, selfEval] = await Promise.all([
    getPrinciplesOrdered(),
    getRolesGroupedByPhase(),
    userId
      ? getRoleSelfEvalSummaryForUser(userId)
      : Promise.resolve(null),
  ]);

  const roleSelfEval = selfEval ? toWizardRoleSelfEval(selfEval) : null;

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
      roleSelfEval={roleSelfEval}
      waitingPreparations={waitingPreparations}
    />
  );
}
