"use client";

import {
  completePreparation,
  savePreparationDraft,
  type PreparationDetail,
} from "@/lib/preparation/actions";
import {
  PreparationReflectiveQuestionsPanel,
  type PreparationReflectiveGeneratePayload,
} from "@/components/preparation/preparation-reflective-questions-panel";
import { parsePreparationAssistantState } from "@/lib/preparation/preparation-assistant-state";
import type { ReflectionLearningEcho } from "@/lib/reflection/actions";
import { LastReflectionLearningEcho } from "@/components/preparation/last-reflection-learning-echo";
import type { RolePhaseGroup } from "@/lib/queries/orientation-types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { DatetimeLocalInput } from "@/components/ui/datetime-local-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  PreparationSelfEvalContextHint,
  type PreparationRoleSelfEvalSnapshot,
} from "@/components/preparation/preparation-self-eval-context-hint";
import { RoleSelector } from "@/components/roles/role-selector";
import {
  isoFromDatetimeLocalInput,
  toDatetimeLocalValue,
} from "@/lib/datetime-local";

const STEPS = ["Konzultace", "Role", "Záměr"] as const;

type Props = {
  preparationId: string;
  initial: PreparationDetail;
  roleGroups: RolePhaseGroup[];
  learningEcho: ReflectionLearningEcho | null;
  /** Souhrn sebeohodnocení rolí; null pokud nepřihlášen (nemělo by nastat). */
  roleSelfEval: PreparationRoleSelfEvalSnapshot | null;
};

export function PreparationWizard({
  preparationId,
  initial,
  roleGroups,
  learningEcho,
  roleSelfEval,
}: Props) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const [consultationLabel, setConsultationLabel] = useState(
    initial.session.consultationLabel ?? "",
  );
  const [occurredAtLocal, setOccurredAtLocal] = useState(
    toDatetimeLocalValue(initial.session.occurredAt),
  );
  const [polarityByRole, setPolarityByRole] = useState<
    Record<string, "strengthen" | "downregulate">
  >(() => {
    const m: Record<string, "strengthen" | "downregulate"> = {};
    for (const r of initial.roles) {
      m[r.roleId] = r.type;
    }
    return m;
  });
  const [focusNote, setFocusNote] = useState(initial.session.focusNote ?? "");

  const setPolarity = (
    roleId: string,
    polarity: "strengthen" | "downregulate" | null,
  ) => {
    setPolarityByRole((prev) => {
      const next = { ...prev };
      if (polarity == null) delete next[roleId];
      else next[roleId] = polarity;
      return next;
    });
  };

  const rolesPayload = useCallback(() => {
    return Object.entries(polarityByRole).map(([roleId, type]) => ({
      roleId,
      type,
    }));
  }, [polarityByRole]);

  const initialPrepAssistant = useMemo(
    () =>
      parsePreparationAssistantState(
        initial.session.preparationAssistantState,
      ),
    [initial.session.preparationAssistantState],
  );

  const assistantPanelKey = useMemo(
    () =>
      `${preparationId}-${initial.session.preparationAssistantState ?? ""}`,
    [preparationId, initial.session.preparationAssistantState],
  );

  const getAssistantGeneratePayload =
    useCallback((): PreparationReflectiveGeneratePayload => {
      return {
        roles: rolesPayload(),
        consultationLabel: consultationLabel.trim() || undefined,
        occurredAt: isoFromDatetimeLocalInput(occurredAtLocal),
      };
    }, [occurredAtLocal, consultationLabel, rolesPayload]);

  const buildPayload = useCallback(() => {
    const occurredAt = isoFromDatetimeLocalInput(occurredAtLocal);
    return {
      id: preparationId,
      consultationLabel: consultationLabel.trim() || undefined,
      occurredAt,
      focusNote: focusNote.trim() || undefined,
      roles: rolesPayload(),
    };
  }, [
    preparationId,
    consultationLabel,
    occurredAtLocal,
    focusNote,
    rolesPayload,
  ]);

  const saveDraft = useCallback(() => {
    return savePreparationDraft(buildPayload());
  }, [buildPayload]);

  const goNext = () => {
    setError(null);
    startTransition(async () => {
      const res = await saveDraft();
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
    });
  };

  const goBack = () => {
    setError(null);
    startTransition(async () => {
      await saveDraft();
      setStep((s) => Math.max(s - 1, 0));
    });
  };

  const onSaveDraftClick = () => {
    setError(null);
    startTransition(async () => {
      const res = await saveDraft();
      if (!res.ok) setError(res.error);
      else router.refresh();
    });
  };

  const onComplete = () => {
    setError(null);
    startTransition(async () => {
      const base = buildPayload();
      const res = await completePreparation({
        ...base,
        roles: base.roles ?? [],
      });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      router.push("/preparations?saved=1");
      router.refresh();
    });
  };

  return (
    <div className="space-y-8">
      <nav className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/preparations">← Všechny přípravy</Link>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={pending}
          onClick={onSaveDraftClick}
        >
          Uložit rozpracované
        </Button>
      </nav>

      <header className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Připravte se na schůzku vědomě — role k posílení a tlumení, krátký
          záměr. Po schůzce můžete zahájit reflexi a porovnat plán s realitou.
        </p>
        <div className="flex flex-wrap gap-2" aria-label="Průběh">
          {STEPS.map((label, i) => (
            <span
              key={label}
              className={
                i === step
                  ? "rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground"
                  : "rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground"
              }
            >
              {i + 1}. {label}
            </span>
          ))}
        </div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Příprava před konzultací
        </h1>
      </header>

      {learningEcho ? (
        <LastReflectionLearningEcho echo={learningEcho} />
      ) : null}

      {error ? (
        <p
          className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <section
        className="animate-step-in space-y-6"
        aria-live="polite"
        aria-label={STEPS[step]}
      >
        {(step === 0 || step === 2) && roleSelfEval ? (
          <PreparationSelfEvalContextHint roleSelfEval={roleSelfEval} />
        ) : null}

        {step === 0 ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prep-label">Název konzultace</Label>
              <Input
                id="prep-label"
                value={consultationLabel}
                onChange={(e) => setConsultationLabel(e.target.value)}
                placeholder="např. Acme — workshop k cenotvorbě"
                maxLength={200}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prep-when">Plánovaný čas</Label>
              <DatetimeLocalInput
                id="prep-when"
                value={occurredAtLocal}
                onChange={(e) => setOccurredAtLocal(e.target.value)}
              />
            </div>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              U každé role zaškrtněte výběr a zvolte, zda ji chcete{" "}
              <strong className="text-foreground">posílit</strong>, nebo{" "}
              <strong className="text-foreground">tlumit</strong> (nepřepálit).
            </p>
            <RoleSelector
              mode="preparation"
              roleGroups={roleGroups}
              polarityByRole={polarityByRole}
              onSetPolarity={setPolarity}
              focusPartition={
                roleSelfEval != null &&
                roleSelfEval.isComplete &&
                roleSelfEval.focusRoleIds.length > 0
                  ? { focusRoleIds: roleSelfEval.focusRoleIds }
                  : undefined
              }
            />
            <p className="text-center text-xs text-muted-foreground">
              <Link
                href="/orientation/roles"
                className="text-primary underline-offset-4 hover:underline"
              >
                Upravit sebeohodnocení rolí v orientaci
              </Link>
            </p>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Krátký behaviorální záměr nebo varování pro sebe — uvidíte ho znovu
              při reflexi.
            </p>
            <PreparationReflectiveQuestionsPanel
              key={assistantPanelKey}
              preparationId={preparationId}
              initialAssistant={initialPrepAssistant}
              roleCount={Object.keys(polarityByRole).length}
              saveDraft={saveDraft}
              getGeneratePayload={getAssistantGeneratePayload}
              focusNote={focusNote}
              onFocusNoteChange={setFocusNote}
            />
            <div className="space-y-2">
              <Label htmlFor="prep-focus">Záměr / fokus</Label>
              <Textarea
                id="prep-focus"
                value={focusNote}
                onChange={(e) => setFocusNote(e.target.value)}
                placeholder="Např. nechat klienta doříct diagnózu, ne skákat do řešení…"
                maxLength={4000}
                rows={6}
              />
            </div>
          </div>
        ) : null}
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
        <Button
          type="button"
          variant="ghost"
          disabled={pending || step === 0}
          onClick={goBack}
        >
          Zpět
        </Button>
        <div className="flex gap-2">
          {step < STEPS.length - 1 ? (
            <Button type="button" disabled={pending} onClick={goNext}>
              {pending ? "Ukládání…" : "Další"}
            </Button>
          ) : (
            <Button type="button" disabled={pending} onClick={onComplete}>
              {pending ? "Ukládání…" : "Dokončit přípravu"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
