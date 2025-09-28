import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../y_ui/base/utils";
import { Button } from "../y_ui/base/button";

interface PublisherLayoutProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  heroBadge?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function PublisherLayout({
  title,
  subtitle,
  actions,
  heroBadge,
  children,
  className,
}: PublisherLayoutProps) {
  const location = useLocation();
  const isCompanyInfo = location.pathname.startsWith("/publisher/info");

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-publisher-root text-white">
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-12 top-24 h-80 w-80 rounded-full bg-blue-500/15 blur-[150px]" />
          <div className="absolute right-10 top-10 h-72 w-72 rounded-full bg-purple-500/12 blur-[150px]" />
        </div>

        <main className="relative mx-auto w-full max-w-7xl px-10 pb-28 pt-28 md:px-14 lg:px-20">
          <div className="mb-8 flex justify-end"></div>

          <section className="rounded-[32px] border border-white/12 bg-publisher-card p-12 shadow-[0_34px_95px_rgba(3,7,18,0.6)]">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3">
                {heroBadge}
                <div className="space-y-2">
                  <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">
                    {title}
                  </h1>
                  {subtitle ? (
                    <p className="text-sm text-white/70">{subtitle}</p>
                  ) : null}
                </div>
              </div>
              {actions ? (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                  {actions}
                </div>
              ) : null}
            </div>
          </section>

          <div className={cn("mt-16 flex flex-col gap-16", className)}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
