import { cn } from '@/utils/helpers';
import { cva } from 'class-variance-authority';
import { ButtonHTMLAttributes, PropsWithChildren } from "react";
import Spinner from './spinner';

const buttonVariants = cva("flex items-center text-sm justify-center font-medium rounded-md cursor-pointer transition disabled:bg-foreground/30 disabled:border-foreground/10 disabled:text-foreground/40 disabled:cursor-not-allowed", {
  variants: {
    variant: {
      default: "bg-foreground text-background border border-foreground hover:bg-background hover:text-foreground",
      ghost: "bg-background border border-background text-foreground hover:bg-foreground hover:text-background"
    },
    size: {
      default: "px-5 py-[7px]",
      icon: "aspect-square"
    }
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  }
})

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost";
  size?: "default" | "icon";
  loading?: boolean;
}

export default function Button({ children, loading, type, className, variant = "default", size = "default", ...restProps }: PropsWithChildren<ButtonProps>) {
  return (
    <button type={type || "submit"} className={cn(buttonVariants({
      variant,
      size,
      className
    }))} {...restProps}>
      {loading ? (
        <Spinner />
      ) : children}
    </button>
  )
}