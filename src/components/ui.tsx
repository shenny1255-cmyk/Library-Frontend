import { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight, Inbox, type LucideIcon } from "lucide-react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-card border border-line bg-surface p-5 shadow-card transition-all duration-200 hover:shadow-lg ${className}`}
    >
      {children}
    </div>
  );
}

const statCardColors: Record<string, string> = {
  blue: "bg-sky-500",
  green: "bg-emerald-600",
  orange: "bg-amber-500",
  red: "bg-rose-600",
};

export function StatCard({
  label,
  value,
  icon: Icon,
  color = "blue",
  href,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: "blue" | "green" | "orange" | "red";
  href?: string;
}) {
  return (
    <div className={`overflow-hidden rounded-md text-white shadow-md ${statCardColors[color]}`}>
      <div className="flex items-center justify-between p-5">
        <div>
          <p className="font-display text-4xl font-bold leading-none">{value}</p>
          <p className="mt-2 text-sm">{label}</p>
        </div>
        <Icon size={54} className="opacity-25" />
      </div>
      {href && (
        <Link
          href={href}
          className="flex items-center justify-between bg-black/10 px-4 py-2 text-xs font-medium transition-colors hover:bg-black/20"
        >
          <span>More info</span>
          <ChevronRight size={14} />
        </Link>
      )}
    </div>
  );
}

const statusStyles: Record<string, string> = {
  BORROWED: "text-brass-dark",
  RETURNED: "text-forest",
  OVERDUE: "text-stamp-red",
};

const statusLabels: Record<string, string> = {
  BORROWED: "Dang muon",
  RETURNED: "Da tra",
  OVERDUE: "Qua han",
};

export function StatusStamp({ status }: { status: string }) {
  return (
    <span className={`library-stamp ${statusStyles[status] ?? "text-muted"}`}>
      {statusLabels[status] ?? status}
    </span>
  );
}

export function PrimaryButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-md bg-forest px-4 py-2 text-sm font-medium text-paper shadow-sm transition-all duration-150 hover:bg-forest-dark hover:shadow active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 ${
        props.className ?? ""
      }`}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-md border border-line bg-surface px-4 py-2 text-sm font-medium text-ink transition-all duration-150 hover:bg-paper hover:shadow-sm active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 ${
        props.className ?? ""
      }`}
    >
      {children}
    </button>
  );
}

export function DangerButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-1.5 rounded-md border border-stamp-red/40 px-3 py-1.5 text-xs font-medium text-stamp-red transition-all duration-150 hover:bg-stamp-red/10 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 ${
        props.className ?? ""
      }`}
    >
      {children}
    </button>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest ${
        props.className ?? ""
      }`}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest ${
        props.className ?? ""
      }`}
    />
  );
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted">{children}</label>;
}

export function ErrorNote({ message }: { message: string }) {
  return (
    <p className="rounded-md border border-stamp-red/30 bg-stamp-red/5 px-3 py-2 text-sm text-stamp-red">
      {message}
    </p>
  );
}

export function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
}: {
  title: string;
  description?: string;
  icon?: LucideIcon;
}) {
  return (
    <Card className="flex flex-col items-center gap-2 py-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-paper text-muted">
        <Icon size={22} />
      </div>
      <p className="font-display text-lg text-ink">{title}</p>
      {description && <p className="text-sm text-muted">{description}</p>}
    </Card>
  );
}