import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-transparent text-sm font-semibold ring-offset-background transition-[transform,box-shadow,background-color,border-color,color,opacity] duration-200 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none active:translate-y-px active:scale-[0.99] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[linear-gradient(180deg,hsl(var(--primary)),rgba(30,64,175,0.94))] text-primary-foreground shadow-[0_12px_24px_rgba(30,64,175,0.2)] hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-[0_16px_30px_rgba(30,64,175,0.24)]",
        destructive:
          "bg-[linear-gradient(180deg,hsl(var(--destructive)),rgba(220,38,38,0.94))] text-destructive-foreground shadow-[0_10px_24px_rgba(220,38,38,0.18)] hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-[0_14px_28px_rgba(220,38,38,0.22)]",
        outline:
          "border-slate-200 bg-white/95 text-slate-700 shadow-sm backdrop-blur hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:text-slate-950 hover:shadow-[0_10px_22px_rgba(15,23,42,0.06)]",
        secondary:
          "bg-slate-100 text-slate-800 shadow-sm hover:-translate-y-0.5 hover:bg-slate-200 hover:shadow-[0_10px_22px_rgba(15,23,42,0.05)]",
        ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-950 focus-visible:bg-slate-100",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-4 py-2.5",
        sm: "h-9 rounded-lg px-3.5 text-xs",
        lg: "h-12 rounded-xl px-6 text-sm",
        icon: "h-11 w-11 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
