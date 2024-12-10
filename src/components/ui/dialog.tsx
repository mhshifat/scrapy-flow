"use client";

import { forwardRef, HTMLAttributes, PropsWithChildren, Ref } from "react";
import ClientOnly from "../client-only";
import Portal from "../portal";
import { cn } from "@/utils/helpers";
import Button from "./button";
import { X } from "lucide-react";

export default function Dialog({ children }: PropsWithChildren) {
  return (
    <ClientOnly>
      <Portal>
        {children}
      </Portal>
    </ClientOnly>
  )
}

interface DialogHeaderProps {
  onClose?: () => void;
}

function DialogHeader({ children, onClose }: PropsWithChildren<DialogHeaderProps>) {
  return (
    <div className="w-full py-2 px-3 flex items-start gap-5 sticky top-0 left-0 z-50 bg-background-secondary">
      <div className="flex-1">
        {children}
      </div>
      <Button onClick={onClose} size="icon" variant="ghost" className="shrink-0 p-0 w-auto flex items-center justify-center">
        <X className="size-4 text-foreground" />
      </Button>
    </div>
  )
}

interface DialogOverlayProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

function DialogOverlay({ className, ...props }: DialogOverlayProps, ref: Ref<HTMLDivElement>) {
  return (
    <div ref={ref} className={cn("fixed inset-0 w-full h-full bg-foreground/20 z-[-1px] isolate duration-200 ease-in-out transition-opacity opacity-0 pointer-events-none", className)} {...props} />
  )
}

interface DialogItemProps extends HTMLAttributes<HTMLDivElement> {
  position?: "right" | "left" | "center";
}

function DialogItem({ children, className, position = 'center' }: PropsWithChildren<DialogItemProps>, ref: Ref<HTMLDivElement>) {
  return (
    <div ref={ref} className={cn("fixed w-full min-w-[320px] max-w-[500px] overflow-y-auto flex flex-col bg-background opacity-0 z-[-1px] pointer-events-none transition-all duration-300 ease-in-out", {
      "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-110 max-h-[80dvh] rounded-md border border-border": position === 'center',
      "top-1/2 right-0 translate-x-full -translate-y-1/2 h-screen rounded-tl-md rounded-bl-md border-l border-border": position === 'right',
    }, className)}>
      {children}
    </div>
  )
}

function DialogBody({ children }: PropsWithChildren) {
  return (
    <div className="w-full py-3 px-3">
      {children}
    </div>
  )
}

Dialog.Overlay = forwardRef(DialogOverlay);
Dialog.Header = DialogHeader;
Dialog.Item = forwardRef(DialogItem);
Dialog.Body = DialogBody;