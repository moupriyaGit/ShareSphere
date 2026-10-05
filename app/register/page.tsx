"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FormInput from "@/components/FormInput";
import Button from "@/components/Button";
import { UserRole } from "@/types";
import { HeartHandshake, User, Building2, CheckCircle2, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("donor");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create account.");
      }

      setSuccess("Account created successfully! Redirecting...");

      // Save user to localStorage
      if (data.data) {
        localStorage.setItem("sharesphere_user", JSON.stringify(data.data));
        window.dispatchEvent(new Event("sharesphere_auth_change"));
      }

      setTimeout(() => {
        if (role === "ngo") {
          router.push("/ngo/dashboard");
        } else {
          router.push("/donor/dashboard");
        }
      }, 1000);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Registration failed.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 mb-4 group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <span className="font-bold text-2xl text-forest-950">
              Share<span className="text-emerald-600">Sphere</span>
            </span>
          </Link>
          <h1 className="text-2xl font-extrabold text-gray-900">
            Create your account
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Join the network of compassionate givers and changemakers.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selector */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                I want to join as a:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("donor")}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-xs font-bold transition ${
                    role === "donor"
                      ? "border-emerald-600 bg-emerald-50/70 text-emerald-800 ring-2 ring-emerald-500/20"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <User className="w-5 h-5 text-emerald-600" />
                  Donor / Individual
                </button>
                <button
                  type="button"
                  onClick={() => setRole("ngo")}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-xs font-bold transition ${
                    role === "ngo"
                      ? "border-emerald-600 bg-emerald-50/70 text-emerald-800 ring-2 ring-emerald-500/20"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Building2 className="w-5 h-5 text-emerald-600" />
                  NGO / Organization
                </button>
              </div>
            </div>

            <FormInput
              label={role === "ngo" ? "Organization / NGO Name" : "Full Name"}
              placeholder={role === "ngo" ? "Hope Foundation" : "Priya Patel"}
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <FormInput
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <FormInput
              label="Password"
              type="password"
              placeholder="Minimum 6 characters"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              helperText="Must be at least 6 characters."
            />

            <Button
              type="submit"
              size="lg"
              variant="primary"
              isLoading={loading}
              className="w-full mt-2"
            >
              Register as {role === "ngo" ? "NGO" : "Donor"}
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-emerald-700 hover:text-emerald-800 font-bold underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

