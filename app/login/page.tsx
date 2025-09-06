"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (session) {
    return (
      <div className="p-4">
        <p>Conectado como {session.user?.email}</p>
        <button onClick={() => signOut()}>Sair</button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signIn("credentials", { email, password });
  };

  return (
    <div className="p-4">
      <h1 className="mb-2 text-xl">Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2"
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2"
        />
        <button type="submit" className="btn">
          Entrar
        </button>
      </form>
      <button onClick={() => signIn("google")} className="btn">
        Entrar com Google
      </button>
    </div>
  );
}
