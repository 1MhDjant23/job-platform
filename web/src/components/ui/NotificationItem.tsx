import { Bell, CheckCircle2, XCircle, Info } from "lucide-react";

export type NotificationType = "success" | "error" | "info" | "default";

interface NotificationItemProps {
  type?: NotificationType;
  title: string;
  message: string;
  time: string;
  isRead?: boolean;
  onClick?: () => void;
}

const iconMap = {
  success: { Icon: CheckCircle2, classes: "text-emerald-500 bg-emerald-50" },
  error: { Icon: XCircle, classes: "text-red-500 bg-red-50" },
  info: { Icon: Info, classes: "text-blue-500 bg-blue-50" },
  default: { Icon: Bell, classes: "text-indigo-500 bg-indigo-50" },
};

export default function NotificationItem({
  type = "default",
  title,
  message,
  time,
  isRead = false,
  onClick,
}: NotificationItemProps) {
  const { Icon, classes } = iconMap[type];

  return (
    <button
      onClick={onClick}
      className={`flex w-full items-start gap-3 rounded-xl p-3 text-left transition-colors hover:bg-gray-50 ${
        !isRead ? "bg-indigo-50/40" : "bg-white"
      }`}
    >
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${classes}`}>
        <Icon className="h-4.5 w-4.5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-semibold text-gray-900">{title}</p>
          {!isRead && <span className="h-2 w-2 shrink-0 rounded-full bg-indigo-600" />}
        </div>
        <p className="mt-0.5 line-clamp-2 text-xs text-gray-500">{message}</p>
        <p className="mt-1 text-[11px] text-gray-400">{time}</p>
      </div>
    </button>
  );
}