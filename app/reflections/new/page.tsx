import { redirect } from "next/navigation";
import { createReflectionDraft } from "@/lib/reflection/actions";

type Props = { searchParams?: Promise<{ preparationId?: string }> };

export default async function NewReflectionPage({ searchParams }: Props) {
  const params = await searchParams;
  const preparationId = params?.preparationId?.trim();
  const { id } = await createReflectionDraft(
    preparationId ? { preparationId } : undefined,
  );
  redirect(`/reflections/${id}`);
}
