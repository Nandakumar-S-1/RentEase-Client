import React from 'react';
import { Logo } from './Logo';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  showLeftPanel?: boolean;
  leftPanelTitle?: string;
  leftPanelDescription?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  showLeftPanel = true,
//   leftPanelTitle,
  leftPanelDescription,
}) => {
  return (
    <div className="flex min-h-screen">
      {showLeftPanel && (
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-gradient-to-b from-[hsl(260,20%,18%)] to-[hsl(260,25%,12%)] p-12 text-white">
          <Logo size="md" />
          <p className="max-w-md text-lg leading-relaxed text-white/70">
            {leftPanelDescription}
          </p>
          <div />
        </div>
      )}
      <div className={`flex flex-1 flex-col items-center overflow-y-auto bg-card px-6 py-10 ${!showLeftPanel ? 'justify-center' : ''}`}>
        <div className="w-full max-w-md">
          <div className="mb-8 flex lg:hidden justify-center">
            <Logo size="lg" />
          </div>
          <h1 className="mb-1 text-center text-2xl font-bold text-card-foreground">
            {title}
          </h1>
          
          {subtitle && (
            <p className="mb-6 text-center text-sm text-primary">
              {subtitle}
            </p>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};