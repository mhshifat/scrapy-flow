import { cn } from "@/utils/helpers";
import { HTMLAttributes, PropsWithChildren } from "react";

export default function Accordion({ children, className }: PropsWithChildren & HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("", className)}>
      {children}
    </div> // TODO:
  )
}

Accordion.Item = ({ children, className }: PropsWithChildren & HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("", className)}>
      {children}
    </div>
  )
}

Accordion.Trigger = ({ children, className }: PropsWithChildren & HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("", className)}>
      {children}
    </div>
  )
}

Accordion.Body = ({ children, className }: PropsWithChildren & HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("", className)}>
      {children}
    </div>
  )
}