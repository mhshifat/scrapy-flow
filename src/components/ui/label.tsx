import { PropsWithChildren } from "react";

interface LabelProps {
  title?: string;
  required?: boolean;
  error?: string;
  as?: "label" | "div";
}

export default function Label({ as = "label", error, required, children, title }: PropsWithChildren<LabelProps>) {
  const Component = as;
  
  return (
    <Component>
      {title && <span>{title} {required && <i>*</i>}</span>}
      {children}
      <p>{error}</p>
    </Component>
  )
}