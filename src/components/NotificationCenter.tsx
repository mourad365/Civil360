import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLanguage } from "@/contexts/LanguageContext";
import { api } from "@/lib/api";
import {
  Bell,
  AlertTriangle,
  Info,
  CheckCircle2,
  X,
  Settings
} from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success' | 'urgent';
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  createdAt: string;
  read: boolean;
  actions?: Array<{
    label: string;
    action: string;
    url?: string;
  }>;
  relatedEntity?: {
    entityType: string;
    entityId: string;
  };
}

interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<string, { total: number; unread: number }>;
  byPriority: Record<string, { total: number; unread: number }>;
}

export function NotificationCenter() {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      loadNotifications();
      loadStats();
    }
  }, [open]);

  // Auto-refresh notifications every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (open) {
        loadNotifications();
        loadStats();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [open]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const result = await api.notifications.getNotifications({
        limit: 20,
        page: 1
      });

      if (!result.error && result.data?.notifications) {
        setNotifications(result.data.notifications);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const result = await api.notifications.getNotificationStats();
      if (!result.error && result.data?.stats) {
        setStats(result.data.stats);
      }
    } catch (error) {
      console.error('Error loading notification stats:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const result = await api.notifications.markAsRead(notificationId);
      if (!result.error) {
        setNotifications(prev =>
          prev.map(notif =>
            notif.id === notificationId ? { ...notif, read: true } : notif
          )
        );
        loadStats(); // Refresh stats
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const result = await api.notifications.markAllAsRead();
      if (!result.error) {
        setNotifications(prev =>
          prev.map(notif => ({ ...notif, read: true }))
        );
        loadStats();
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const getNotificationIcon = (type: string, priority: string) => {
    if (priority === 'critical' || type === 'urgent') {
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
    
    switch (type) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <X className="h-4 w-4 text-red-500" />;
      case 'info':
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getNotificationColor = (type: string, priority: string) => {
    if (priority === 'critical' || type === 'urgent') {
      return 'border-l-red-500 bg-red-900/10';
    }
    
    switch (type) {
      case 'success':
        return 'border-l-green-500 bg-green-900/10';
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-900/10';
      case 'error':
        return 'border-l-red-500 bg-red-900/10';
      case 'info':
      default:
        return 'border-l-blue-500 bg-blue-900/10';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `${diffInMinutes}min`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}j`;
  };

  const unreadCount = stats?.unread || 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-red-600 hover:bg-red-600">
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 bg-slate-800 text-white border-slate-600" align="end">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-600 pb-3">
            <h3 className="font-semibold text-lg">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={markAllAsRead}
                  className="text-xs text-blue-400 hover:text-blue-300"
                >
                  Tout marquer lu
                </Button>
              )}
              <Button size="sm" variant="ghost">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Stats Summary */}
          {stats && (
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div>
                <p className="text-slate-400">Total</p>
                <p className="font-bold">{stats.total}</p>
              </div>
              <div>
                <p className="text-slate-400">Non lus</p>
                <p className="font-bold text-blue-400">{stats.unread}</p>
              </div>
              <div>
                <p className="text-slate-400">Urgents</p>
                <p className="font-bold text-red-400">
                  {stats.byPriority?.critical?.unread || 0}
                </p>
              </div>
              <div>
                <p className="text-slate-400">Alertes</p>
                <p className="font-bold text-yellow-400">
                  {stats.byType?.warning?.unread || 0}
                </p>
              </div>
            </div>
          )}

          {/* Notifications List */}
          <ScrollArea className="h-96">
            <div className="space-y-2">
              {loading ? (
                <div className="text-center py-8">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-sm text-slate-400">Chargement...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="h-8 w-8 text-slate-500 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">Aucune notification</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 border-l-4 rounded-r-lg cursor-pointer transition-colors hover:bg-slate-700/50 ${
                      getNotificationColor(notification.type, notification.priority)
                    } ${!notification.read ? 'bg-opacity-20' : 'opacity-75'}`}
                    onClick={() => !notification.read && markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type, notification.priority)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className={`text-sm font-medium truncate ${
                            !notification.read ? 'text-white' : 'text-slate-300'
                          }`}>
                            {notification.title}
                          </h4>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                            <span className="text-xs text-slate-400">
                              {formatTimeAgo(notification.createdAt)}
                            </span>
                          </div>
                        </div>
                        
                        <p className={`text-xs mt-1 ${
                          !notification.read ? 'text-slate-300' : 'text-slate-400'
                        }`}>
                          {notification.message}
                        </p>
                        
                        {notification.category && (
                          <Badge variant="outline" className="mt-2 text-xs">
                            {notification.category}
                          </Badge>
                        )}

                        {notification.actions && notification.actions.length > 0 && (
                          <div className="flex gap-2 mt-2">
                            {notification.actions.map((action, index) => (
                              <Button
                                key={index}
                                size="sm"
                                variant="outline"
                                className="text-xs h-6"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (action.url) {
                                    window.open(action.url, '_blank');
                                  }
                                }}
                              >
                                {action.label}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="border-t border-slate-600 pt-3">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-blue-400 hover:text-blue-300"
              onClick={() => {
                setOpen(false);
                // Navigate to full notifications page
                window.location.href = '/notifications';
              }}
            >
              Voir toutes les notifications
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default NotificationCenter;
