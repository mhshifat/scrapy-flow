import { Toaster } from "sonner";
import { PropsWithChildren } from "react";
import DialogProvider from "./dialog-provider";
import QueryProvider from "./query-provider";
import NextTopLoader from 'nextjs-toploader';

export default async function Providers({ children }: PropsWithChildren) {
  return (
      <QueryProvider>
        <DialogProvider>
          <NextTopLoader showSpinner={false} color="#10b981" />
          <Toaster richColors />
          {children}
        </DialogProvider>
      </QueryProvider>
  )
}