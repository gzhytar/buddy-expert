"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { generatePreparationReflectiveQuestions } from "@/lib/preparation/preparation-assistant-actions";
import type { PreparationAssistantStateV1 } from "@/lib/preparation/preparation-assistant-state";
import { savePreparationDraft } from "@/lib/preparation/actions";
import { cn } from "@/lib/utils";

export type PreparationReflectiveGeneratePayload = {
  roles: { roleId: string; type: "strengthen" | "downregulate" }[];
  consultationLabel?: string;
  occurredAt?: string;
};

type Props = {
  preparationId: string;
  initialAssistant: PreparationAssistantStateV1 | null;
  roleCount: number;
  saveDraft: () => ReturnType<typeof savePreparationDraft>;
  getGeneratePayload: () => PreparationReflectiveGeneratePayload;
  focusNote: string;
  onFocusNoteChange: (value: string) => void;
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

function appendBlockToFocusNote(focusNote: string, block: string): string {
  const trimmed = focusNote.trim();
  if (!trimmed) {
    return block;
  }
  return `${focusNote.trimEnd()}\n\n${block}`;
}

type ListBodyProps = {
  questions: string[];
  pending: boolean;
  reduceMotion: boolean | null;
  transition: { duration: number; ease?: readonly [number, number, number, number] };
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
      Zatím žádné vygenerované otázky. Po vygenerování se zobrazí zde a uloží se k této
      přípravě.
    </motion.p>
  );
}

export function PreparationReflectiveQuestionsPanel({
  preparationId,
  initialAssistant,
  roleCount,
  saveDraft,
  getGeneratePayload,
  focusNote,
  onFocusNoteChange,
}: Props) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [pending, startTransition] = useTransition();
  const [inlineError, setInlineError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<string[]>(
    () => initialAssistant?.reflectiveQuestions ?? [],
  );

  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.25, ease: [0.16, 1, 0.3, 1] as const };

  function handleGenerate(): void {
    setInlineError(null);
    startTransition(async () => {
      const saved = await saveDraft();
      if (!saved.ok) {
        setInlineError(saved.error);
        return;
      }
      const payload = getGeneratePayload();
      const res = await generatePreparationReflectiveQuestions({
        preparationId,
        roles: payload.roles,
        consultationLabel: payload.consultationLabel,
        occurredAt: payload.occurredAt,
      });
      if (!res.ok) {
        setInlineError(res.error);
        return;
      }
      setQuestions(res.state.reflectiveQuestions);
      router.refresh();
    });
  }

  function handleInsertIntoFocus(): void {
    if (questions.length === 0) {
      return;
    }
    const block = buildReflectiveQuestionsBlock(questions);
    onFocusNoteChange(appendBlockToFocusNote(focusNote, block));
  }

  const canGenerate = roleCount > 0 && !pending;

  return (
    <section
      className="rounded-lg border border-border/80 bg-muted/20 p-4 motion-reduce:transition-none"
      aria-labelledby="prep-reflective-questions-heading"
    >
      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="space-y-1">
          <h2
            id="prep-reflective-questions-heading"
            className="text-sm font-medium text-foreground"
          >
            Opora k záměru — reflexivní otázky
          </h2>
          <p className="text-xs text-muted-foreground">
            Volitelný návrh otázek podle rolí, které chcete posílit nebo tlumit. Můžete je
            použít jako podklad a záměr si upravte podle sebe.
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="shrink-0 gap-1.5 transition-opacity duration-200 motion-reduce:transition-none"
          disabled={!canGenerate}
          aria-busy={pending}
          aria-describedby={
            roleCount === 0 ? "prep-reflective-questions-need-roles" : undefined
          }
          onClick={handleGenerate}
        >
          {pending ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <Sparkles className="size-4 opacity-80" aria-hidden />
          )}
          {pending ? "Generuji…" : "Vygenerovat reflexivní otázky"}
        </Button>
      </div>
      {roleCount === 0 ? (
        <p
          id="prep-reflective-questions-need-roles"
          className="mt-3 text-xs text-muted-foreground"
        >
          Nejprve v kroku Role vyberte alespoň jednu roli k posílení nebo k tlumení.
        </p>
      ) : null}

      {inlineError ? (
        <p
          className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
          role="alert"
        >
          {inlineError}
        </p>
      ) : null}

      <div
        className={cn(
          "mt-4 min-h-[1.5rem] transition-opacity duration-200 motion-reduce:transition-none",
          pending && "opacity-60",
        )}
        aria-live="polite"
        aria-busy={pending}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {reflectiveQuestionsListContent({
            questions,
            pending,
            reduceMotion,
            transition,
          })}
        </AnimatePresence>
      </div>

      {questions.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="transition-colors duration-150 motion-reduce:transition-none"
            disabled={pending}
            onClick={handleInsertIntoFocus}
          >
            Vložit do záměru (na konec textu)
          </Button>
        </div>
      ) : null}
    </section>
  );
}
