import { PropsWithChildren } from "react";
import { useFormContext } from "react-hook-form";

interface FormProps {
  disabled?: boolean;
  onSubmit: (values: unknown) => void
}

export default function Form({ children, disabled, onSubmit }: PropsWithChildren<FormProps>) {
  const { handleSubmit } = useFormContext();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <fieldset disabled={disabled} className="p-0 m-0 outline-none border-none shadow-none flex flex-col gap-3">
        {children}
      </fieldset>
    </form>
  )
}