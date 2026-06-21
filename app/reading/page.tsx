import { createClient } from "@/lib/supabase/server";
import { ReadingFlow } from "@/components/reading-flow";

export default async function ReadingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <ReadingFlow authed={!!user} />;
}
