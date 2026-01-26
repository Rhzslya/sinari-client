import type { NumberStepperProps } from "@/types/type";
import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";
import { Input } from "../ui/input";

export function NumberStepper({
  value,
  onChange,
  step = 1,
  min = 0,
  disabled,
  prefix,
  placeholder,
}: NumberStepperProps) {
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

  return (
    <div className="flex items-center gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-6 w-6 shrink-0 rounded-r-none border-r-0"
        onClick={handleDecrement}
        disabled={disabled || value <= min}
      >
        <Minus className="size-3" />
      </Button>

      <div className="relative flex-1">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
            {prefix}
          </span>
        )}
        <Input
          type="number"
          className={`h-8 rounded-none bg-input/50 border-border text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary ${
            prefix ? "pl-8" : "px-2"
          }`}
          placeholder={placeholder}
          value={value === 0 ? "" : value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
        />
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-6 w-6 shrink-0 rounded-l-none border-l-0"
        onClick={handleIncrement}
        disabled={disabled}
      >
        <Plus className="size-3" />
      </Button>
    </div>
  );
}
