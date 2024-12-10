import { cn } from '@/utils/helpers';
import { cva } from 'class-variance-authority';
import { HTMLAttributes, PropsWithChildren } from "react";

const badgeVariants = cva("flex items-center text-sm justify-center font-medium rounded-md cursor-pointer transition disabled:bg-foreground/30 disabled:border-foreground/10 disabled:text-foreground/60 disabled:cursor-not-allowed px-2", {
  variants: {
    variant: {
      default: "bg-foreground text-background border border-foreground",
    }
  },
  defaultVariants: {
    variant: "default",
  }
})

interface BadgeProps extends HTMLAttributes<HTMLButtonElement> {
  variant?: "default";
}

export default function Badge({ children, className, variant = "default", ...restProps }: PropsWithChildren<BadgeProps>) {
  return (
    <span className={cn(badgeVariants({
      variant,
      className
    }))} {...restProps}>
      {children}
    </span>
  )
}