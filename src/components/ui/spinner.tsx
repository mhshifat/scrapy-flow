import { cn } from "@/utils/helpers";
import { Loader2 } from "lucide-react";

export default function Spinner({ className, size }: { className?: string, size?: number }) {
  return (
    <div className={cn("flex justify-center items-center w-full z-50", className)}>
      <Loader2 className="size-4 animate-spin text-foreground/50" style={{
        ...size?{
          width: size,
          height: size,
        }:{}
      }} />
    </div>
  )
}