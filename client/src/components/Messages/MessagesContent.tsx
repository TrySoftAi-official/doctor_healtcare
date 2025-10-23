import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { messageService } from "@/services/messageService";
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Star, 
  Archive, 
  Trash2,
  Reply,
  Forward,
  Send,
  Paperclip,
  Smile,
  Phone,
  Video
} from "lucide-react";

interface Message {
  id: string;
  from: string;
  to: string;
  subject: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  isStarred: boolean;
  priority: string;
}

const MessagesContent = () => {
  const { user } = useAuth();
  const userRole = user?.role || "Patient";
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch messages from API
  const { data: messagesData, isLoading, error } = useQuery({
    queryKey: ['messages', userRole, user?.id],
    queryFn: async () => {
      return await messageService.getMyMessages();
    },
    enabled: !!user?.id,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Transform messages data
  const messages = (messagesData || []).map((msg: any) => ({
    id: msg._id,
    from: userRole === "Patient" 
      ? (() => {
          const firstName = msg.senderId?.userId?.firstName;
          const lastName = msg.senderId?.userId?.lastName;
          if (firstName && lastName) return `Dr. ${firstName} ${lastName}`;
          if (firstName) return `Dr. ${firstName}`;
          if (lastName) return `Dr. ${lastName}`;
          return 'Dr. Unknown';
        })()
      : (() => {
          const firstName = msg.senderId?.userId?.firstName;
          const lastName = msg.senderId?.userId?.lastName;
          if (firstName && lastName) return `${firstName} ${lastName}`;
          if (firstName) return firstName;
          if (lastName) return lastName;
          return 'Unknown User';
        })(),
    to: userRole === "Patient" ? "You" : (() => {
      const firstName = msg.recipientId?.userId?.firstName;
      const lastName = msg.recipientId?.userId?.lastName;
      if (firstName && lastName) return `${firstName} ${lastName}`;
      if (firstName) return firstName;
      if (lastName) return lastName;
      return 'Unknown User';
    })(),
    subject: msg.subject || "No Subject",
    content: msg.content || "No content available",
    timestamp: new Date(msg.createdAt).toLocaleString(),
    isRead: msg.isRead || false,
    isStarred: msg.isStarred || false,
    priority: msg.priority || "normal"
  }));

  const filteredMessages = messages.filter((message: Message) =>
    message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleSpecificTitle = () => {
    switch (userRole) {
      case "Administrator":
        return "System Messages";
      case "Doctor":
        return "Patient Communications";
      case "Patient":
        return "Health Messages";
      default:
        return "Messages";
    }
  };

  const getRoleSpecificDescription = () => {
    switch (userRole) {
      case "Administrator":
        return "Manage system-wide communications and notifications";
      case "Doctor":
        return "Communicate with patients and colleagues";
      case "Patient":
        return "Messages from your healthcare providers";
      default:
        return "Your messages";
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="h-10 bg-gray-200 rounded mb-3 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="p-4 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 border border-gray-100 rounded animate-pulse">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-48"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-4"></div>
                  </div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-red-50 rounded-lg shadow-sm p-6 border border-red-200">
          <div className="text-red-600 text-center">
            <p className="font-medium">Error loading messages</p>
            <p className="text-sm">Please try refreshing the page</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
          {getRoleSpecificTitle()}
        </h1>
        <p className="text-gray-600">
          {getRoleSpecificDescription()}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Messages List */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
          {/* Search and Filter */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex gap-2 mb-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter className="w-4 h-4" />
              </button>
            </div>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
              <Plus className="w-4 h-4 mr-2" />
              New Message
            </button>
          </div>

          {/* Messages List */}
          <div className="flex-1 overflow-y-auto">
            {filteredMessages.map((message: Message) => (
              <div
                key={message.id}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                  selectedMessage?.id === message.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                } ${!message.isRead ? 'bg-blue-50' : ''}`}
                onClick={() => setSelectedMessage(message)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {message.from}
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                      {message.subject}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1 ml-2">
                    {message.isStarred && (
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    )}
                    {message.priority === 'high' && (
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    )}
                    <button className="p-1 hover:bg-gray-200 rounded">
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                  {message.content}
                </p>
                <p className="text-xs text-gray-500">
                  {message.timestamp}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
          {selectedMessage ? (
            <>
              {/* Message Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {selectedMessage.subject}
                    </h2>
                    <p className="text-sm text-gray-600">
                      From: {selectedMessage.from} • {selectedMessage.timestamp}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Star className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Archive className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Trash2 className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Reply className="w-4 h-4 mr-2" />
                    Reply
                  </button>
                  <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                    <Forward className="w-4 h-4 mr-2" />
                    Forward
                  </button>
                  {userRole === "Doctor" && (
                    <>
                      <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                        <Phone className="w-4 h-4 mr-2" />
                        Call
                      </button>
                      <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                        <Video className="w-4 h-4 mr-2" />
                        Video Call
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Message Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="prose max-w-none">
                  <p className="text-gray-800 leading-relaxed">
                    {selectedMessage.content}
                  </p>
                </div>
              </div>

              {/* Reply Section */}
              <div className="p-6 border-t border-gray-200">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user?.firstName?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1">
                    <div className="border border-gray-300 rounded-lg">
                      <textarea
                        placeholder="Type your message..."
                        className="w-full p-3 border-0 rounded-lg resize-none focus:ring-0 focus:outline-none"
                        rows={3}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                          <Paperclip className="w-4 h-4 text-gray-400" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                          <Smile className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                      <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        <Send className="w-4 h-4 mr-2" />
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select a message
                </h3>
                <p className="text-gray-600">
                  Choose a message from the list to view its content
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesContent;
