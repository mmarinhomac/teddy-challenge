import * as React from "react";
import { FieldErrors } from "react-hook-form";

import { cn } from "../lib/utils";

interface InputErrorMessageProps
  extends Readonly<React.ComponentProps<"input">> {
  readonly name: string;
  readonly errors: FieldErrors;
}

function InputErrorMessage({
  className,
  type,
  name,
  errors,
  ...props
}: InputErrorMessageProps) {
  const message = React.useRef("Invalid field value");

  if (!errors) return null;

  const error = errors?.[name];

  if (!error) return null;

  if (typeof error?.message === "string") {
    message.current = error.message;
  }

  if (typeof error?.root?.message === "string") {
    message.current = error.root.message;
  }

  return (
    <p
      data-slot="form-message"
      className={cn("text-destructive text-sm", className)}
      {...props}
    >
      {message.current}
    </p>
  );
}

export { InputErrorMessage };
