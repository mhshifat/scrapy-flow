import { cn } from "@/utils/helpers";
import { PropsWithChildren } from "react";

interface LabelProps {
  title?: string;
  className?: string;
  required?: boolean;
  error?: string;
  as?: "label" | "div";
}

export default function Label({ as = "label", className, error, required, children, title }: PropsWithChildren<LabelProps>) {
  const Component = as;
  
  return (
    <Component className={cn("", className)}>
      {title && <span>{title} {required && <i>*</i>}</span>}
      {children}
      <p>{error}</p>
    </Component>
  )
}