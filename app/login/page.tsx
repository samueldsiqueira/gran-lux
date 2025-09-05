'use client';

import { useEffect } from 'react';

export default function LoginPage() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      // Initializes Google sign-in button
      const google = (window as any).google;
      if (google && google.accounts && google.accounts.id) {
        google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
          callback: (response: unknown) => {
            console.log(response);
          },
        });
        google.accounts.id.renderButton(
          document.getElementById('google-button') as HTMLElement,
          { theme: 'outline', size: 'large' }
        );
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  function handleEmailSignIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = (event.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
    console.log('Email login', email);
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 h-screen">
      <h1 className="text-2xl font-bold">Login</h1>
      <div id="google-button"></div>
      <form onSubmit={handleEmailSignIn} className="flex flex-col gap-2">
        <input type="email" name="email" placeholder="Seu e-mail" className="inp" />
        <button type="submit" className="btn">Entrar com email</button>
      </form>
    </div>
  );
}
