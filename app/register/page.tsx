"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";

export default function RegisterPage() {
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
    // TODO: enviar dados para registro real
    signIn("credentials", { email, password });
  };

  return (
    <div className="p-4">
      <h1 className="mb-2 text-xl">Registro</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
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
          Registrar
        </button>
      </form>
    </div>
  );
}
