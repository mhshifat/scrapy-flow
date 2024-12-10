import { cn } from "@/utils/helpers";

interface DividerProps {
  orientation?: "vertical";
  className?: string;
}

export default function Divider({ className, orientation }: DividerProps) {
  return (
    <div className={cn("bg-border h-[1px]", className, {
      "w-[1px] h-auto flex self-stretch": orientation === 'vertical'
    })} />
  )
}