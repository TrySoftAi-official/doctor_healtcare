import React, { useState } from 'react';
import { ChatList } from './ChatList';
import { ChatWindow } from './ChatWindow';
import type { ChatParticipant } from '../../types/chat';
import { useChat } from '../../hooks/useChat';

export const ChatInterface: React.FC = () => {
  const [selectedParticipant, setSelectedParticipant] = useState<ChatParticipant | null>(null);
  const { isConnected, participants, loadParticipants } = useChat();

  const handleSelectParticipant = (participant: ChatParticipant) => {
    setSelectedParticipant(participant);
  };

  const handleBack = () => {
    setSelectedParticipant(null);
  };

  // Load participants on mount
  React.useEffect(() => {
    loadParticipants();
  }, [loadParticipants]);

  // Show loading only if we have no participants and not connected
  if (!isConnected && participants.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading chat...</p>
          <p className="text-xs text-muted-foreground mt-2">
            {!isConnected ? 'Connecting to server...' : 'Loading conversations...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-white relative">
      {/* Connection Status */}
      {!isConnected && (
        <div className="absolute top-2 right-2 z-20 bg-yellow-100 border border-yellow-400 text-yellow-800 px-3 py-1 rounded-lg text-sm shadow-sm">
          ⚠️ Offline - Messages may not sync
        </div>
      )}
      
      {/* Chat Sidebar */}
      <div className={`${selectedParticipant ? 'hidden lg:flex' : 'flex'} flex-col w-full lg:w-80 xl:w-96 border-r border-gray-200 bg-gray-50/50`}>
        <ChatList 
          onSelectParticipant={handleSelectParticipant}
          selectedParticipantId={selectedParticipant?._id}
        />
      </div>

      {/* Chat Content Section */}
      <div className={`${selectedParticipant ? 'flex' : 'hidden lg:flex'} flex-col flex-1 bg-white`}>
        {selectedParticipant ? (
          <ChatWindow 
            participant={selectedParticipant} 
            onBack={handleBack}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-center p-8">
            <div className="max-w-md">
              <div className="h-20 w-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="h-10 w-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Welcome to Chat</h3>
              <p className="text-gray-600 mb-6">
                Select a conversation from the sidebar to start messaging
              </p>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Real-time messaging</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Secure communication</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
