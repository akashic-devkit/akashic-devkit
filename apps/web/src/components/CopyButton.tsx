import React, { useState } from "react";
import { Button, buttonVariants } from "./ui/button";
import { Copy, Check } from "lucide-react";
import { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

type Props = Pick<React.ComponentProps<"button">, "className"> &
  Pick<VariantProps<typeof buttonVariants>, "size" | "variant"> & {
    copyText: string;
  };

export default function CopyButton({ className, variant = "ghost", size = "icon", copyText }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (copyText: string) => {
    if (copied) return;
    try {
      await navigator.clipboard.writeText(copyText);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1000);
    } catch (err) {
      console.error("copy error:", err);
    }
  };

  return (
    <Button
      className={cn(className, "[&_svg]:size:4")}
      variant={variant}
      size={size}
      onClick={() => handleCopy(copyText)}
    >
      {!copied ? <Copy /> : <Check />}
    </Button>
  );
}
