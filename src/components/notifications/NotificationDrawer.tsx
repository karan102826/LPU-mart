import React from 'react';
import { X, Bell, CheckCircle2, ShieldCheck, Heart, AlertTriangle, ArrowRight } from 'lucide-react';

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkRead: (id: string) => void;
  onNavigateToHandshake: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkRead,
  onNavigateToHandshake,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm h-full bg-[#111114] border-l border-[#27272A] flex flex-col shadow-2xl animate-in slide-in-from-right">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#27272A] bg-[#09090B]">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#FF6B00]" />
            <h3 className="text-sm font-bold text-white">Campus Notifications</h3>
            <span className="text-[10px] bg-[#18181B] text-[#A1A1AA] px-1.5 py-0.5 rounded font-mono">
              {notifications.filter((n) => !n.read).length} new
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#18181B] text-[#A1A1AA] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notifications Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12 space-y-2 text-[#71717A]">
              <Bell className="w-8 h-8 mx-auto opacity-40" />
              <p className="text-xs">No notifications yet.</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  onMarkRead(notif.id);
                  if (notif.type.includes('ORDER')) {
                    onClose();
                    onNavigateToHandshake();
                  }
                }}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                  notif.read
                    ? 'bg-[#09090B] border-[#27272A] text-[#A1A1AA]'
                    : 'bg-[#18181B] border-[#FF6B00]/40 text-white shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold flex items-center gap-1.5">
                    {notif.type === 'DONATION_RECORDED' ? (
                      <Heart className="w-3.5 h-3.5 text-rose-400" />
                    ) : (
                      <ShieldCheck className="w-3.5 h-3.5 text-[#FF6B00]" />
                    )}
                    {notif.title}
                  </span>
                  <span className="text-[10px] text-[#71717A] font-mono">
                    {new Date(notif.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-[#A1A1AA]">{notif.message}</p>
                {notif.type.includes('ORDER') && (
                  <div className="text-[10px] text-[#FF9F43] flex items-center gap-1 font-mono pt-1">
                    <span>Open in Handshake Escrow</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
