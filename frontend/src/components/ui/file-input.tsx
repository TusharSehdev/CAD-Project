import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "./input";
import { Label } from "./label";

interface FileInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  acceptedFileTypes?: string;
}

const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  ({ className, label, description, acceptedFileTypes, ...props }, ref) => {
    return (
      <div className="grid w-full items-center gap-1.5">
        {label && <Label htmlFor={props.id}>{label}</Label>}
        <Input
          type="file"
          className={cn(
            "file:bg-primary file:text-primary-foreground cursor-pointer file:cursor-pointer file:border-0 file:mr-2 file:px-4 file:py-2 file:font-medium hover:file:bg-primary/90",
            className
          )}
          accept={acceptedFileTypes}
          ref={ref}
          {...props}
        />
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    );
  }
);

FileInput.displayName = "FileInput";

export { FileInput }; 