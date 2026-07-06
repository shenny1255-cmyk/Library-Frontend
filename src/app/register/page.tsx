"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client/react";
import { Library, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { PrimaryButton } from "@/components/ui";
import { REGISTER } from "@/graphql/mutations";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const registerMutation = useMutation(REGISTER);
  const register = registerMutation[0];
  const submitting = registerMutation[1].loading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Mat khau nhap lai khong khop.");
      return;
    }

    try {
      const result = await register({ variables: { name: name, email: email, password: password } });
      const data = result.data as any;
      localStorage.setItem("token", data.register.token);
      localStorage.setItem("userName", data.register.user.name);
      router.push("/portal");
    } catch (err: any) {
      setErrorMessage(err.message || "Dang ky that bai");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-forest-dark via-forest to-sky-700 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-2xl">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-forest/10 text-forest">
            <Library size={28} />
          </div>
          <h1 className="mt-3 font-display text-2xl font-bold text-slate-800">Library Manager</h1>
          <p className="mt-1 text-sm text-slate-500">Tao tai khoan moi</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">Ho ten</label>
            <div className="relative">
              <User size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={name}
                onChange={function (e) { setName(e.target.value); }}
                placeholder="Nguyen Van A"
                className="w-full rounded-md border border-slate-200 bg-slate-50 py-2 pl-10 pr-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">Email</label>
            <div className="relative">
              <Mail size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={function (e) { setEmail(e.target.value); }}
                placeholder="ban@example.com"
                className="w-full rounded-md border border-slate-200 bg-slate-50 py-2 pl-10 pr-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">Mat khau</label>
            <div className="relative">
              <Lock size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={function (e) { setPassword(e.target.value); }}
                placeholder="........"
                className="w-full rounded-md border border-slate-200 bg-slate-50 py-2 pl-10 pr-10 text-sm text-slate-800 placeholder:text-slate-400 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
              />
              <button
                type="button"
                onClick={function () { setShowPassword(!showPassword); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
              Nhap lai mat khau
            </label>
            <div className="relative">
              <Lock size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={function (e) { setConfirmPassword(e.target.value); }}
                placeholder="........"
                className="w-full rounded-md border border-slate-200 bg-slate-50 py-2 pl-10 pr-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
              />
            </div>
          </div>

          {errorMessage && (
            <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600">
              {errorMessage}
            </p>
          )}

          <PrimaryButton type="submit" disabled={submitting} className="w-full justify-center py-2.5">
            {submitting ? "Dang tao tai khoan..." : "Dang ky"}
          </PrimaryButton>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Da co tai khoan?{" "}
          <Link href="/login" className="font-medium text-forest hover:underline">
            Dang nhap
          </Link>
        </p>
      </div>
    </div>
  );
}