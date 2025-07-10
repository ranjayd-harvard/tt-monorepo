#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function createService(serviceName) {
  const servicePath = `apps/${serviceName}`;
  
  // Create Next.js app
  execSync(`npx create-next-app@latest ${servicePath} --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`, { stdio: 'inherit' });
  
  // Update package.json
  const packageJsonPath = path.join(servicePath, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  packageJson.name = `@repo/${serviceName}`;
  packageJson.dependencies = {
    ...packageJson.dependencies,
    '@repo/ui': '*',
    '@repo/auth': '*',
    '@repo/config': '*',
    'next-auth': '^4.24.0',
  };
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  
  // Create custom configs
  createServiceConfigs(servicePath);
  createServicePages(servicePath, serviceName);
}

function createServiceConfigs(servicePath) {
  // Tailwind config
  const tailwindConfig = `
const config = require('@repo/config/tailwind');

module.exports = {
  ...config,
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
};
`;
  
  fs.writeFileSync(path.join(servicePath, 'tailwind.config.js'), tailwindConfig);
  
  // Next.js config
  const nextConfig = `
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@repo/ui', '@repo/auth', '@repo/config'],
};

module.exports = nextConfig;
`;
  
  fs.writeFileSync(path.join(servicePath, 'next.config.js'), nextConfig);
}

function createServicePages(servicePath, serviceName) {
  // Create API auth route
  const authDir = path.join(servicePath, 'src/app/api/auth/[...nextauth]');
  fs.mkdirSync(authDir, { recursive: true });
  
  const authRoute = `
import NextAuth from 'next-auth'
import { authOptions } from '@repo/auth/config'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
`;
  
  fs.writeFileSync(path.join(authDir, 'route.ts'), authRoute);
  
  // Create main layout
  const layoutContent = `
import './globals.css'
import { Inter } from 'next/font/google'
import { SessionProvider } from '@repo/auth/nextauth'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
`;
  
  fs.writeFileSync(path.join(servicePath, 'src/app/layout.tsx'), layoutContent);
  
  // Create main page
  const pageContent = `
'use client'

import { Button } from '@repo/ui/components'
import { useSession, signIn, signOut } from 'next-auth/react'

export default function Home() {
  const { data: session } = useSession()

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">${serviceName.charAt(0).toUpperCase() + serviceName.slice(1)}</h1>
      
      {session ? (
        <div>
          <p className="mb-4">Welcome, {session.user?.name}!</p>
          <Button onClick={() => signOut()}>Sign Out</Button>
        </div>
      ) : (
        <div>
          <p className="mb-4">Please sign in to continue</p>
          <Button onClick={() => signIn()}>Sign In</Button>
        </div>
      )}
    </main>
  )
}
`;
  
  fs.writeFileSync(path.join(servicePath, 'src/app/page.tsx'), pageContent);
}

// Create services
const services = ['rest-service', 'menu-service', 'blog-service'];
services.forEach(createService);

console.log('All services created successfully!');