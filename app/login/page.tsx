"use client";

import { useState, useId } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";

const Page = () => {
  const id = useId();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);
      router.push("/dashboard");
    } else {
      alert(data.message || "Login failed");
    }
  };

  return (
    <section className="relative min-h-screen w-full bg-white dark:bg-gray-900 overflow-hidden flex items-center justify-center">
      <FlickeringGrid
        className="absolute inset-0 z-0 w-full h-full"
        squareSize={9}
        gridGap={6}
        color="#6B7280"
        maxOpacity={0.1}
        flickerChance={0.1}
      />
      <div className="relative z-10 w-full max-w-md rounded-lg border border-border bg-white/80 dark:bg-gray-950/90 backdrop-blur p-8 shadow-lg">
        <div className="flex flex-col items-center gap-2 mb-6">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border"
            aria-hidden="true"
          >
            <svg
              className="stroke-zinc-800 dark:stroke-zinc-100"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 32 32"
            >
              <circle cx="16" cy="16" r="12" fill="none" strokeWidth="8" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-center text-gray-900 dark:text-white">
            Log in
          </h2>
          <p className="text-sm text-muted-foreground text-center">
            We just need a few details to get you started.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${id}-email`}>Email</Label>
              <Input
                id={`${id}-email`}
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${id}-password`}>Password</Label>
              <Input
                id={`${id}-password`}
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <Button type="submit" className="w-full">
            Log in
          </Button>
        </form>

        <div className="flex items-center gap-3 my-6 before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
          <span className="text-xs text-muted-foreground">Or</span>
        </div>

        <Button variant="outline" className="w-full">
          Continue with Google
        </Button>

        <p className="text-center text-xs text-muted-foreground mt-4">
          I have not registered yet{" "}
          <a className="underline hover:no-underline" href="/register">
            Register
          </a>
          .
        </p>
      </div>
    </section>
  );
};

export default Page;
