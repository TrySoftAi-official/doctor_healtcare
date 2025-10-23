// import { MessageSquare } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { messageService } from "@/services/messageService";
import { useAuth } from "@/providers/AuthProvider";

export default function RecentMessagesCard() {
  const { user } = useAuth();
  
  // Fetch recent messages
  const { data: messagesData, isLoading, error } = useQuery({
    queryKey: ['recent-messages', user?.id],
    queryFn: async () => {
      return await messageService.getMyMessages();
    },
    enabled: !!user?.id,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Get the most recent message
  const getRecentMessage = () => {
    if (!messagesData || messagesData.length === 0) {
      return null;
    }
    
    // Sort by creation date and get the most recent
    const sortedMessages = messagesData.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    const recentMessage = sortedMessages[0];
    
    return {
      id: recentMessage._id,
      senderName: recentMessage.senderId?.userId?.firstName || 'Unknown',
      content: recentMessage.content || 'No content',
      timestamp: new Date(recentMessage.createdAt).toLocaleString(),
      isFromPatient: recentMessage.senderId?.role === 'Patient'
    };
  };

  const recentMessage = getRecentMessage();

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Recent Messages</h3>
        <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-3 animate-pulse">
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="h-6 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Recent Messages</h3>
        <div className="text-red-600 text-center py-4">
          <p className="text-sm">Error loading messages</p>
        </div>
      </div>
    );
  }

  if (!recentMessage) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Recent Messages</h3>
        <div className="text-gray-500 text-center py-4">
          <p className="text-sm">No messages yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-800 mb-3">Recent Messages</h3>
      <div className="flex items-start gap-3 bg-blue-50 rounded-lg p-3">
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">
          {recentMessage.senderName.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-800">
            <span className="font-medium">
              {recentMessage.isFromPatient ? 'Patient:' : 'User:'}
            </span> {recentMessage.senderName} sent a message
          </p>
          <p className="text-xs text-gray-500">{recentMessage.timestamp}</p>
        </div>
        <button className="px-3 py-1.5 rounded-md bg-blue-600 text-white text-xs hover:bg-blue-700">
          Reply
        </button>
      </div>
    </div>
  );
}
