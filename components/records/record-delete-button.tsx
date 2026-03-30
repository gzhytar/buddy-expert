"use client";

import { useRouter } from "next/navigation";
import { useId, useRef, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DeleteFn = (raw: { id: string }) => Promise<
  { ok: true } | { ok: false; error: string }
>;

type Props = {
  recordId: string;
  deleteAction: DeleteFn;
  triggerLabel?: string;
  title: string;
  description: string;
  confirmLabel?: string;
  /** Po úspěchu volitelně `router.push`, vždy následuje `router.refresh()`. */
  redirectTo?: string;
  size?: "sm" | "default";
  className?: string;
};

export function RecordDeleteButton({
  recordId,
  deleteAction,
  triggerLabel = "Smazat",
  title,
  description,
  confirmLabel = "Trvale smazat",
  redirectTo,
  size = "sm",
  className,
}: Props) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descId = useId();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function openDialog() {
    setError(null);
    dialogRef.current?.showModal();
  }

  function closeDialog() {
    dialogRef.current?.close();
  }

  function handleConfirm() {
    startTransition(async () => {
      const res = await deleteAction({ id: recordId });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      closeDialog();
      if (redirectTo) router.push(redirectTo);
      router.refresh();
    });
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size={size}
        disabled={pending}
        onClick={openDialog}
        className={cn(
          "border-red-200 text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/40",
          className,
        )}
      >
        {triggerLabel}
      </Button>
      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-card p-0 text-foreground shadow-lg backdrop:bg-black/40 motion-reduce:transition-none"
        onClose={() => setError(null)}
      >
        <div className="border-b border-border px-5 py-4">
          <h2 id={titleId} className="text-base font-semibold tracking-tight">
            {title}
          </h2>
          <p
            id={descId}
            className="mt-2 text-sm text-muted-foreground leading-relaxed"
          >
            {description}
          </p>
          {error ? (
            <p
              className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
              role="alert"
            >
              {error}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap justify-end gap-2 px-5 py-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={pending}
            onClick={closeDialog}
          >
            Zrušit
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={pending}
            onClick={handleConfirm}
            className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
          >
            {confirmLabel}
          </Button>
        </div>
      </dialog>
    </>
  );
}
