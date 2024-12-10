import { PropsWithChildren } from "react";

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <div className="py-3 px-5">
      {children}
    </div>
  )
}