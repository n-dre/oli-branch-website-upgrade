import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

const AccordionCtx = createContext(null);

function useAccordion() {
  const ctx = useContext(AccordionCtx);
  if (!ctx) throw new Error("Accordion components must be used inside <Accordion />");
  return ctx;
}

export function Accordion({
  type = "single",
  collapsible = true,
  defaultValue,
  value: controlledValue,
  onValueChange,
  className,
  children,
}) {
  const isControlled = controlledValue !== undefined;

  const [uncontrolledValue, setUncontrolledValue] = useState(
    defaultValue ?? (type === "single" ? "" : [])
  );

  const currentValue = isControlled ? controlledValue : uncontrolledValue;

  const setValue = useCallback(
    (next) => {
      if (!isControlled) setUncontrolledValue(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange]
  );

  const api = useMemo(
    () => ({
      type,
      collapsible,
      value: currentValue,
      setValue,
    }),
    [type, collapsible, currentValue, setValue]
  );

  return (
    <AccordionCtx.Provider value={api}>
      <div className={cn("w-full", className)}>{children}</div>
    </AccordionCtx.Provider>
  );
}

export function AccordionItem({ value, className, children }) {
  return (
    <div className={cn("border-b", className)} data-acc-item={value}>
      {children}
    </div>
  );
}

export function AccordionTrigger({ className, children }) {
  const { type, collapsible, value, setValue } = useAccordion();

  const onClick = (e) => {
    const itemEl = e.currentTarget.closest("[data-acc-item]");
    const itemValue = itemEl?.getAttribute("data-acc-item") || "";

    if (type === "single") {
      const isOpen = value === itemValue;
      if (isOpen) {
        if (collapsible) setValue("");
      } else {
        setValue(itemValue);
      }
    } else {
      const arr = Array.isArray(value) ? value : [];
      const isOpen = arr.includes(itemValue);
      setValue(isOpen ? arr.filter((v) => v !== itemValue) : [...arr, itemValue]);
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between py-4 text-sm font-medium transition-colors hover:underline",
        className
      )}
    >
      <span>{children}</span>
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </button>
  );
}

export function AccordionContent({ className, children }) {
  const { type, value } = useAccordion();

  return (
    <div
      className="overflow-hidden"
      ref={(el) => {
        if (!el) return;
        const itemEl = el.closest("[data-acc-item]");
        const itemValue = itemEl?.getAttribute("data-acc-item") || "";

        const open =
          type === "single"
            ? value === itemValue
            : Array.isArray(value) && value.includes(itemValue);

        el.style.display = open ? "block" : "none";

        const trigger = itemEl?.querySelector("button");
        const chevron = trigger?.querySelector("svg");
        if (chevron) chevron.style.transform = open ? "rotate(180deg)" : "rotate(0deg)";
      }}
    >
      <div className={cn("pb-4 pt-0 text-sm text-muted-foreground", className)}>
        {children}
      </div>
    </div>
  );
}

