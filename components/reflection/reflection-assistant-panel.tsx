"use client";

import { useCallback, useState, useTransition, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  saveReflectionDraft,
  type PreparationPlanSummary,
} from "@/lib/reflection/actions";
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
  saveDraft: () => ReturnType<typeof saveReflectionDraft>;
  /** Expert už vybral principy a/nebo role v předchozích krocích — kotvy v asistentovi skrýt. */
  hasReflectionSelections: boolean;
  learningNote: string;
  onLearningNoteChange: (value: string) => void;
};

const STAGGER_STEP = 0.04;

function buildReflectiveQuestionsBlock(questions: string[]): string {
  const lines = [
    "---",
    "Návrh reflexivních otázek (opora k přemýšlení, ne hodnocení):",
    ...questions.map((q, i) => `${i + 1}. ${q}`),
  ];
  return `${lines.join("\n")}\n`;
}

function appendBlockToLearningNote(note: string, block: string): string {
  const trimmed = note.trim();
  if (!trimmed) {
    return block;
  }
  return `${note.trimEnd()}\n\n${block}`;
}

function needsAnchorRoles(prep: PreparationPlanSummary | null): boolean {
  if (!prep) return true;
  return (
    prep.strengthenRoleIds.length === 0 && prep.downregulateRoleIds.length === 0
  );
}

type ListBodyProps = {
  questions: string[];
  pending: boolean;
  reduceMotion: boolean | null;
  transition: {
    duration: number;
    ease?: readonly [number, number, number, number];
  };
};

function reflectiveQuestionsListContent({
  questions,
  pending,
  reduceMotion,
  transition,
}: ListBodyProps): ReactNode {
  if (questions.length > 0) {
    return (
      <motion.ol
        key="questions"
        initial={reduceMotion ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
        transition={transition}
        className="list-decimal space-y-2 pl-5 text-sm text-foreground"
      >
        {questions.map((q, i) => (
          <motion.li
            key={`${i}-${q.slice(0, 24)}`}
            initial={reduceMotion ? false : { opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              ...transition,
              delay: reduceMotion ? 0 : i * STAGGER_STEP,
            }}
          >
            {q}
          </motion.li>
        ))}
      </motion.ol>
    );
  }

  if (pending) {
    return (
      <motion.p
        key="loading"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={transition}
        className="flex items-center gap-2 text-xs text-muted-foreground"
      >
        <Loader2 className="size-3.5 shrink-0 animate-spin" aria-hidden />
        Odesílám kontext a tvořím návrh otázek…
      </motion.p>
    );
  }

  return (
    <motion.p key="empty" initial={false} className="text-xs text-muted-foreground">
      Zatím žádné vygenerované otázky.
    </motion.p>
  );
}

export function ReflectionAssistantPanel({
  reflectionId,
  preparation,
  roleGroups,
  state,
  onStateChange,
  onApplyProposal,
  saveDraft,
  hasReflectionSelections,
  learningNote,
  onLearningNoteChange,
}: Props) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [anchorSelected, setAnchorSelected] = useState<string[]>([]);
  const [inlineError, setInlineError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const model = state ?? emptyAssistantState();
  const phase = model.phase;

  const allRoles = roleGroups.flatMap((g) => g.roles);
  const showAnchorUi =
    needsAnchorRoles(preparation) && !hasReflectionSelections;

  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.25, ease: [0.16, 1, 0.3, 1] as const };

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
        const saved = await saveDraft();
        if (!saved.ok) {
          setInlineError(saved.error);
          return;
        }
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
        const saved = await saveDraft();
        if (!saved.ok) {
          setInlineError(saved.error);
          return;
        }
        const res = await generateReflectionAssistantProposal({
          reflectionId,
          answers: state?.answers ?? model.answers,
          learningNoteContext: learningNote,
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

  const questionTexts = model.questions.map((q) => q.text);

  const handleInsertIntoLearningNote = () => {
    if (questionTexts.length === 0) return;
    const block = buildReflectiveQuestionsBlock(questionTexts);
    onLearningNoteChange(appendBlockToLearningNote(learningNote, block));
  };

  return (
    <section
      className="rounded-lg border border-border/80 bg-muted/20 p-4 motion-reduce:transition-none"
      aria-labelledby="reflection-assistant-heading"
    >
      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="space-y-1">
          <h2
            id="reflection-assistant-heading"
            className="text-sm font-medium text-foreground"
          >
            Strukturovací asistent (volitelný)
          </h2>
          <p className="text-xs text-muted-foreground">
            Reflexivní otázky a návrh struktury jsou jen oporou — ne hodnocení ani kontrola.
            Obsah vidíte jen vy. Otázky můžete vložit na konec poznámky k učení.
          </p>
        </div>
        {phase === "idle" ? (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="shrink-0 gap-1.5 transition-opacity duration-200 motion-reduce:transition-none"
            disabled={pending}
            aria-busy={pending}
            onClick={() => onGenerateQuestions()}
          >
            {pending ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <Sparkles className="size-4 opacity-80" aria-hidden />
            )}
            {pending ? "Generuji…" : "Vygenerovat reflexivní otázky"}
          </Button>
        ) : null}
      </div>

      <div className="mt-4 space-y-4">
        {model.lastError && phase === "idle" ? (
          <p
            className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100"
            role="status"
          >
            {model.lastError}
          </p>
        ) : null}

        {inlineError ? (
          <p
            className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
            role="alert"
          >
            {inlineError}
          </p>
        ) : null}

        {phase === "idle" ? (
          <div className="space-y-4">
            {showAnchorUi ? (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  Bez propojené přípravy s rolemi můžete zvolit až tři{" "}
                  <strong className="text-foreground">kotvicí role</strong>{" "}
                  (volitelné). Jinak použijeme role označené k zlepšení v orientaci,
                  pokud je máte.
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
          </div>
        ) : null}

        {phase === "questions" ? (
          <div className="space-y-4">
            <div
              className={cn(
                "min-h-[1.5rem] transition-opacity duration-200 motion-reduce:transition-none",
                pending && "opacity-60",
              )}
              aria-live="polite"
              aria-busy={pending}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                {reflectiveQuestionsListContent({
                  questions: questionTexts,
                  pending,
                  reduceMotion,
                  transition,
                })}
              </AnimatePresence>
            </div>

            {questionTexts.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="transition-colors duration-150 motion-reduce:transition-none"
                  disabled={pending}
                  onClick={handleInsertIntoLearningNote}
                >
                  Vložit do záměru (na konec textu)
                </Button>
              </div>
            ) : null}

            <div className="flex flex-wrap items-center gap-2" aria-live="polite">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="gap-1.5"
                disabled={pending}
                aria-busy={pending}
                onClick={() => onGenerateProposal()}
              >
                {pending ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : (
                  <Sparkles className="size-4 opacity-80" aria-hidden />
                )}
                {pending ? "Generuji…" : "Navrhnout strukturu reflexe"}
              </Button>
              {pending ? (
                <span className="text-xs text-muted-foreground">
                  Odesílám kontext a tvořím návrh…
                </span>
              ) : null}
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
          </div>
        ) : null}

        {phase === "proposal" && model.proposal ? (
          <motion.div
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
      </div>
    </section>
  );
}
