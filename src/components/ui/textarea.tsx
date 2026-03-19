import * as React from "react";

import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[120px] w-full rounded-xl border border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,1),rgba(248,250,252,0.96))] px-4 py-3 text-sm leading-6 text-slate-900 shadow-sm ring-offset-background transition-[transform,border-color,box-shadow,background-color] duration-200 hover:border-slate-300 hover:bg-white placeholder:text-slate-400 focus-visible:-translate-y-[1px] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/12 focus-visible:ring-offset-0 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
