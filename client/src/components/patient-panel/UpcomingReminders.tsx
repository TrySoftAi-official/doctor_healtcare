import { useState, useEffect } from "react";
import { notificationService } from "@/services/notificationService";

interface Reminder {
  _id: string;
  id?: string;
  title: string;
  message: string;
  type: string;
  data?: any;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}

const Reminder = ({ reminder, onMarkAsRead }: { reminder: Reminder; onMarkAsRead: (id: string) => void }) => {
  const getColorClass = (type: string) => {
    if (type === 'appointment_reminder') return 'bg-green-50 border-green-200';
    if (type === 'appointment_confirmed') return 'bg-blue-50 border-blue-200';
    if (type === 'prescription_ready') return 'bg-purple-50 border-purple-200';
    if (type === 'message_received') return 'bg-yellow-50 border-yellow-200';
    if (type === 'system_announcement') return 'bg-gray-50 border-gray-200';
    return 'bg-gray-50 border-gray-200';
  };

  const getIcon = (type: string) => {
    if (type === 'appointment_reminder') return '📅';
    if (type === 'appointment_confirmed') return '✅';
    if (type === 'prescription_ready') return '💊';
    if (type === 'message_received') return '💬';
    if (type === 'system_announcement') return '📢';
    return '🔔';
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const reminderDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (reminderDate.getTime() === today.getTime()) {
      return `Today, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    } else if (reminderDate.getTime() === tomorrow.getTime()) {
      return `Tomorrow, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      });
    }
  };

  const handleClick = () => {
    if (!reminder.isRead) {
      onMarkAsRead(reminder._id);
    }
  };

  return (
    <div 
      className={`flex items-center justify-between rounded-lg p-3 border cursor-pointer hover:shadow-sm transition-shadow ${getColorClass(reminder.type)} ${!reminder.isRead ? 'ring-1 ring-blue-200' : ''}`}
      onClick={handleClick}
    >
      <div className="flex items-center gap-3">
        <span className="text-lg">{getIcon(reminder.type)}</span>
        <div>
          <span className="text-sm font-medium text-gray-800">{reminder.title}</span>
          <p className="text-xs text-gray-600 mt-1">{reminder.message}</p>
        </div>
      </div>
      <div className="text-right">
        <span className="text-xs text-gray-600">{formatTime(reminder.createdAt)}</span>
        {!reminder.isRead && (
          <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 ml-auto"></div>
        )}
      </div>
    </div>
  );
};

export default function UpcomingReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        setLoading(true);
        const data = await notificationService.getMyNotifications();
        
        // Filter for relevant notification types and sort by creation date
        const reminderData = data
          .filter((notification: any) => 
            notification.type === 'appointment_reminder' || 
            notification.type === 'appointment_confirmed' ||
            notification.type === 'prescription_ready' ||
            notification.type === 'message_received' ||
            notification.type === 'system_announcement'
          )
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5) // Limit to 5 most recent
          .map((notification: any) => ({
            _id: notification._id,
            id: notification._id,
            title: notification.title,
            message: notification.message,
            type: notification.type,
            data: notification.data,
            isRead: notification.isRead,
            readAt: notification.readAt,
            createdAt: notification.createdAt,
            updatedAt: notification.updatedAt
          }));
        
        setReminders(reminderData);
      } catch (error) {
        console.error('Error fetching reminders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReminders();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Upcoming Reminders</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between rounded-lg p-3 bg-gray-50 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-3 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const markAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      // Update the local state
      setReminders(prevReminders => 
        prevReminders.map(reminder => 
          reminder._id === notificationId 
            ? { ...reminder, isRead: true, readAt: new Date().toISOString() }
            : reminder
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };


  if (reminders.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Upcoming Reminders</h3>
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">No upcoming reminders</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-800 mb-3">Upcoming Reminders</h3>
      <div className="space-y-3">
        {reminders.map((reminder) => (
          <Reminder 
            key={reminder._id} 
            reminder={reminder} 
            onMarkAsRead={markAsRead}
          />
        ))}
      </div>
    </div>
  );
}
