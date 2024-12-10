"use client";

import { createContext, PropsWithChildren, ReactElement, useCallback, useContext, useEffect, useRef, useState } from "react";
import Dialog from "../ui/dialog";
import { cn } from "@/utils/helpers";
import Divider from "../ui/divider";

interface DialogState {
  height?: number;
  className?: string;
  position?: "left" | "right" | "center";
  title?: string;
  description?: string;
  content: ReactElement;
}

interface DialogCtxState {
  openDialog: (params: DialogState) => void;
  closeDialog: () => void;
}

const DialogCtx = createContext<DialogCtxState | null>(null)

export default function DialogProvider({ children }: PropsWithChildren) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const currentDialogRef = useRef<HTMLDivElement>(null);
  const [dialogState, setDialogState] = useState<DialogState[]>([]);

  const openDialog = useCallback((params: DialogState) => {
    if (!currentDialogRef?.current) overlayRef.current?.classList?.add("z-50", "opacity-100", "pointer-events-auto");
    const handleTransitionEnd = () => {
      setTimeout(() => {
        setDialogState(values => values.map((v, idx) => idx === values.length - 1 ? ({
          ...v,
          className: v.position === "right" ? "z-50 opacity-100 pointer-events-auto !translate-x-0 !-translate-y-1/2" : "z-50 opacity-100 pointer-events-auto scale-100"
        }) : v));
      }, 0);
    }
    overlayRef?.current?.addEventListener("transitionend", handleTransitionEnd);
    currentDialogRef?.current?.addEventListener("transitionend", handleTransitionEnd);
    setDialogState((values) => [...values.map((v, idx) => idx === values.length - 1 ? ({
      ...v,
      className: v.position === 'right' ? "z-50 opacity-50 pointer-events-none scale-90 translate-x-[-10px]" : "z-50 opacity-50 pointer-events-none scale-90 translate-y-[calc(-50%-10px)]",
    }) : v), params]);
  }, []);

  const closeDialog = useCallback(() => {
    currentDialogRef?.current?.addEventListener("transitionend", (e) => {
      if (e.propertyName === 'transform') {
        setTimeout(() => {
          setDialogState(values => {
            const data = values.slice(0, -1).map((v, idx) => idx === values.length - 2 ? ({
              ...v,
              className: v.position === "right" ? "z-50 opacity-100 pointer-events-auto !translate-x-0 !-translate-y-1/2" : "z-50 opacity-100 pointer-events-auto scale-100"
            }) : v);
            if (!data.length) setTimeout(() => {
              overlayRef.current?.classList?.remove("z-50", "opacity-100", "pointer-events-auto");
            }, 100);
            return data;
          });
        }, 0);
      }
    });
    setTimeout(() => {
      setDialogState(values => values.map((v, idx) => idx === values.length - 1 ? ({
        ...v,
        className: "z-50 opacity-100 pointer-events-none scale-110"
      }) : v));
    }, 0);
  }, [dialogState]);

  return (
    <DialogCtx.Provider value={{
      openDialog,
      closeDialog
    }}>
      {children}

      <Dialog>
        <Dialog.Overlay
          ref={overlayRef}
          onClick={closeDialog}
        />
        {dialogState.map((dialog, dialogIdx) => (
          <Dialog.Item
            key={"Dialog_" + dialogIdx + "_" + dialog.title}
            className={cn(dialog.className)}
            {...dialogIdx===(dialogState.length - 1) ? {
              ref: currentDialogRef
            } : {}}
            position={dialog.position}
          >
            {(dialog.title || dialog.description) && (
              <>
                <Dialog.Header onClose={closeDialog}>
                  <h3 className="text-lg font-medium text-foreground">{dialog.title}</h3>
                  <p className="text-xs font-medium mt-1 text-foreground/50">{dialog.description}</p>
                </Dialog.Header>
                <Divider />
              </>
            )}
            <Dialog.Body>
              {dialog.content}
            </Dialog.Body>
          </Dialog.Item>
        ))}
      </Dialog>
    </DialogCtx.Provider>
  )
}

export function useDialog() {
  const res = useContext(DialogCtx);
  if (!res) throw new Error("Component needs to be wrapped with `DialogProvider`")
  return res;
}