import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { queryKeys, staleTimes } from '@/lib/queryClient';
import { toast } from 'sonner';

/**
 * Hook to get all connections (accepted)
 */
export function useConnections() {
  return useQuery({
    queryKey: queryKeys.connections.list(),
    queryFn: async () => {
      const { data } = await api.get('/connections');
      return data;
    },
    staleTime: staleTimes.connections,
  });
}

/**
 * Hook to get pending connection requests
 */
export function usePendingConnections() {
  return useQuery({
    queryKey: queryKeys.connections.pending(),
    queryFn: async () => {
      const { data } = await api.get('/connections/pending');
      return data;
    },
    staleTime: staleTimes.connections,
  });
}

/**
 * Hook to discover suggested connections
 */
export function useDiscoverConnections() {
  return useQuery({
    queryKey: queryKeys.connections.discover(),
    queryFn: async () => {
      const { data } = await api.get('/connections/discover');
      return data;
    },
    staleTime: staleTimes.connections,
  });
}

/**
 * Helper to safely extract array from API response
 * Handles both {connections: [...]} and [...] formats
 */
const extractArray = (data, key) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (data[key] && Array.isArray(data[key])) return data[key];
  return [];
};

/**
 * Combined hook to get all connections data at once
 * More efficient than separate hooks when you need all data
 */
export function useConnectionsData() {
  const connectionsQuery = useConnections();
  const pendingQuery = usePendingConnections();
  const discoverQuery = useDiscoverConnections();

  return {
    connections: extractArray(connectionsQuery.data, 'connections'),
    pending: extractArray(pendingQuery.data, 'pending'),
    suggestions: extractArray(discoverQuery.data, 'suggestions'),
    isLoading: connectionsQuery.isLoading || pendingQuery.isLoading || discoverQuery.isLoading,
    isError: connectionsQuery.isError || pendingQuery.isError || discoverQuery.isError,
  };
}

/**
 * Hook to accept a connection request with optimistic update
 */
export function useAcceptConnection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (connectionId) => {
      const { data } = await api.put(`/connections/${connectionId}/accept`);
      return data;
    },
    onMutate: async (connectionId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.connections.pending() });
      await queryClient.cancelQueries({ queryKey: queryKeys.connections.list() });

      // Snapshot previous values for rollback
      const previousPending = queryClient.getQueryData(queryKeys.connections.pending());
      const previousConnections = queryClient.getQueryData(queryKeys.connections.list());

      // Extract arrays safely
      const pendingArray = extractArray(previousPending, 'pending');
      const connectionsArray = extractArray(previousConnections, 'connections');

      // Find the connection being accepted
      const acceptedRequest = pendingArray.find(
        (p) => p.connection_id === connectionId
      );

      // Optimistically remove from pending
      if (previousPending) {
        const filtered = pendingArray.filter((p) => p.connection_id !== connectionId);
        queryClient.setQueryData(queryKeys.connections.pending(), { pending: filtered });
      }

      // Optimistically add to connections list
      if (previousConnections && acceptedRequest) {
        const newConnection = { connection_id: connectionId, user: acceptedRequest.user };
        queryClient.setQueryData(queryKeys.connections.list(), {
          connections: [...connectionsArray, newConnection]
        });
      }

      return { previousPending, previousConnections };
    },
    onError: (err, connectionId, context) => {
      // Rollback on error
      if (context?.previousPending) {
        queryClient.setQueryData(queryKeys.connections.pending(), context.previousPending);
      }
      if (context?.previousConnections) {
        queryClient.setQueryData(queryKeys.connections.list(), context.previousConnections);
      }
      toast.error('Failed to accept request');
    },
    onSuccess: () => {
      toast.success('Connection accepted!');
    },
    onSettled: () => {
      // Refetch to ensure server consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.connections.pending() });
      queryClient.invalidateQueries({ queryKey: queryKeys.connections.list() });
    },
  });
}

/**
 * Hook to decline a connection request with optimistic update
 */
export function useDeclineConnection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (connectionId) => {
      const { data } = await api.put(`/connections/${connectionId}/decline`);
      return data;
    },
    onMutate: async (connectionId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.connections.pending() });
      const previousPending = queryClient.getQueryData(queryKeys.connections.pending());

      // Optimistically remove from pending
      if (previousPending) {
        const pendingArray = extractArray(previousPending, 'pending');
        const filtered = pendingArray.filter((p) => p.connection_id !== connectionId);
        queryClient.setQueryData(queryKeys.connections.pending(), { pending: filtered });
      }

      return { previousPending };
    },
    onError: (err, connectionId, context) => {
      if (context?.previousPending) {
        queryClient.setQueryData(queryKeys.connections.pending(), context.previousPending);
      }
      toast.error('Failed to decline request');
    },
    onSuccess: () => {
      toast.success('Request declined');
    },
  });
}

/**
 * Hook to remove a connection with optimistic update
 */
export function useRemoveConnection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (connectionId) => {
      const { data } = await api.delete(`/connections/${connectionId}`);
      return data;
    },
    onMutate: async (connectionId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.connections.list() });
      const previousConnections = queryClient.getQueryData(queryKeys.connections.list());

      // Optimistically remove from connections
      if (previousConnections) {
        const connectionsArray = extractArray(previousConnections, 'connections');
        const filtered = connectionsArray.filter((c) => c.connection_id !== connectionId);
        queryClient.setQueryData(queryKeys.connections.list(), { connections: filtered });
      }

      return { previousConnections };
    },
    onError: (err, connectionId, context) => {
      if (context?.previousConnections) {
        queryClient.setQueryData(queryKeys.connections.list(), context.previousConnections);
      }
      toast.error('Failed to remove connection');
    },
    onSuccess: () => {
      toast.success('Connection removed');
    },
  });
}

/**
 * Hook to send a connection request with optimistic update
 */
export function useSendConnectionRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId) => {
      const { data } = await api.post('/connections/request', null, {
        params: { addressee_id: userId },
      });
      return data;
    },
    onMutate: async (userId) => {
      // Optimistically remove from suggestions
      await queryClient.cancelQueries({ queryKey: queryKeys.connections.discover() });
      const previousSuggestions = queryClient.getQueryData(queryKeys.connections.discover());

      if (previousSuggestions) {
        const suggestionsArray = extractArray(previousSuggestions, 'suggestions');
        const filtered = suggestionsArray.filter((s) => s.user_id !== userId);
        queryClient.setQueryData(queryKeys.connections.discover(), { suggestions: filtered });
      }

      return { previousSuggestions };
    },
    onError: (err, userId, context) => {
      if (context?.previousSuggestions) {
        queryClient.setQueryData(queryKeys.connections.discover(), context.previousSuggestions);
      }
      toast.error(err.response?.data?.detail || 'Failed to send request');
    },
    onSuccess: () => {
      toast.success('Connection request sent!');
    },
    onSettled: () => {
      // Invalidate connection status for any open profile pages
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}
