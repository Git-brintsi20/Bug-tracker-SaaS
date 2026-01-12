import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useOrganization } from '@/lib/contexts/OrganizationContext';
import { useToast } from '@/hooks/use-toast';
import {
  initializeSocket,
  disconnectSocket,
  joinOrganization,
  leaveOrganization,
  onBugCreated,
  onBugUpdated,
  onBugDeleted,
  onCommentAdded,
  onCommentDeleted,
  offBugCreated,
  offBugUpdated,
  offBugDeleted,
  offCommentAdded,
  offCommentDeleted,
} from '@/lib/socket';

export const useSocket = () => {
  const queryClient = useQueryClient();
  const { currentOrganization } = useOrganization();
  const { toast } = useToast();

  // Handle bug created event
  const handleBugCreated = useCallback((data: any) => {
    console.log('🐛 Bug created:', data);
    
    // Invalidate bugs list to refetch
    queryClient.invalidateQueries({ queryKey: ['bugs'] });
    
    // Show toast notification
    toast({
      title: 'New Bug Created',
      description: `${data.title} was created by ${data.creator?.firstName} ${data.creator?.lastName}`,
    });
  }, [queryClient, toast]);

  // Handle bug updated event
  const handleBugUpdated = useCallback((data: any) => {
    console.log('✏️ Bug updated:', data);
    
    // Invalidate specific bug and bugs list
    queryClient.invalidateQueries({ queryKey: ['bug', data.id] });
    queryClient.invalidateQueries({ queryKey: ['bugs'] });
    
    // Show toast notification
    toast({
      title: 'Bug Updated',
      description: `${data.title} was updated`,
    });
  }, [queryClient, toast]);

  // Handle bug deleted event
  const handleBugDeleted = useCallback((data: any) => {
    console.log('🗑️ Bug deleted:', data);
    
    // Invalidate bugs list
    queryClient.invalidateQueries({ queryKey: ['bugs'] });
    
    // Show toast notification
    toast({
      title: 'Bug Deleted',
      description: `Bug #${data.bugId} was deleted`,
      variant: 'destructive',
    });
  }, [queryClient, toast]);

  // Handle comment added event
  const handleCommentAdded = useCallback((data: any) => {
    console.log('💬 Comment added:', data);
    
    // Invalidate comments for the specific bug
    queryClient.invalidateQueries({ queryKey: ['comments', data.bugId] });
    queryClient.invalidateQueries({ queryKey: ['bug', data.bugId] });
    
    // Show toast notification (optional, could be noisy)
    // toast({
    //   title: 'New Comment',
    //   description: `${data.author?.firstName} added a comment`,
    // });
  }, [queryClient, toast]);

  // Handle comment deleted event
  const handleCommentDeleted = useCallback((data: any) => {
    console.log('🗑️ Comment deleted:', data);
    
    // Invalidate comments for the specific bug
    queryClient.invalidateQueries({ queryKey: ['comments', data.bugId] });
  }, [queryClient]);

  // Initialize socket and join organization room
  useEffect(() => {
    const socket = initializeSocket();

    // Setup event listeners
    onBugCreated(handleBugCreated);
    onBugUpdated(handleBugUpdated);
    onBugDeleted(handleBugDeleted);
    onCommentAdded(handleCommentAdded);
    onCommentDeleted(handleCommentDeleted);

    // Cleanup on unmount
    return () => {
      offBugCreated(handleBugCreated);
      offBugUpdated(handleBugUpdated);
      offBugDeleted(handleBugDeleted);
      offCommentAdded(handleCommentAdded);
      offCommentDeleted(handleCommentDeleted);
      disconnectSocket();
    };
  }, [handleBugCreated, handleBugUpdated, handleBugDeleted, handleCommentAdded, handleCommentDeleted]);

  // Join/leave organization room when organization changes
  useEffect(() => {
    if (currentOrganization) {
      joinOrganization(currentOrganization.id);

      return () => {
        leaveOrganization(currentOrganization.id);
      };
    }
  }, [currentOrganization]);

  return {
    isConnected: true, // Could be enhanced with actual connection state
  };
};
