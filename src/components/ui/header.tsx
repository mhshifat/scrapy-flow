import { cn } from "@/utils/helpers";
import { HTMLAttributes, PropsWithChildren } from "react";

interface HeaderProps extends HTMLAttributes<HTMLDivElement> {}

export default function Header({ children, className }: PropsWithChildren<HeaderProps>) {
  return (
    <div className={cn("flex flex-col", className)}>
      {children}
    </div>
  )
}

Header.Title = ({ children }: PropsWithChildren) => {
  return (
    <h3 className="text-3xl font-bold">{children}</h3>
  )
}

Header.Description = ({ children }: PropsWithChildren) => {
  return (
    <p className="m-0 text-foreground font-medium">{children}</p>
  )
}