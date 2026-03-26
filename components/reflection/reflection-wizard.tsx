"use client";

import {
  completeReflection,
  saveReflectionDraft,
  type ReflectionDetail,
} from "@/lib/reflection/actions";
import type { Principle } from "@/lib/db/schema";
import type { RolePhaseGroup } from "@/lib/queries/orientation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { PrincipleIllustration } from "@/components/principles/principle-illustration";
import type { AlignmentLikert } from "@/lib/reflection/validation";
import { RoleSelector } from "@/components/roles/role-selector";
import { OriginalIntentPanel } from "@/components/reflection/original-intent-panel";

const STEPS = [
  "Konzultace",
  "Principy",
  "Role",
  "Soulad s rámcem",
  "Poznámka k učení",
] as const;

const alignmentOptions: { value: AlignmentLikert; label: string }[] = [
  { value: "strongly_aligned", label: "Silný soulad" },
  { value: "aligned", label: "Převážně v souladu" },
  { value: "mixed", label: "Smíšené / částečný soulad" },
  { value: "strained", label: "Napjaté nebo mimo rámec" },
  { value: "unsure", label: "Zatím nevím" },
];

function toDatetimeLocalValue(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
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
  waitingPreparations?: WaitingPrepRow[];
};

export function ReflectionWizard({
  reflectionId,
  initial,
  principles,
  roleGroups,
  waitingPreparations = [],
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
  const [alignmentLikert, setAlignmentLikert] = useState<AlignmentLikert | "">(
    (initial.session.alignmentLikert as AlignmentLikert | null) ?? "",
  );
  const [alignmentNote, setAlignmentNote] = useState(
    initial.session.alignmentNote ?? "",
  );
  const [learningNote, setLearningNote] = useState(
    initial.session.learningNote ?? "",
  );
  const [linkPreparationId, setLinkPreparationId] = useState(
    () => initial.session.preparationId ?? "",
  );

  const roleNameById = Object.fromEntries(
    roleGroups.flatMap((g) => g.roles.map((r) => [r.id, r.name])),
  );

  const buildPayload = useCallback(() => {
    const occurredAt =
      occurredAtLocal.trim() === ""
        ? undefined
        : new Date(occurredAtLocal).toISOString();
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
      alignmentLikert: alignmentLikert || undefined,
      alignmentNote: alignmentNote.trim() || undefined,
      learningNote: learningNote.trim() || undefined,
    };
  }, [
    reflectionId,
    linkPreparationId,
    consultationLabel,
    occurredAtLocal,
    principleIds,
    selectedRoleIds,
    calibrationByRole,
    alignmentLikert,
    alignmentNote,
    learningNote,
  ]);

  const saveDraft = useCallback(() => {
    return saveReflectionDraft(buildPayload());
  }, [buildPayload]);

  const togglePrinciple = (id: string, checked: boolean) => {
    setPrincipleIds((prev) =>
      checked ? [...prev, id] : prev.filter((x) => x !== id),
    );
  };

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
        alignmentLikert: base.alignmentLikert as AlignmentLikert,
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
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={pending}
          onClick={() => onSaveDraftClick()}
        >
          Uložit rozpracované
        </Button>
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
            Principy
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
            <p className="text-sm text-muted-foreground">
              Pouze volitelný kontext — žádná vazba na CRM. Pojmenujte tuto konzultaci způsobem, který vám dává smysl.
            </p>
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
              <Input
                id="when"
                type="datetime-local"
                value={occurredAtLocal}
                onChange={(e) => setOccurredAtLocal(e.target.value)}
              />
            </div>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Které principy byly pro tuto konzultaci nejrelevantnější?
            </p>
            <ul className="space-y-3">
              {principles.map((p) => {
                const checked = principleIds.includes(p.id);
                return (
                  <li
                    key={p.id}
                    className="flex items-start gap-3 rounded-md border border-border/80 bg-card p-3"
                  >
                    <Checkbox
                      id={`p-${p.id}`}
                      checked={checked}
                      onCheckedChange={(v) =>
                        togglePrinciple(p.id, v === true)
                      }
                      aria-labelledby={`p-label-${p.id}`}
                    />
                    <PrincipleIllustration
                      src={p.imagePath}
                      alt={`Ilustrace: ${p.title}`}
                      variant="inline"
                      className="rounded-md"
                    />
                    <div className="min-w-0 flex-1">
                      <Label
                        id={`p-label-${p.id}`}
                        htmlFor={`p-${p.id}`}
                        className="cursor-pointer font-medium"
                      >
                        {p.title}
                      </Label>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {p.summary}
                      </p>
                    </div>
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
            />
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Jak moc byla tato konzultace v souladu s misí JIC a servisním rámcem? Je to pro vaše vlastní učení — nikoliv hodnocení výkonu.
            </p>
            <RadioGroup
              value={alignmentLikert}
              onValueChange={(v) => setAlignmentLikert(v as AlignmentLikert)}
              className="space-y-2"
            >
              {alignmentOptions.map((o) => (
                <div
                  key={o.value}
                  className="flex items-center gap-3 rounded-md border border-border/80 bg-card p-3"
                >
                  <RadioGroupItem value={o.value} id={`al-${o.value}`} />
                  <Label
                    htmlFor={`al-${o.value}`}
                    className="flex-1 cursor-pointer font-normal"
                  >
                    {o.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            <div className="space-y-2">
              <Label htmlFor="alignmentNote">Volitelný komentář</Label>
              <Textarea
                id="alignmentNote"
                value={alignmentNote}
                onChange={(e) => setAlignmentNote(e.target.value)}
                placeholder="Napětí, kompromisy, co bylo nejasné…"
                maxLength={2000}
              />
            </div>
          </div>
        ) : null}

        {step === 4 ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Jedno krátké poučení pro vaši příští konzultaci.
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
          </div>
        ) : null}
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
        <Button
          type="button"
          variant="ghost"
          disabled={pending || step === 0}
          onClick={() => goBack()}
        >
          Zpět
        </Button>
        <div className="flex gap-2">
          {step < STEPS.length - 1 ? (
            <Button type="button" disabled={pending} onClick={() => goNext()}>
              {pending ? "Ukládání…" : "Další"}
            </Button>
          ) : (
            <Button type="button" disabled={pending} onClick={() => onComplete()}>
              {pending ? "Dokončování…" : "Označit jako dokončené"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
