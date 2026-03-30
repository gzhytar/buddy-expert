"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Crosshair, Heart, MinusCircle, ThumbsDown } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { saveConsultingRoleSelfEval } from "@/lib/orientation/role-self-eval-actions";
import type { RoleSelfEvalSentiment } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

const OPTIONS: {
  value: RoleSelfEvalSentiment;
  label: string;
  title: string;
  Icon: typeof Heart;
}[] = [
  {
    value: "love",
    label: "Miluji tuto roli",
    title: "Miluji tuto roli",
    Icon: Heart,
  },
  {
    value: "focus_improve",
    label: "Chci se v této roli zlepšovat",
    title: "Chci se v této roli zlepšovat",
    Icon: Crosshair,
  },
  {
    value: "dislike",
    label: "V této roli se necítím dobře",
    title: "V této roli se necítím dobře",
    Icon: ThumbsDown,
  },
  {
    value: "neutral_defer",
    label: "Teď nechci vyjadřovat preferenci",
    title: "Teď nechci vyjadřovat preferenci k této roli",
    Icon: MinusCircle,
  },
];

type Props = {
  roleId: string;
  initialSentiment: RoleSelfEvalSentiment | null;
};

export function RoleSelfEvalControls({
  roleId,
  initialSentiment,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [value, setValue] = useState<string | undefined>(
    initialSentiment ?? undefined,
  );

  function handleChange(next: string) {
    setError(null);
    setValue(next);
    startTransition(async () => {
      const res = await saveConsultingRoleSelfEval({
        roleId,
        sentiment: next as RoleSelfEvalSentiment,
      });
      if (!res.ok) {
        setError(res.error);
        setValue(initialSentiment ?? undefined);
        return;
      }
      router.refresh();
    });
  }

  return (
    <section
      className="border-t border-border/60 bg-muted/5 px-4 py-3 sm:px-5"
      aria-labelledby={`self-eval-${roleId}`}
    >
      <h4
        id={`self-eval-${roleId}`}
        className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-[11px] mb-2"
      >
        Jak k roli přistupujete
      </h4>
      <RadioGroup
        value={value}
        onValueChange={handleChange}
        disabled={pending}
        className="flex flex-wrap gap-2"
        aria-labelledby={`self-eval-${roleId}`}
      >
        {OPTIONS.map(({ value: v, label, title, Icon }) => {
          const itemId = `role-${roleId}-eval-${v}`;
          return (
            <div key={v} className="relative">
              <RadioGroupItem value={v} id={itemId} className="peer sr-only" />
              <Label
                htmlFor={itemId}
                title={title}
                className={cn(
                  "flex size-10 cursor-pointer items-center justify-center rounded-lg border border-border bg-background text-muted-foreground shadow-sm transition-colors duration-200",
                  "hover:bg-accent hover:text-accent-foreground",
                  "peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background",
                  "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:text-primary",
                  "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
                  "motion-reduce:transition-none",
                )}
              >
                <Icon className="size-[18px] shrink-0" aria-hidden />
                <span className="sr-only">{label}</span>
              </Label>
            </div>
          );
        })}
      </RadioGroup>
      {error ? (
        <p className="mt-2 text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}
