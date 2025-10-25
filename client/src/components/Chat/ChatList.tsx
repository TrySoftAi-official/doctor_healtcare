import React, { useEffect } from 'react';
import { useChat } from '../../hooks/useChat';
import type { ChatParticipant } from '../../types/chat';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { MessageCircle, Users, Clock } from 'lucide-react';

interface ChatListProps {
  onSelectParticipant: (participant: ChatParticipant) => void;
  selectedParticipantId?: string;
}

export const ChatList: React.FC<ChatListProps> = ({ 
  onSelectParticipant, 
  selectedParticipantId 
}) => {
  const { 
    participants, 
    loadParticipants, 
    unreadCount, 
    isUserOnline 
  } = useChat();

  useEffect(() => {
    console.log('ChatList: Loading participants...');
    loadParticipants();
  }, [loadParticipants]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (participants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <MessageCircle className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No conversations yet</h3>
        <p className="text-sm text-gray-600 mb-4">
          You need to have an appointment with a doctor or patient to start chatting
        </p>
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700">
            💡 Book an appointment first to enable chat functionality
          </p>
        </div>
        {/* Debug Information */}
        {import.meta.env.DEV && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg text-xs text-left max-w-md">
            <h4 className="font-bold mb-2 text-gray-700">Debug Information:</h4>
            <div className="space-y-1 text-gray-600">
              <div>Participants Count: {participants.length}</div>
              <div>Participants: {JSON.stringify(participants, null, 2)}</div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
              <p className="text-sm text-gray-500">Your conversations</p>
            </div>
          </div>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-xs px-2 py-1">
              {unreadCount}
            </Badge>
          )}
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {participants.map((participant) => (
          <div
            key={participant._id}
            onClick={() => onSelectParticipant(participant)}
            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-all duration-200 ${
              selectedParticipantId === participant._id 
                ? 'bg-blue-50 border-l-4 border-l-blue-500' 
                : ''
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage 
                    src={participant.profileImage} 
                    alt={`${participant.firstName} ${participant.lastName}`}
                  />
                  <AvatarFallback>
                    {getInitials(participant.firstName, participant.lastName)}
                  </AvatarFallback>
                </Avatar>
                {isUserOnline(participant._id) && (
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-background rounded-full" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm text-gray-900 truncate">
                    {participant.firstName} {participant.lastName}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    {participant.lastMessageTime ? formatTime(participant.lastMessageTime) : 'New'}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 truncate flex-1 mr-2">
                    {participant.lastMessage || 'No messages yet - Click to start chatting'}
                  </p>
                  {participant.unreadCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="text-xs min-w-[20px] h-5 flex items-center justify-center bg-red-500 hover:bg-red-600"
                    >
                      {participant.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
