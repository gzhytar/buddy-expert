"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";

import { PrincipleIllustration } from "@/components/principles/principle-illustration";
import { OriginalIntentPanel } from "@/components/reflection/original-intent-panel";
import { ReflectionAssistantPanel } from "@/components/reflection/reflection-assistant-panel";
import {
  type PreparationRoleSelfEvalSnapshot,
} from "@/components/preparation/preparation-self-eval-context-hint";
import { RoleSelector } from "@/components/roles/role-selector";
import { Button } from "@/components/ui/button";
import { DatetimeLocalInput } from "@/components/ui/datetime-local-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Principle } from "@/lib/db/schema";
import {
  isoFromDatetimeLocalInput,
  toDatetimeLocalValue,
} from "@/lib/datetime-local";
import type { ReflectionAssistantStateV1 } from "@/lib/reflection/assistant-state";
import { RecordDeleteButton } from "@/components/records/record-delete-button";
import {
  completeReflection,
  deleteReflection,
  saveReflectionDraft,
  type ReflectionDetail,
} from "@/lib/reflection/actions";
import type { RolePhaseGroup } from "@/lib/queries/orientation-types";
import { cn } from "@/lib/utils";

const STEPS = [
  "Konzultace",
  "Konzultantské desatero",
  "Role",
  "Poznámka k učení",
] as const;

function calibrationRecordFromProposal(
  roles: {
    roleId: string;
    calibration: "underused" | "balanced" | "overused";
  }[],
): Record<string, "underused" | "balanced" | "overused"> {
  const m: Record<string, "underused" | "balanced" | "overused"> = {};
  for (const r of roles) {
    m[r.roleId] = r.calibration;
  }
  return m;
}

type WaitingPrepRow = {
  id: string;
  consultationLabel: string | null;
  updatedAt: string;
};

type Props = {
  reflectionId: string;
  initial: ReflectionDetail;
  principles: Principle[];
  roleGroups: RolePhaseGroup[];
  /** Souhrn sebeohodnocení rolí; null pokud nepřihlášen. */
  roleSelfEval: PreparationRoleSelfEvalSnapshot | null;
  waitingPreparations?: WaitingPrepRow[];
};

/**
 * Konzultace (krok 0) je zbytečná, pokud už máme název a čas z propojené přípravy.
 * Začínáme krokem 1 (Konzultantské desatero), ne 2 — jinak by expert přeskočil výběr principů
 * a dokončení by padalo na validaci „alespoň jeden princip“.
 */
function initialStepForReflection(initial: ReflectionDetail): number {
  const s = initial.session;
  if (!s.preparationId?.trim()) return 0;
  if (!(s.consultationLabel ?? "").trim()) return 0;
  if (!String(s.occurredAt ?? "").trim()) return 0;
  return 1;
}

export function ReflectionWizard({
  reflectionId,
  initial,
  principles,
  roleGroups,
  roleSelfEval,
  waitingPreparations = [],
}: Props) {
  const router = useRouter();
  const [step, setStep] = useState(() => initialStepForReflection(initial));
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const [consultationLabel, setConsultationLabel] = useState(
    initial.session.consultationLabel ?? "",
  );
  const [occurredAtLocal, setOccurredAtLocal] = useState(
    toDatetimeLocalValue(initial.session.occurredAt),
  );
  const [principleIds, setPrincipleIds] = useState<string[]>(
    initial.principleIds,
  );
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>(
    initial.roles.map((r) => r.roleId),
  );
  const [calibrationByRole, setCalibrationByRole] = useState<
    Record<string, "underused" | "balanced" | "overused">
  >(() => {
    const m: Record<string, "underused" | "balanced" | "overused"> = {};
    for (const r of initial.roles) {
      m[r.roleId] = r.calibration as "underused" | "balanced" | "overused";
    }
    return m;
  });
  const [learningNote, setLearningNote] = useState(
    initial.session.learningNote ?? "",
  );
  const [linkPreparationId, setLinkPreparationId] = useState(
    () => initial.session.preparationId ?? "",
  );
  const [assistantState, setAssistantState] =
    useState<ReflectionAssistantStateV1 | null>(
      () => initial.assistantState,
    );

  const roleNameById = Object.fromEntries(
    roleGroups.flatMap((g) => g.roles.map((r) => [r.id, r.name])),
  );

  const buildPayload = useCallback(() => {
    const occurredAt = isoFromDatetimeLocalInput(occurredAtLocal);
    const roles = selectedRoleIds.map((roleId) => ({
      roleId,
      calibration: calibrationByRole[roleId] ?? "balanced",
    }));
    return {
      id: reflectionId,
      preparationId: linkPreparationId.trim() || undefined,
      consultationLabel: consultationLabel.trim() || undefined,
      occurredAt,
      principleIds,
      roles,
      learningNote: learningNote.trim() || undefined,
      ...(assistantState ? { assistantState } : {}),
    };
  }, [
    reflectionId,
    linkPreparationId,
    consultationLabel,
    occurredAtLocal,
    principleIds,
    selectedRoleIds,
    calibrationByRole,
    learningNote,
    assistantState,
  ]);

  const saveDraft = useCallback(() => {
    return saveReflectionDraft(buildPayload());
  }, [buildPayload]);

  const applyAssistantProposal = useCallback(
    (p: {
      principleIds: string[];
      roles: {
        roleId: string;
        calibration: "underused" | "balanced" | "overused";
      }[];
      learningNote: string;
    }) => {
      setPrincipleIds(p.principleIds);
      setSelectedRoleIds(p.roles.map((r) => r.roleId));
      setCalibrationByRole(calibrationRecordFromProposal(p.roles));
      setLearningNote(p.learningNote);
    },
    [],
  );

  const togglePrinciple = (id: string, checked: boolean) => {
    setPrincipleIds((prev) =>
      checked ? [...prev, id] : prev.filter((x) => x !== id),
    );
  };

  useEffect(() => {
    setAssistantState(initial.assistantState);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- synchronizace jen po obnovení dat ze serveru
  }, [initial.session.updatedAt]);

  const toggleRole = (id: string, checked: boolean) => {
    setSelectedRoleIds((prev) => {
      if (checked) {
        setCalibrationByRole((c) => ({ ...c, [id]: c[id] ?? "balanced" }));
        return [...prev, id];
      }
      setCalibrationByRole((c) => {
        const next = { ...c };
        delete next[id];
        return next;
      });
      return prev.filter((x) => x !== id);
    });
  };

  const setCalibration = (
    roleId: string,
    value: "underused" | "balanced" | "overused",
  ) => {
    setCalibrationByRole((c) => ({ ...c, [roleId]: value }));
  };

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
      const res = await completeReflection({
        ...base,
        preparationId: base.preparationId,
        learningNote: base.learningNote ?? "",
        principleIds: base.principleIds ?? [],
        roles: base.roles ?? [],
      });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      router.push("/reflections?complete=1");
      router.refresh();
    });
  };

  return (
    <div className="space-y-8">
      <nav className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/reflections">← Všechny reflexe</Link>
        </Button>
        <div className="flex flex-wrap items-center gap-2">
          <RecordDeleteButton
            recordId={reflectionId}
            deleteAction={deleteReflection}
            redirectTo="/reflections"
            title="Smazat tuto reflexi?"
            description="Celý záznam reflexe bude trvale odstraněn. Tuto akci nelze vrátit zpět."
            confirmLabel="Smazat reflexi"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={pending}
            onClick={onSaveDraftClick}
          >
            Uložit rozpracované
          </Button>
        </div>
      </nav>

      <header className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Potřebujete si něco osvěžit? Otevřete si{" "}
          <a
            href="/orientation/principles"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-2"
          >
            Konzultantské desatero
          </a>{" "}
          nebo{" "}
          <a
            href="/orientation/roles"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-2"
          >
            Role
          </a>{" "}
          v novém panelu — váš rozpracovaný text zde zůstane.
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
          Nová reflexe
        </h1>
      </header>

      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200" role="alert">
          {error}
        </p>
      ) : null}

      {initial.preparation ? (
        <OriginalIntentPanel
          preparation={initial.preparation}
          roleNameById={roleNameById}
        />
      ) : null}

      <section
        className="animate-step-in space-y-6"
        aria-live="polite"
        aria-label={STEPS[step]}
      >
        {step === 0 ? (
          <div className="space-y-4">
            {!initial.session.preparationId && waitingPreparations.length > 0 ? (
              <div className="space-y-2">
                <Label htmlFor="link-prep">Propojit s přípravou (volitelné)</Label>
                <select
                  id="link-prep"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={linkPreparationId}
                  onChange={(e) => setLinkPreparationId(e.target.value)}
                  aria-describedby="link-prep-hint"
                >
                  <option value="">— bez propojení —</option>
                  {waitingPreparations.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.consultationLabel?.trim() || "Nepojmenovaná příprava"} ·{" "}
                      {new Date(p.updatedAt).toLocaleDateString("cs-CZ")}
                    </option>
                  ))}
                </select>
                <p id="link-prep-hint" className="text-xs text-muted-foreground">
                  Po uložení kroku zůstane vazba zachována. Novou přípravu vytvoříte v sekci Přípravy.
                </p>
              </div>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="label">Název konzultace</Label>
              <Input
                id="label"
                value={consultationLabel}
                onChange={(e) => setConsultationLabel(e.target.value)}
                placeholder="např. Acme — workshop k cenotvorbě"
                maxLength={200}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="when">Kdy proběhla</Label>
              <DatetimeLocalInput
                id="when"
                value={occurredAtLocal}
                onChange={(e) => setOccurredAtLocal(e.target.value)}
              />
            </div>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Které principy z Konzultantského desatera byly pro tuto konzultaci nejrelevantnější?
            </p>
            <ul className="list-none space-y-3 p-0">
              {principles.map((p) => {
                const selected = principleIds.includes(p.id);
                const titleId = `p-title-${p.id}`;
                return (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => togglePrinciple(p.id, !selected)}
                      aria-pressed={selected}
                      aria-labelledby={titleId}
                      className={cn(
                        "flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors motion-reduce:transition-none",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-reduce:focus-visible:ring-0 motion-reduce:focus-visible:ring-offset-0",
                        selected
                          ? "border-primary bg-primary/[0.08] shadow-sm ring-1 ring-primary/25 dark:bg-primary/[0.12]"
                          : "border-border/80 bg-card hover:border-border hover:bg-muted/35 active:bg-muted/50",
                      )}
                    >
                      <PrincipleIllustration
                        src={p.imagePath}
                        alt=""
                        variant="inline"
                        className="shrink-0 rounded-md opacity-95"
                      />
                      <div className="min-w-0 flex-1">
                        <span
                          id={titleId}
                          className="font-medium text-foreground"
                        >
                          {p.title}
                        </span>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {p.summary}
                        </p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              Vyberte role, které jste použili, a poté každou zkalibrujte (podhodnocená / vyvážená / přehřátá).
            </p>
            <RoleSelector
              mode="reflection"
              roleGroups={roleGroups}
              selectedRoleIds={selectedRoleIds}
              calibrationByRole={calibrationByRole}
              onToggleRole={toggleRole}
              onSetCalibration={setCalibration}
              focusPartition={
                roleSelfEval != null &&
                roleSelfEval.isComplete &&
                roleSelfEval.focusRoleIds.length > 0
                  ? { focusRoleIds: roleSelfEval.focusRoleIds }
                  : undefined
              }
            />
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              Jedno krátké poučení pro vaši příští konzultaci. Volitelný asistent níže
              může navrhnout reflexivní otázky a strukturu reflexe — otázky můžete vložit na
              konec poznámky, nebo pište rovnou.
            </p>
            <div className="space-y-2">
              <Label htmlFor="learning">Poznámka k učení</Label>
              <Textarea
                id="learning"
                value={learningNote}
                onChange={(e) => setLearningNote(e.target.value)}
                placeholder="Co si odnesete do budoucna?"
                maxLength={4000}
                rows={6}
              />
            </div>
            <ReflectionAssistantPanel
              reflectionId={reflectionId}
              preparation={initial.preparation}
              roleGroups={roleGroups}
              state={assistantState}
              onStateChange={setAssistantState}
              onApplyProposal={applyAssistantProposal}
              saveDraft={saveDraft}
              hasReflectionSelections={
                principleIds.length > 0 || selectedRoleIds.length > 0
              }
              learningNote={learningNote}
              onLearningNoteChange={setLearningNote}
            />
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
              {pending ? "Dokončování…" : "Označit jako dokončené"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
