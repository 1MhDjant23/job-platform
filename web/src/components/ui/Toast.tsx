import { useEffect } from "react";
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
  type?: ToastType;
  message: string;
  onClose: () => void;
  duration?: number;
}

const config = {
  success: { Icon: CheckCircle2, classes: "border-emerald-200 bg-emerald-50 text-emerald-800" },
  error: { Icon: XCircle, classes: "border-red-200 bg-red-50 text-red-800" },
  info: { Icon: Info, classes: "border-blue-200 bg-blue-50 text-blue-800" },
  warning: { Icon: AlertTriangle, classes: "border-amber-200 bg-amber-50 text-amber-800" },
};

export default function Toast({ type = "info", message, onClose, duration = 4000 }: ToastProps) {
  const { Icon, classes } = config[type];

  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg ${classes}`}>
      <Icon className="h-5 w-5 shrink-0" />
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button onClick={onClose} className="shrink-0 rounded-md p-1 hover:bg-black/5" aria-label="Fermer">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}