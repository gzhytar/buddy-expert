"use client";

import { useLayoutEffect, useRef } from "react";
import type { InputProps } from "@/components/ui/input";
import { Input } from "@/components/ui/input";

export type DatetimeLocalInputProps = Omit<InputProps, "type">;

/**
 * Dismisses the native datetime picker after a committed change. Uses the DOM
 * `change` event (not React’s `onChange`, which tracks `input` and would break
 * keyboard entry if we blurred there).
 */
export function DatetimeLocalInput({
  onChange,
  ...props
}: DatetimeLocalInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    const closePicker = () => {
      el.blur();
    };
    el.addEventListener("change", closePicker);
    return () => el.removeEventListener("change", closePicker);
  }, []);

  return (
    <Input ref={inputRef} type="datetime-local" onChange={onChange} {...props} />
  );
}
