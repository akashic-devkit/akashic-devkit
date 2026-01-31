import { useState } from "react";
import { Button } from "./ui/button";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  text: string;
}

export default function CopyButton({ className, text }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (text: string) => {
    if (copied) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1000);
    } catch (err) {
      console.error("copy error:", err);
    }
  };

  return (
    <Button className={cn(className, "[&_svg]:size-4")} variant="ghost" onClick={() => handleCopy(text)}>
      {!copied ? <Copy /> : <Check />}
    </Button>
  );
}
