import React from "react";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

export function StatusIcon({ status }) {
  if (status === "good") return <CheckCircle2 size={16} color="#1a7f4b" />;
  if (status === "warn") return <AlertTriangle size={16} color="#b8860b" />;
  return <XCircle size={16} color="#b0392f" />;
}
