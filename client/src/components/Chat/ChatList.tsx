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
        <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No appointments found</h3>
        <p className="text-sm text-muted-foreground">
          You need to have an appointment with a doctor or patient to start chatting
        </p>
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground">
            💡 Book an appointment first to enable chat functionality
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b bg-background">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Messages</h2>
          </div>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-xs">
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
            className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
              selectedParticipantId === participant._id 
                ? 'bg-muted border-l-4 border-l-primary' 
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
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-sm truncate">
                    {participant.firstName} {participant.lastName}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {participant.lastMessageTime ? formatTime(participant.lastMessageTime) : 'New'}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground truncate flex-1 mr-2">
                    {participant.lastMessage || 'No messages yet - Click to start chatting'}
                  </p>
                  {participant.unreadCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="text-xs min-w-[20px] h-5 flex items-center justify-center"
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
