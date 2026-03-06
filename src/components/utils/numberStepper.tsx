import type { NumberStepperProps } from "@/types/type";
import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

export function NumberStepper({
  value,
  onChange,
  step = 1,
  min = 0,
  disabled,
  prefix,
  suffix,
  placeholder,
  onBlur,
  onKeyDown,
  onFocus,
  className,
}: NumberStepperProps & { className?: string }) {
  const safeValue = value ?? 0;
  const displayValue = safeValue === 0 ? "" : safeValue;

  const handleDecrement = () => {
    if (disabled) return;
    const newValue = Math.max(min, Number(value || 0) - step);
    onChange(newValue);
  };

  const handleIncrement = () => {
    if (disabled) return;
    const newValue = Number(value || 0) + step;
    onChange(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue === "") {
      onChange(undefined);
      return;
    }

    const parsedValue = Number(inputValue);
    if (!isNaN(parsedValue)) {
      onChange(parsedValue);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0 rounded-r-none border-r-0"
        onClick={handleDecrement}
        disabled={disabled || safeValue <= min}
      >
        <Minus className="size-3.5" />
      </Button>

      <div className="relative flex-1">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] sm:text-xs font-medium text-muted-foreground pointer-events-none">
            {prefix}
          </span>
        )}

        <Input
          type="number"
          className={cn(
            "h-8 rounded-none bg-input/50 border-border text-center", // Base class
            "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none", // Hapus panah bawaan browser
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary",
            className,
          )}
          placeholder={placeholder}
          value={displayValue}
          onChange={handleInputChange}
          disabled={disabled}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
        />
        {suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] sm:text-xs text-muted-foreground font-medium pointer-events-none select-none">
            {suffix}
          </div>
        )}
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0 rounded-l-none border-l-0"
        onClick={handleIncrement}
        disabled={disabled}
      >
        <Plus className="size-3.5" />
      </Button>
    </div>
  );
}
