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
    <Component className={cn("leading-none", className)}>
      {title && <span className="leading-none mb-1 inline-block">{title} {required && <i>*</i>}</span>}
      {children}
      <p>{error}</p>
    </Component>
  )
}