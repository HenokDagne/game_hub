"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Eye, EyeClosed } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const callbackUrl = "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-4 px-6 py-10">
      <h1 className="text-3xl font-bold">Login</h1>
      <form className="space-y-3" onSubmit={onSubmit}>
        <input
          className="w-full rounded border border-black/20 px-3 py-2"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          required
          type="email"
          value={email}
        />
        <div className="flex gap-2">
          <input
            className="w-full rounded border border-black/20 px-3 py-2"
            minLength={6}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            required
            type={showPassword ? "text" : "password"}
            value={password}
          />
          <button
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="rounded border border-black/20 px-3 py-2 text-sm"
            onClick={() => setShowPassword((prev) => !prev)}
            type="button"
          >
            {showPassword ? <Eye className="h-4 w-4" /> : <EyeClosed className="h-4 w-4" />}
          </button>
        </div>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button className="auth-button-shadow auth-submit-button w-full rounded px-4 py-2" disabled={loading} type="submit">
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <button className="auth-button-shadow rounded border border-black/20 px-4 py-2" onClick={() => signIn("google", { callbackUrl })} type="button">
        Sign in with Google
      </button>
      <p className="text-sm">
        No account? <Link className="underline" href="/register">Create one</Link>
      </p>
    </main>
  );
}
