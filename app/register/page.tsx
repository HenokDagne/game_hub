"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const payload = new FormData();
    payload.append("name", name.trim());
    payload.append("email", email.trim());
    payload.append("password", password);

    if (profileImage) {
      payload.append("profileImage", profileImage);
    }

    const response = await fetch("/api/register", {
      method: "POST",
      body: payload,
    });

    setLoading(false);

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error ?? "Could not create account");
      return;
    }

    router.push("/login");
  };

  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-4 px-6 py-10">
      <h1 className="text-3xl font-bold">Register</h1>
      <form className="space-y-3" onSubmit={onSubmit}>
        <input
          className="w-full rounded border border-black/20 px-3 py-2"
          onChange={(event) => setName(event.target.value)}
          placeholder="Name"
          type="text"
          value={name}
        />
        <input
          className="w-full rounded border border-black/20 px-3 py-2"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          required
          type="email"
          value={email}
        />
        <input
          className="w-full rounded border border-black/20 px-3 py-2"
          minLength={6}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          required
          type="password"
          value={password}
        />
        <input
          accept="image/*"
          className="w-full rounded border border-black/20 px-3 py-2"
          onChange={(event) => setProfileImage(event.target.files?.[0] ?? null)}
          type="file"
        />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button className="auth-button-shadow auth-submit-button w-full rounded px-4 py-2" disabled={loading} type="submit">
          {loading ? "Creating..." : "Create account"}
        </button>
      </form>
      <p className="text-sm">
        Already have an account? <Link className="underline" href="/login">Login</Link>
      </p>
    </main>
  );
}
