import { cn } from "@/utils/helpers";
import { HTMLAttributes, PropsWithChildren } from "react";

export default function Tab({ children, className }: PropsWithChildren & HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("", className)}>
      {children}
    </div>
  )
}

Tab.List = ({ children, className }: PropsWithChildren & HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("", className)}>
      {children}
    </div>
  )
}

Tab.Item = ({ children, className }: PropsWithChildren & HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("", className)}>
      {children}
    </div>
  )
}

Tab.Content = ({ className }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("", className)}>
      <p>Tab Content</p>
    </div>
  )
}