import React from 'react';
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';

export const metadata: Metadata = {
  title: "LumiRider Pro",
  description: "Rider Técnico para Iluminação",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Suppress React DevTools errors IMMEDIATELY - inline for earliest execution */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                if(typeof window!=='undefined'){
                  const OriginalError=window.Error;
                  window.Error=function(message){
                    if(typeof message==='string'&&(message.includes('not valid semver')||message.includes('validateAndParse')||message.includes('react_devtools'))){
                      const err=new OriginalError('');err.stack='';return err;
                    }
                    return new OriginalError(message);
                  };
                  window.Error.prototype=OriginalError.prototype;
                  const originalError=console.error;
                  const originalWarn=console.warn;
                  const shouldSuppress=args=>{
                    const message=String(args[0]||'');
                    return message.includes('not valid semver')||message.includes('react_devtools_backend')||message.includes('validateAndParse')||message.includes('Invalid argument');
                  };
                  console.error=function(...args){if(shouldSuppress(args))return;originalError.apply(console,args);};
                  console.warn=function(...args){if(shouldSuppress(args))return;originalWarn.apply(console,args);};
                  window.addEventListener('error',function(event){
                    if(event.message&&(event.message.includes('not valid semver')||event.message.includes('react_devtools'))){
                      event.preventDefault();event.stopPropagation();return false;
                    }
                  },true);
                  window.addEventListener('unhandledrejection',function(event){
                    const reason=String(event.reason||'');
                    if(reason.includes('not valid semver')||reason.includes('react_devtools')){
                      event.preventDefault();event.stopPropagation();return false;
                    }
                  },true);
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
      >
        {/* Additional suppression script */}
        {process.env.NODE_ENV === 'development' && (
          <Script
            src="/suppress-devtools-error.js"
            strategy="beforeInteractive"
          />
        )}
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}