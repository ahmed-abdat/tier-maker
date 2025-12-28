import * as React from "react";
import { cn } from "@/lib/utils";

const InputGroupContext = React.createContext<{ id: string } | null>(null);

interface InputGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  id?: string;
}

const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(
  (props, ref) => {
    const { className, id: providedId, ...restProps } = props;
    const generatedId = React.useId();
    const id = providedId ?? generatedId;

    return (
      <InputGroupContext.Provider value={{ id }}>
        <div
          ref={ref}
          className={cn("flex flex-row items-center", className)}
          {...restProps}
        />
      </InputGroupContext.Provider>
    );
  }
);
InputGroup.displayName = "InputGroup";

interface InputGroupTextProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const InputGroupText = React.forwardRef<HTMLDivElement, InputGroupTextProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "border-input bg-muted ring-offset-background flex h-10 items-center rounded-l-md border px-3 py-2 text-sm",
          className
        )}
        {...props}
      />
    );
  }
);
InputGroupText.displayName = "InputGroupText";

interface InputGroupInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: string;
}

const InputGroupInput = React.forwardRef<
  HTMLInputElement,
  InputGroupInputProps
>(({ className, type, ...props }, ref) => {
  const context = React.useContext(InputGroupContext);
  const id = context?.id;

  return (
    <input
      ref={ref}
      id={id}
      type={type}
      className={cn(
        "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-r-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
});
InputGroupInput.displayName = "InputGroupInput";

export { InputGroup, InputGroupText, InputGroupInput };
