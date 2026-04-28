"use client";

import { useFormStatus } from "react-dom";
import cn from "classnames";

type Props = {
  children: React.ReactNode;
  pendingLabel: string;
  className?: string;
};

export default function SubmitButton({ children, pendingLabel, className }: Props) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={cn(
        "rounded-md px-3 py-1.5 text-xs font-medium transition-colors inline-flex items-center gap-1.5",
        pending && "opacity-60 cursor-wait",
        className
      )}
    >
      {pending && (
        <span
          aria-hidden
          className="inline-block w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin"
        />
      )}
      <span>{pending ? pendingLabel : children}</span>
    </button>
  );
}
