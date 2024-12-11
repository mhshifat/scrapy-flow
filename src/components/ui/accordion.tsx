import { PropsWithChildren } from "react";

export default function Accordion({ children }: PropsWithChildren) {
  return (
    <div>
      {children}
    </div> // TODO:
  )
}

Accordion.Item = ({ children }: PropsWithChildren) => {
  return (
    <div>
      {children}
    </div>
  )
}

Accordion.Trigger = ({ children }: PropsWithChildren) => {
  return (
    <div>
      {children}
    </div>
  )
}

Accordion.Body = ({ children }: PropsWithChildren) => {
  return (
    <div>
      {children}
    </div>
  )
}