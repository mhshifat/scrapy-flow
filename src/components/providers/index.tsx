import { Toaster } from "sonner";
import { PropsWithChildren } from "react";
import DialogProvider from "./dialog-provider";
import QueryProvider from "./query-provider";

export default async function Providers({ children }: PropsWithChildren) {
  return (
      <QueryProvider>
        <DialogProvider>
          <Toaster richColors />
            {children}
        </DialogProvider>
      </QueryProvider>
  )
}