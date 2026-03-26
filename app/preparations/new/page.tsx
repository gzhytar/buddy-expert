import { redirect } from "next/navigation";
import { createPreparationDraft } from "@/lib/preparation/actions";

export default async function NewPreparationPage() {
  const { id } = await createPreparationDraft();
  redirect(`/preparations/${id}`);
}
