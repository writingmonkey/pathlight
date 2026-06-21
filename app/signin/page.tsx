import { AuthGate } from "@/components/auth-gate";
import { Flourish } from "@/components/flourish";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const sp = await searchParams;
  const next = sp.next ?? "/dashboard";

  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <div className="text-center">
        <h1 className="font-display text-4xl font-semibold text-ink">
          Welcome back
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-ink/75">
          Sign in to find your readings and your Purpose Guide.
        </p>
      </div>
      <Flourish className="my-8" />
      <AuthGate
        next={next}
        title="Sign in to Pathlight"
        description="We'll email you a magic link — no password needed."
      />
    </div>
  );
}
