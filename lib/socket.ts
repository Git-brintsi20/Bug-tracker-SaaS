import { io, Socket } from 'socket.io-client';

const NOTIFICATION_SERVICE_URL = process.env.NEXT_PUBLIC_NOTIFICATION_URL || 'http://localhost:5003';

let socket: Socket | null = null;

export const initializeSocket = (): Socket => {
  if (socket && socket.connected) {
    return socket;
  }

  const token = localStorage.getItem('token');
  
  socket = io(NOTIFICATION_SERVICE_URL, {
    auth: {
      token: token || '',
    },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });

  socket.on('connect', () => {
    console.log('✅ Socket.io connected:', socket?.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('❌ Socket.io disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('Socket.io connection error:', error.message);
  });

  socket.on('reconnect', (attemptNumber) => {
    console.log('🔄 Socket.io reconnected after', attemptNumber, 'attempts');
    
    // Re-authenticate after reconnection
    const newToken = localStorage.getItem('token');
    if (newToken) {
      socket?.emit('authenticate', { token: newToken });
    }
    
    // Rejoin organization room
    const organizationId = localStorage.getItem('currentOrganizationId');
    if (organizationId) {
      socket?.emit('join-organization', { organizationId });
    }
  });

  socket.on('reconnect_error', (error) => {
    console.error('Socket.io reconnection error:', error.message);
  });

  socket.on('reconnect_failed', () => {
    console.error('Socket.io reconnection failed after maximum attempts');
  });

  return socket;
};

export const getSocket = (): Socket | null => {
  return socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('🔌 Socket.io disconnected manually');
  }
};

export const joinOrganization = (organizationId: string): void => {
  if (socket && socket.connected) {
    socket.emit('join-organization', { organizationId });
    console.log('📥 Joined organization room:', organizationId);
  }
};

export const leaveOrganization = (organizationId: string): void => {
  if (socket && socket.connected) {
    socket.emit('leave-organization', { organizationId });
    console.log('📤 Left organization room:', organizationId);
  }
};

// Event listener helpers
export const onBugCreated = (callback: (data: any) => void): void => {
  socket?.on('bug-created', callback);
};

export const onBugUpdated = (callback: (data: any) => void): void => {
  socket?.on('bug-updated', callback);
};

export const onBugDeleted = (callback: (data: any) => void): void => {
  socket?.on('bug-deleted', callback);
};

export const onCommentAdded = (callback: (data: any) => void): void => {
  socket?.on('comment-added', callback);
};

export const onCommentDeleted = (callback: (data: any) => void): void => {
  socket?.on('comment-deleted', callback);
};

// Remove event listeners
export const offBugCreated = (callback: (data: any) => void): void => {
  socket?.off('bug-created', callback);
};

export const offBugUpdated = (callback: (data: any) => void): void => {
  socket?.off('bug-updated', callback);
};

export const offBugDeleted = (callback: (data: any) => void): void => {
  socket?.off('bug-deleted', callback);
};

export const offCommentAdded = (callback: (data: any) => void): void => {
  socket?.off('comment-added', callback);
};

export const offCommentDeleted = (callback: (data: any) => void): void => {
  socket?.off('comment-deleted', callback);
};
