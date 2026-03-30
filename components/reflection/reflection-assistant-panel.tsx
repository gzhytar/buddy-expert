"use client";

import { useCallback, useState, useTransition } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { PreparationPlanSummary } from "@/lib/reflection/actions";
import type { RolePhaseGroup } from "@/lib/queries/orientation-types";
import {
  generateReflectionAssistantProposal,
  generateReflectionAssistantQuestions,
  saveReflectionAssistantState,
} from "@/lib/reflection/assistant-actions";
import {
  emptyAssistantState,
  type ReflectionAssistantStateV1,
} from "@/lib/reflection/assistant-state";
import { useRouter } from "next/navigation";

type Props = {
  reflectionId: string;
  preparation: PreparationPlanSummary | null;
  roleGroups: RolePhaseGroup[];
  state: ReflectionAssistantStateV1 | null;
  onStateChange: (s: ReflectionAssistantStateV1 | null) => void;
  onApplyProposal: (p: {
    principleIds: string[];
    roles: { roleId: string; calibration: "underused" | "balanced" | "overused" }[];
    learningNote: string;
  }) => void;
};

function needsAnchorRoles(prep: PreparationPlanSummary | null): boolean {
  if (!prep) return true;
  return (
    prep.strengthenRoleIds.length === 0 && prep.downregulateRoleIds.length === 0
  );
}

export function ReflectionAssistantPanel({
  reflectionId,
  preparation,
  roleGroups,
  state,
  onStateChange,
  onApplyProposal,
}: Props) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [anchorSelected, setAnchorSelected] = useState<string[]>([]);
  const [inlineError, setInlineError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const model = state ?? emptyAssistantState();
  const phase = model.phase;

  const allRoles = roleGroups.flatMap((g) => g.roles);
  const showAnchorUi = needsAnchorRoles(preparation);

  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.28, ease: [0.16, 1, 0.3, 1] as const };

  const persistAssistant = useCallback(
    async (next: ReflectionAssistantStateV1) => {
      const res = await saveReflectionAssistantState({
        reflectionId,
        state: next,
      });
      if (!res.ok) throw new Error(res.error);
    },
    [reflectionId],
  );

  const toggleAnchor = (roleId: string) => {
    setAnchorSelected((prev) => {
      if (prev.includes(roleId)) return prev.filter((x) => x !== roleId);
      if (prev.length >= 3) return prev;
      return [...prev, roleId];
    });
  };

  const onGenerateQuestions = () => {
    setInlineError(null);
    startTransition(async () => {
      try {
        const res = await generateReflectionAssistantQuestions({
          reflectionId,
          anchorRoleIds: showAnchorUi ? anchorSelected : undefined,
        });
        if (!res.ok) {
          setInlineError(res.error);
          router.refresh();
          return;
        }
        onStateChange(res.state);
        router.refresh();
      } catch (e) {
        setInlineError(
          e instanceof Error ? e.message : "Generování otázek selhalo",
        );
      }
    });
  };

  const onGenerateProposal = () => {
    setInlineError(null);
    startTransition(async () => {
      try {
        const res = await generateReflectionAssistantProposal({
          reflectionId,
          answers: state?.answers ?? model.answers,
        });
        if (!res.ok) {
          setInlineError(res.error);
          router.refresh();
          return;
        }
        onStateChange(res.state);
        router.refresh();
      } catch (e) {
        setInlineError(
          e instanceof Error ? e.message : "Generování návrhu selhalo",
        );
      }
    });
  };

  const updateAnswer = (id: string, text: string) => {
    const base = state ?? emptyAssistantState();
    onStateChange({
      ...base,
      answers: { ...base.answers, [id]: text },
    });
  };

  const onDismissAssistant = () => {
    setOpen(false);
    setInlineError(null);
  };

  return (
    <section
      className="rounded-xl border border-border/80 bg-muted/20 p-4"
      aria-label="Strukturovací asistent reflexe"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-foreground">
            Strukturovací asistent (volitelný)
          </h2>
          <p className="text-sm text-muted-foreground">
            Návrhy a otázky jsou jen oporou k vašemu vlastnímu uvědomění — ne
            hodnocení ani kontrola z organizace. Obsah vidíte jen vy.
          </p>
        </div>
        <Button
          type="button"
          variant={open ? "secondary" : "outline"}
          size="sm"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Skrýt" : "Zobrazit asistenta"}
        </Button>
      </div>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="body"
            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
            transition={transition}
            className="mt-4 space-y-4"
          >
            {model.lastError && phase === "idle" ? (
              <p
                className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100"
                role="status"
              >
                {model.lastError}
              </p>
            ) : null}

            {inlineError ? (
              <div
                className="space-y-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
                role="alert"
              >
                <p>{inlineError}</p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setInlineError(null)}
                  >
                    Zkusit znovu
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setInlineError(null);
                      onDismissAssistant();
                    }}
                  >
                    Pokračovat bez asistenta
                  </Button>
                </div>
              </div>
            ) : null}

            {phase === "idle" ? (
              <motion.div
                key="idle"
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0 }}
                transition={transition}
                className="space-y-4"
              >
                {showAnchorUi ? (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Bez propojené přípravy s rolemi můžete zvolit až tři{" "}
                      <strong>kotvicí role</strong>, kolem kterých chcete reflexi
                      vést (volitelné). Jinak použijeme role označené k
                      zlepšení v orientaci, pokud je máte.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {allRoles.map((r) => {
                        const on = anchorSelected.includes(r.id);
                        return (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() => toggleAnchor(r.id)}
                            className={cn(
                              "rounded-full border px-3 py-1 text-xs transition-colors motion-reduce:transition-none",
                              on
                                ? "border-primary bg-primary/10 text-foreground"
                                : "border-border bg-background hover:bg-muted/60",
                            )}
                          >
                            {r.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                <Button
                  type="button"
                  disabled={pending}
                  aria-busy={pending}
                  onClick={() => onGenerateQuestions()}
                >
                  {pending ? "Generuji otázky…" : "Vygenerovat reflexivní otázky"}
                </Button>
              </motion.div>
            ) : null}

            {phase === "questions" ? (
              <motion.div
                key="questions"
                initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
                transition={transition}
                className="space-y-4"
              >
                {pending ? (
                  <div className="space-y-2" aria-live="polite">
                    <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
                    <div className="h-20 w-full animate-pulse rounded bg-muted" />
                    <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                  </div>
                ) : (
                  model.questions.map((q) => (
                    <div key={q.id} className="space-y-2">
                      <Label htmlFor={`asst-q-${q.id}`}>{q.text}</Label>
                      <Textarea
                        id={`asst-q-${q.id}`}
                        value={model.answers[q.id] ?? ""}
                        onChange={(e) => updateAnswer(q.id, e.target.value)}
                        rows={3}
                        maxLength={4000}
                        placeholder="Krátká odpověď…"
                      />
                    </div>
                  ))
                )}

                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    disabled={pending}
                    aria-busy={pending}
                    onClick={() => onGenerateProposal()}
                  >
                    {pending
                      ? "Generuji návrh…"
                      : "Navrhnout strukturu reflexe"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={pending}
                    onClick={() => {
                      const next = {
                        ...emptyAssistantState(),
                        lastError: state?.lastError,
                      };
                      onStateChange(next);
                      void persistAssistant(next);
                      router.refresh();
                    }}
                  >
                    Začít znovu
                  </Button>
                </div>
              </motion.div>
            ) : null}

            {phase === "proposal" && model.proposal ? (
              <motion.div
                key="proposal"
                initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={transition}
                className="space-y-4"
              >
                <p className="text-sm font-medium text-foreground">
                  Návrh struktury (vše můžete před uložením reflexe upravit)
                </p>
                <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  <li>
                    Principy: {model.proposal.principleIds.length} vybraných
                  </li>
                  <li>Role s kalibrací: {model.proposal.roles.length}</li>
                  <li>
                    Poučení:{" "}
                    {model.proposal.learningNote.length > 120
                      ? `${model.proposal.learningNote.slice(0, 120)}…`
                      : model.proposal.learningNote}
                  </li>
                </ul>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    onClick={() => {
                      onApplyProposal(model.proposal!);
                      router.refresh();
                    }}
                  >
                    Použít návrh ve formuláři
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (!state) return;
                      const next: ReflectionAssistantStateV1 = {
                        ...state,
                        phase: "questions",
                        proposal: undefined,
                      };
                      onStateChange(next);
                      void persistAssistant(next);
                      router.refresh();
                    }}
                  >
                    Zpět k otázkám
                  </Button>
                </div>
              </motion.div>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
