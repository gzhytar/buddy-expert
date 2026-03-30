import { auth } from "@/auth";
import type { PreparationRoleSelfEvalSnapshot } from "@/components/preparation/preparation-self-eval-context-hint";
import { PreparationWizard } from "@/components/preparation/preparation-wizard";
import {
  getRoleSelfEvalSummaryForUser,
  type RoleSelfEvalSummary,
} from "@/lib/orientation/role-self-eval-queries";
import { getPreparationForUser } from "@/lib/preparation/actions";
import { getLatestReflectionLearningEchoForUser } from "@/lib/reflection/actions";
import { getRolesGroupedByPhase } from "@/lib/queries/orientation";
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

export default async function PreparationDetailPage({ params }: Props) {
  const { id } = await params;
  const data = await getPreparationForUser(id);
  if (!data) notFound();

  const session = await auth();
  const userId = session?.user?.id ?? null;

  const [roleGroups, learningEcho, selfEval] = await Promise.all([
    getRolesGroupedByPhase(),
    getLatestReflectionLearningEchoForUser(),
    userId
      ? getRoleSelfEvalSummaryForUser(userId)
      : Promise.resolve(null),
  ]);

  const roleSelfEval = selfEval ? toWizardRoleSelfEval(selfEval) : null;

  return (
    <PreparationWizard
      preparationId={id}
      initial={data}
      roleGroups={roleGroups}
      learningEcho={learningEcho}
      roleSelfEval={roleSelfEval}
    />
  );
}
