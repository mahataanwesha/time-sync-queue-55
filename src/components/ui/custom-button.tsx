import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-soft hover:bg-primary-hover hover:shadow-[var(--shadow-hover)]",
        secondary: "gradient-secondary text-secondary-foreground shadow-soft hover:shadow-[var(--shadow-hover)]",
        success: "bg-success text-success-foreground shadow-soft hover:opacity-90",
        warning: "bg-warning text-warning-foreground shadow-soft hover:opacity-90",
        destructive: "bg-destructive text-destructive-foreground shadow-soft hover:opacity-90",
        outline: "border border-border bg-card text-card-foreground shadow-soft hover:bg-accent hover:text-accent-foreground",
        ghost: "text-foreground hover:bg-accent hover:text-accent-foreground",
        hero: "gradient-hero text-white font-bold shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] hover:scale-105 transition-bounce",
        card: "gradient-card text-foreground border border-border shadow-card hover:shadow-[var(--shadow-hover)] card-hover",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-9 px-4 py-2 text-xs",
        lg: "h-14 px-8 py-4 text-base",
        xl: "h-16 px-10 py-5 text-lg",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const CustomButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
CustomButton.displayName = "CustomButton";

export { CustomButton, buttonVariants };