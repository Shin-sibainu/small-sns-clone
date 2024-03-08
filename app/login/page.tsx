import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import AuthButtonClient from "../components/AuthButtonClient";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import GithubButton from "../components/GithubButton";

export default async function Login() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <GithubButton />;
    </div>
  );
}
