"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getProviders, signIn } from "next-auth/react";
import { Eye, EyeClosed } from "lucide-react";

function GoogleIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24">
      <path d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.31h6.44a5.52 5.52 0 0 1-2.39 3.62v3.01h3.87c2.27-2.09 3.57-5.16 3.57-8.67Z" fill="#4285F4" />
      <path d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.87-3.01c-1.07.72-2.44 1.14-4.08 1.14-3.13 0-5.78-2.11-6.73-4.95H1.27v3.1A11.99 11.99 0 0 0 12 24Z" fill="#34A853" />
      <path d="M5.27 14.27A7.2 7.2 0 0 1 4.9 12c0-.79.14-1.56.37-2.27v-3.1H1.27A11.99 11.99 0 0 0 0 12c0 1.93.46 3.76 1.27 5.37l4-3.1Z" fill="#FBBC05" />
      <path d="M12 4.78c1.76 0 3.33.61 4.57 1.8l3.43-3.43C17.95 1.18 15.24 0 12 0 7.31 0 3.26 2.69 1.27 6.63l4 3.1c.95-2.84 3.6-4.95 6.73-4.95Z" fill="#EA4335" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const callbackUrl = "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCredentialsLoading, setIsCredentialsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGoogleAvailable, setIsGoogleAvailable] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadProviders() {
      const providers = await getProviders();

      if (mounted) {
        setIsGoogleAvailable(Boolean(providers?.google));
      }
    }

    void loadProviders();

    return () => {
      mounted = false;
    };
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsCredentialsLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl,
    });

    setIsCredentialsLoading(false);

    if (result?.error) {
      setError("Invalid email or password");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  };

  const onGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    await signIn("google", { callbackUrl });
  };

  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-4 px-6 py-10">
      <h1 className="text-3xl font-bold">Login</h1>
      <form className="space-y-3" onSubmit={onSubmit}>
        <input
          className="w-full rounded border border-black/20 px-3 py-2"
          disabled={isCredentialsLoading || isGoogleLoading}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          required
          type="email"
          value={email}
        />
        <div className="flex gap-2">
          <input
            className="w-full rounded border border-black/20 px-3 py-2"
            disabled={isCredentialsLoading || isGoogleLoading}
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
            disabled={isCredentialsLoading || isGoogleLoading}
            onClick={() => setShowPassword((prev) => !prev)}
            type="button"
          >
            {showPassword ? <Eye className="h-4 w-4" /> : <EyeClosed className="h-4 w-4" />}
          </button>
        </div>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button
          className="auth-button-shadow auth-submit-button flex w-full items-center justify-center gap-2 rounded px-4 py-2"
          disabled={isCredentialsLoading || isGoogleLoading}
          type="submit"
        >
          {isCredentialsLoading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : null}
          <span>{isCredentialsLoading ? "Signing in..." : "Sign in"}</span>
        </button>
      </form>
      {isGoogleAvailable ? (
        <button
          className="auth-button-shadow flex items-center justify-center gap-2 rounded border border-black/20 px-4 py-2"
          disabled={isCredentialsLoading || isGoogleLoading}
          onClick={onGoogleSignIn}
          type="button"
        >
          <GoogleIcon />
          <span>{isGoogleLoading ? "Redirecting..." : "Sign in with Google"}</span>
        </button>
      ) : (
        <p className="text-xs text-black/70">Google sign-in is unavailable. Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env` and restart.</p>
      )}
      <p className="text-sm">
        No account? <Link className="underline" href="/register">Create one</Link>
      </p>
    </main>
  );
}
