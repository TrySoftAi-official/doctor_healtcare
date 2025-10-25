import React from 'react';
import { useChat } from '../../hooks/useChat';
import { useAuth } from '../../providers/AuthProvider';
import { chatService } from '../../services/chatService';
import { config } from '../../config/env';

export const ChatDebug: React.FC = () => {
  const { user } = useAuth();
  const { isConnected, participants, loadParticipants } = useChat();

  const handleTestConnection = async () => {
    console.log('Testing connection...');
    console.log('User:', user);
    console.log('Token:', localStorage.getItem('access_token'));
    console.log('Socket URL:', config.socketUrl);
    
    try {
      console.log('Testing REST API...');
      const participants = await chatService.getChatParticipants();
      console.log('Participants from REST API:', participants);
    } catch (error) {
      console.error('REST API Error:', error);
    }
    
    loadParticipants();
  };

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg m-4">
      <h3 className="font-bold text-yellow-800 mb-2">Chat Debug Info</h3>
      <div className="space-y-2 text-sm">
        <div>User: {user ? `${user.firstName} ${user.lastName}` : 'Not logged in'}</div>
        <div>Token: {localStorage.getItem('access_token') ? 'Present' : 'Missing'}</div>
        <div>Connected: {isConnected ? 'Yes' : 'No'}</div>
        <div>Participants: {participants.length}</div>
        <div>Socket URL: {config.socketUrl}</div>
        <button 
          onClick={handleTestConnection}
          className="px-3 py-1 bg-blue-500 text-white rounded text-xs"
        >
          Test Connection
        </button>
      </div>
    </div>
  );
};
