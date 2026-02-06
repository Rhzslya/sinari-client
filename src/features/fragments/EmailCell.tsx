import { Button } from "@/components/ui/button";
import { TruncatedTooltip } from "@/components/utils/truncatedTooltip";
import { maskEmail } from "@/model/user-model";
import { Check, Copy, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const EmailCell = ({ email }: { email: string }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setIsCopied(true);
      toast.success("Email copied to clipboard");

      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy email", err);
      toast.error("Failed to copy email");
    }
  };

  return (
    <div className="flex items-center gap-2 group">
      <div className="w-45">
        {" "}
        <span
          className={`text-xs ${isRevealed ? "text-foreground font-medium" : "text-muted-foreground font-mono"}`}
        >
          {isRevealed ? (
            <TruncatedTooltip text={email} className="truncate" />
          ) : (
            maskEmail(email)
          )}
        </span>
      </div>

      <div className="flex items-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground hover:text-primary"
          onClick={() => setIsRevealed(!isRevealed)}
          title={isRevealed ? "Hide email" : "Show email"}
        >
          {isRevealed ? (
            <EyeOff className="h-3.5 w-3.5" />
          ) : (
            <Eye className="h-3.5 w-3.5" />
          )}
        </Button>
        {isRevealed && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-emerald-600"
            onClick={handleCopy}
            title="Copy email"
          >
            {isCopied ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmailCell;
