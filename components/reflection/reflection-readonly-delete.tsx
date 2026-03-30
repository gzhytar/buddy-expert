"use client";

import { RecordDeleteButton } from "@/components/records/record-delete-button";
import { deleteReflection } from "@/lib/reflection/actions";

type Props = { reflectionId: string };

export function ReflectionReadOnlyDelete({ reflectionId }: Props) {
  return (
    <RecordDeleteButton
      recordId={reflectionId}
      deleteAction={deleteReflection}
      redirectTo="/reflections"
      title="Smazat tuto reflexi?"
      description="Dokončená reflexe bude trvale odstraněna včetně všech uložených údajů. Tuto akci nelze vrátit zpět."
      confirmLabel="Smazat reflexi"
    />
  );
}
