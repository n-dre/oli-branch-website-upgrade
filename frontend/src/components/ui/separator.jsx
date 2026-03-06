// components/ui/separator.jsx
import React from "react";

export function Separator({ className = "" }) {
  return (
    <div className={`border-t border-gray-200 ${className}`} />
  );
}