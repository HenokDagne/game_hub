"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeClosed } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profilePreviewUrl, setProfilePreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!profileImage) {
      setProfilePreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(profileImage);
    setProfilePreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [profileImage]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    const payload = new FormData();
    payload.append("name", name.trim());
    payload.append("email", email.trim());
    payload.append("password", password);
    payload.append("confirmPassword", confirmPassword);

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
        <div className="flex justify-center">
          <div className="rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] p-[3px] shadow-sm">
            {profilePreviewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt="Selected profile preview"
                className="h-20 w-20 rounded-full border-2 border-white object-cover"
                src={profilePreviewUrl}
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-white bg-black/5 text-sm font-semibold text-black/60">
                Avatar
              </div>
            )}
          </div>
        </div>
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
            className="rounded border border-black/20 px-3 py-2 text-sm"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            type="button"
          >
            {showPassword ? <Eye className="h-4 w-4" /> : <EyeClosed className="h-4 w-4" />}
          </button>
        </div>
        <div className="flex gap-2">
          <input
            className="w-full rounded border border-black/20 px-3 py-2"
            minLength={6}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Confirm password"
            required
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
          />
          <button
            className="rounded border border-black/20 px-3 py-2 text-sm"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            type="button"
          >
            {showConfirmPassword ? <Eye className="h-4 w-4" /> : <EyeClosed className="h-4 w-4" />}
          </button>
        </div>
        <input
          accept="image/*"
          className="w-full rounded border border-black/20 px-3 py-2"
          onChange={(event) => setProfileImage(event.target.files?.[0] ?? null)}
          type="file"
        />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button
          className="auth-button-shadow auth-submit-button flex w-full items-center justify-center gap-2 rounded px-4 py-2"
          disabled={loading}
          type="submit"
        >
          {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : null}
          <span>{loading ? "Creating..." : "Create account"}</span>
        </button>
      </form>
      <p className="text-sm">
        Already have an account? <Link className="underline" href="/login">Login</Link>
      </p>
    </main>
  );
}
