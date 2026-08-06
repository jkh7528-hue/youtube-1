import Link from "next/link";
import { ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline-light" | "ghost";

const variants: Record<Variant, string> = {
  primary:
    "bg-electric-600 text-white hover:bg-electric-700 focus-visible:outline-electric-700 shadow-sm shadow-electric-900/10",
  secondary:
    "bg-navy-900 text-white hover:bg-navy-800 focus-visible:outline-navy-900",
  "outline-light":
    "border border-white/30 text-white hover:bg-white/10 focus-visible:outline-white",
  ghost:
    "border border-navy-900/15 text-navy-900 hover:bg-navy-900/5 focus-visible:outline-navy-900",
};

export default function Button({
  children,
  href,
  variant = "primary",
  className = "",
  onClick,
  type = "button",
  icon,
}: {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  icon?: ReactNode;
}) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-sm px-6 py-3 text-sm font-semibold tracking-tight transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 cursor-pointer whitespace-nowrap ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
        {icon}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
      {icon}
    </button>
  );
}
