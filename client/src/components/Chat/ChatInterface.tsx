import React, { useState } from 'react';
import { ChatList } from './ChatList';
import { ChatWindow } from './ChatWindow';
import { ChatDebug } from './ChatDebug';
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
    <div className="flex h-full bg-background">
      {/* Connection Status */}
      {!isConnected && (
        <div className="absolute top-2 right-2 z-10 bg-yellow-100 border border-yellow-400 text-yellow-800 px-3 py-1 rounded text-sm">
          ⚠️ Offline - Messages may not sync
        </div>
      )}
      
      {/* Chat List - Hidden on mobile when chat is selected */}
      <div className={`${selectedParticipant ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-1/3 lg:w-1/4 border-r`}>
        <ChatList 
          onSelectParticipant={handleSelectParticipant}
          selectedParticipantId={selectedParticipant?._id}
        />
      </div>

      {/* Chat Window */}
      <div className={`${selectedParticipant ? 'flex' : 'hidden md:flex'} flex-col w-full md:w-2/3 lg:w-3/4`}>
        {selectedParticipant ? (
          <ChatWindow 
            participant={selectedParticipant} 
            onBack={handleBack}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-center p-6">
            <div>
              <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Welcome to Chat</h3>
              <p className="text-sm text-muted-foreground">
                Select a conversation to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
