import { QueryClient } from '@tanstack/react-query';

// Create the query client with optimized defaults
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is fresh for 30 seconds - no refetch during this time
      staleTime: 30 * 1000,
      // Keep unused data in cache for 5 minutes
      gcTime: 5 * 60 * 1000,
      // Retry failed requests 2 times
      retry: 2,
      // Don't refetch when window regains focus (reduces unnecessary calls)
      refetchOnWindowFocus: false,
      // Refetch when reconnecting to internet
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry mutations once
      retry: 1,
    },
  },
});

// Query key factory for consistent key structure across the app
// This ensures cache invalidation works correctly
export const queryKeys = {
  // User queries
  user: {
    all: ['user'],
    me: () => ['user', 'me'],
    byId: (id) => ['user', id],
  },

  // Gym queries
  gyms: {
    all: ['gyms'],
    list: (filters) => ['gyms', 'list', filters],
    byId: (id) => ['gyms', id],
    nearby: (lat, lng, radius) => ['gyms', 'nearby', { lat, lng, radius }],
    leaderboard: (gymId, period) => ['gyms', gymId, 'leaderboard', period],
    members: (gymId) => ['gyms', gymId, 'members'],
    // Smart search keys
    smartSearch: (query, lat, lng) => ['gyms', 'smart-search', query, lat, lng],
    preload: (lat, lng) => ['gyms', 'preload', lat, lng],
    suggestions: (lat, lng) => ['gyms', 'suggestions', lat, lng],
  },

  // Connections queries
  connections: {
    all: ['connections'],
    list: () => ['connections', 'list'],
    pending: () => ['connections', 'pending'],
    discover: () => ['connections', 'discover'],
    allData: () => ['connections', 'all-data'],
  },

  // Check-ins queries
  checkins: {
    all: ['checkins'],
    mine: () => ['checkins', 'mine'],
    feed: () => ['checkins', 'feed'],
  },

  // Engagement queries
  engagement: {
    all: ['engagement'],
    userProgress: () => ['engagement', 'user-progress'],
    gymActivity: (gymId) => ['engagement', 'gym-activity', gymId],
    leaderboardPosition: (gymId) => ['engagement', 'leaderboard-position', gymId],
    gymVsGym: () => ['engagement', 'gym-vs-gym'],
    dashboard: () => ['engagement', 'dashboard'],
  },

  // Leaderboards queries
  leaderboards: {
    all: ['leaderboards'],
    connections: () => ['leaderboards', 'connections'],
    city: (city) => ['leaderboards', 'city', city],
  },

  // Challenges queries
  challenges: {
    all: ['challenges'],
    list: (filters) => ['challenges', 'list', filters],
    byId: (id) => ['challenges', id],
    mine: () => ['challenges', 'mine'],
    leaderboard: (id) => ['challenges', id, 'leaderboard'],
  },

  // Notifications queries
  notifications: {
    all: ['notifications'],
    list: () => ['notifications', 'list'],
    count: () => ['notifications', 'count'],
  },

  // Credits queries (legacy)
  credits: {
    all: ['credits'],
    balance: () => ['credits', 'balance'],
  },

  // Coins queries (new coin system)
  coins: {
    all: ['coins'],
    balance: () => ['coins', 'balance'],
    summary: () => ['coins', 'summary'],
    transactions: (limit, offset) => ['coins', 'transactions', { limit, offset }],
    streak: () => ['coins', 'streak'],
    referral: () => ['coins', 'referral'],
    economyInfo: () => ['coins', 'economy-info'],
    store: () => ['coins', 'store'],
    challengePool: (challengeId) => ['coins', 'challenge-pool', challengeId],
  },
};

// Stale time configurations by data type
// Use these when you need specific cache behavior per query type
export const staleTimes = {
  user: 2 * 60 * 1000,        // 2 minutes - user data changes infrequently
  gym: 5 * 60 * 1000,         // 5 minutes - gym data is mostly static
  leaderboard: 60 * 1000,     // 1 minute - leaderboards update moderately
  feed: 30 * 1000,            // 30 seconds - feed should be relatively fresh
  connections: 60 * 1000,     // 1 minute - connections change occasionally
  notifications: 30 * 1000,   // 30 seconds - notifications should be timely
  challenges: 2 * 60 * 1000,  // 2 minutes - challenges don't change often
  // Smart search stale times
  searchResults: 5 * 60 * 1000,  // 5 minutes - search results cached longer
  preload: 30 * 60 * 1000,       // 30 minutes - preloaded gyms
  suggestions: 10 * 60 * 1000,   // 10 minutes - personalized suggestions
};
