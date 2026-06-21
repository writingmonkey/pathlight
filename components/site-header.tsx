import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Brand } from "@/components/brand";
import { Button, buttonVariants } from "@/components/ui/button";
import { signOut } from "@/app/actions";

export async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-30 border-b border-gold/25 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Brand />
        <nav className="flex items-center gap-1 sm:gap-2">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                Your readings
              </Link>
              <form action={signOut}>
                <Button variant="ghost" size="sm" type="submit">
                  Sign out
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                Sign in
              </Link>
              <Link
                href="/reading/begin"
                className={buttonVariants({ size: "sm" })}
              >
                Begin
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
