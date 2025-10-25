import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../../hooks/useChat';
import type { ChatParticipant } from '../../types/chat';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { 
  Send, 
  Paperclip, 
  Image as ImageIcon, 
  Phone, 
  Video, 
  MoreVertical,
  ArrowLeft,
  Check,
  CheckCheck
} from 'lucide-react';

interface ChatWindowProps {
  participant: ChatParticipant;
  onBack: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ participant, onBack }) => {
  const { 
    messages, 
    sendMessage, 
    loadChatHistory, 
    isUserOnline, 
    typingUsers,
    startTyping,
    stopTyping,
    markAsRead,
    markAllAsRead,
    joinChat,
    leaveChat
  } = useChat();

  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load chat history when participant changes
  useEffect(() => {
    if (participant._id) {
      loadChatHistory(participant._id);
      joinChat(participant._id);
      markAllAsRead(participant._id);
    }

    return () => {
      if (participant._id) {
        leaveChat(participant._id);
      }
    };
  }, [participant._id, loadChatHistory, joinChat, leaveChat, markAllAsRead]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mark messages as read when they come into view
  useEffect(() => {
    const unreadMessages = messages.filter(
      msg => !msg.read && msg.receiverId._id === participant._id
    );
    
    unreadMessages.forEach(msg => {
      markAsRead(msg._id);
    });
  }, [messages, participant._id, markAsRead]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      receiverId: participant._id,
      message: newMessage.trim(),
      type: 'text' as const,
    };

    try {
      await sendMessage(messageData);
      setNewMessage('');
      stopTyping(participant._id);
    } catch (error) {
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    
    if (!isTyping) {
      setIsTyping(true);
      startTyping(participant._id);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      stopTyping(participant._id);
    }, 1000);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const isParticipantTyping = typingUsers.get(participant._id) || false;

  // Debug participant data
  console.log('ChatWindow participant:', participant);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-white">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="md:hidden"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        
        <div className="relative">
          <Avatar className="h-10 w-10">
            <AvatarImage 
              src={participant.profileImage} 
              alt={`${participant.firstName} ${participant.lastName}`}
            />
            <AvatarFallback>
              {getInitials(participant.firstName, participant.lastName)}
            </AvatarFallback>
          </Avatar>
          {isUserOnline(participant._id) && (
            <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-gray-900 truncate">
            {participant.firstName || 'Unknown'} {participant.lastName || 'User'}
          </h3>
          <p className="text-xs text-gray-500">
            {isUserOnline(participant._id) ? 'Online' : 'Offline'}
            {isParticipantTyping && ' • Typing...'}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4 bg-gray-50">
        <div className="space-y-4">
          {messages.map((message, index) => {
            const isOwn = message.senderId._id === participant._id;
            const isRead = message.read;
            
            return (
              <div
                key={`${message._id}-${index}`}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-2 max-w-[70%] ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                  {!isOwn && (
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarImage 
                        src={message.senderId.profileImage} 
                        alt={message.senderId.firstName}
                      />
                      <AvatarFallback>
                        {getInitials(message.senderId.firstName, message.senderId.lastName)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`px-3 py-2 rounded-2xl ${
                        isOwn
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                    </div>
                    
                    <div className={`flex items-center gap-1 mt-1 text-xs text-muted-foreground ${
                      isOwn ? 'flex-row-reverse' : 'flex-row'
                    }`}>
                      <span>{formatTime(message.createdAt)}</span>
                      {isOwn && (
                        <div className="flex items-center">
                          {isRead ? (
                            <CheckCheck className="h-3 w-3 text-blue-500" />
                          ) : (
                            <Check className="h-3 w-3" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          
          {isParticipantTyping && (
            <div className="flex justify-start">
              <div className="flex gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage 
                    src={participant.profileImage} 
                    alt={participant.firstName}
                  />
                  <AvatarFallback>
                    {getInitials(participant.firstName, participant.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted px-3 py-2 rounded-2xl">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Button type="button" variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
            <ImageIcon className="h-4 w-4" />
          </Button>
          
          <Input
            value={newMessage}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            autoComplete="off"
          />
          
          <Button 
            type="submit" 
            size="sm" 
            disabled={!newMessage.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};
