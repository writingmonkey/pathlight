import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GuideView } from "@/components/guide-view";
import { buttonVariants } from "@/components/ui/button";
import type { FullGuide } from "@/lib/types";

export default async function GuidePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/signin?next=/guide/${id}`);

  const { data: reading } = await supabase
    .from("readings")
    .select("full_guide, card_image")
    .eq("id", id)
    .single();

  if (!reading?.full_guide) notFound();

  const guide = reading.full_guide as unknown as FullGuide;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <GuideView guide={guide} cardImage={reading.card_image} />
      <div className="mt-14 text-center">
        <Link href="/dashboard" className={buttonVariants({ variant: "outline" })}>
          Back to your readings
        </Link>
      </div>
    </div>
  );
}
