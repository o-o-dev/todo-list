"use client";

import { CATEGORY_COLORS, type CategoryColor } from "todo/lib/colors";
import { cn } from "todo/lib/utils";

interface ColorPickerProps {
  value: string;
  onChange: (color: CategoryColor) => void;
  disabled?: boolean;
}

export function ColorPicker({ value, onChange, disabled }: ColorPickerProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Select a color"
      className="flex flex-wrap gap-2"
    >
      {CATEGORY_COLORS.map((color) => {
        const isSelected = value === color.value;
        return (
          <button
            key={color.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={color.name}
            disabled={disabled}
            onClick={() => onChange(color.value)}
            className={cn(
              "size-7 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              isSelected && "ring-2 ring-offset-2 ring-ring",
              disabled && "cursor-not-allowed opacity-50"
            )}
            style={{ backgroundColor: color.value }}
          />
        );
      })}
    </div>
  );
}
