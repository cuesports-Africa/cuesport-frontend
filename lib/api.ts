const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("auth_token");
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "ngrok-skip-browser-warning": "true",
      ...options.headers,
    };

    if (token) {
      (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      const error = data as ApiError;
      throw new Error(error.message || "An error occurred");
    }

    return data as T;
  }

  // GET request
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  // POST request
  async post<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const api = new ApiClient(`${API_BASE_URL}/api`);

// ============================================
// Auth API
// ============================================

export interface User {
  id: number;
  phone_number: string;
  email: string;
  is_verified: boolean;
  is_active: boolean;
  roles: {
    is_super_admin: boolean;
    is_support: boolean;
    is_player: boolean;
    is_organizer: boolean;
  };
  player_profile?: PlayerProfile;
  organizer_profile?: OrganizerProfile;
  created_at: string;
}

export interface PlayerProfile {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  nickname?: string;
  display_name: string;
  date_of_birth: string;
  age: number;
  gender: string;
  photo_url?: string;
  location?: {
    id: number;
    name: string;
    full_path: string;
  };
  rating: {
    current: number;
    best: number;
    category: string;
    category_label: string;
  };
  country_rank?: number;
  country_player_count?: number;
  stats: {
    total_matches: number;
    wins: number;
    losses: number;
    win_rate: number;
    frames_won: number;
    frames_lost: number;
    frame_difference: number;
    frame_win_rate: number;
    tournaments_played: number;
    tournaments_won: number;
  };
  age_category?: {
    name: string;
    code: string;
  };
  created_at: string;
  // Legacy flat fields for backward compatibility
  current_rating?: number;
  highest_rating?: number;
  total_matches?: number;
  wins?: number;
  losses?: number;
}

export interface OrganizerProfile {
  id: number;
  organization_name: string;
  description?: string;
  logo_url?: string;
  is_active: boolean;
  tournaments_hosted: number;
}

export const authApi = {
  login: (data: { phone_number: string; password: string }) =>
    api.post<{ message: string; user: User; token: { access_token: string } }>(
      "/auth/login",
      data
    ),

  register: (data: {
    phone_number: string;
    email: string;
    password: string;
    password_confirmation: string;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    gender: string;
    country_id: number;
    geographic_unit_id: number;
  }) => api.post<{ message: string; user: User }>("/auth/register", data),

  verifyEmail: (data: { email: string; code: string }) =>
    api.post<{ message: string; user: User; token: { access_token: string } }>(
      "/auth/verify-email",
      data
    ),

  me: () => api.get<{ user: User }>("/auth/me"),

  logout: () => api.post<{ message: string }>("/auth/logout"),
};

// ============================================
// Organizer API
// ============================================

export interface OrganizerStats {
  total_tournaments: number;
  active_tournaments: number;
  total_players: number;
  total_revenue: number;
  pending_payouts: number;
}

export const organizerApi = {
  becomeOrganizer: (data: { organization_name: string; description?: string }) =>
    api.post<{ message: string; user: User }>("/organizer/register", data),

  getProfile: () => api.get<{ organizer: OrganizerProfile }>("/organizer"),

  updateProfile: (data: { organization_name?: string; description?: string }) =>
    api.put<{ message: string; organizer: OrganizerProfile }>("/organizer", data),

  uploadLogo: (formData: FormData) =>
    fetch(`${API_BASE_URL}/api/organizer/logo`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        "ngrok-skip-browser-warning": "true",
      },
      body: formData,
    }).then((res) => res.json()),
};

// ============================================
// Organizer Wallet & Payout API
// ============================================

export interface WalletOverview {
  wallet: {
    id: number;
    balance: number;
    pending_balance: number;
    total_earned: number;
    total_withdrawn: number;
    currency: string;
  };
  pending_payouts: number;
  available_balance: number;
  formatted_available: string;
}

export interface PayoutMethod {
  id: number;
  type: "mpesa" | "airtel" | "mtn" | "bank";
  type_label: string;
  account_name: string;
  account_number: string;
  masked_account_number: string;
  bank_code?: string;
  is_default: boolean;
  is_verified: boolean;
}

export interface PayoutRequest {
  id: number;
  amount: number;
  currency: string;
  status: "pending" | "approved" | "processing" | "completed" | "failed" | "cancelled";
  status_label: string;
  payout_method: PayoutMethod;
  requested_at: string;
  processed_at?: string;
  completed_at?: string;
}

export const walletApi = {
  getOverview: () => api.get<WalletOverview>("/organizer/wallet"),

  getTransactions: (params?: { per_page?: number; page?: number }) =>
    api.get<{
      transactions: Array<{
        id: number;
        type: "credit" | "debit";
        source: string;
        amount: number;
        balance_after: number;
        currency: string;
        description?: string;
        created_at: string;
      }>;
      meta: { current_page: number; last_page: number; total: number };
    }>(`/organizer/wallet/transactions${params ? `?${new URLSearchParams(params as Record<string, string>)}` : ""}`),

  getPayoutMethods: () =>
    api.get<{ payout_methods: PayoutMethod[] }>("/organizer/payout-methods"),

  addPayoutMethod: (data: {
    type: "mpesa" | "airtel" | "mtn" | "bank";
    account_name: string;
    account_number: string;
    bank_code?: string;
    is_default?: boolean;
  }) => api.post<{ message: string; payout_method: PayoutMethod }>("/organizer/payout-methods", data),

  setDefaultMethod: (methodId: number) =>
    api.put<{ message: string }>(`/organizer/payout-methods/${methodId}/default`),

  deletePayoutMethod: (methodId: number) =>
    api.delete<{ message: string }>(`/organizer/payout-methods/${methodId}`),

  requestPayout: (data: { amount: number; payout_method_id?: number }) =>
    api.post<{ message: string; payout: PayoutRequest }>("/organizer/payouts", data),

  getPayoutRequests: (params?: { status?: string; per_page?: number; page?: number }) =>
    api.get<{
      payouts: PayoutRequest[];
      meta: { current_page: number; last_page: number; total: number };
    }>(`/organizer/payouts${params ? `?${new URLSearchParams(params as Record<string, string>)}` : ""}`),

  cancelPayout: (payoutId: number) =>
    api.delete<{ message: string }>(`/organizer/payouts/${payoutId}`),
};

// ============================================
// Tournament API
// ============================================

export interface Tournament {
  id: number;
  name: string;
  slug: string;
  description?: string;
  type: {
    value: string;
    label: string;
    description: string;
  };
  format: {
    value: string;
    label: string;
    description: string;
    has_group_stage: boolean;
  };
  status: {
    value: "pending_review" | "draft" | "registration" | "active" | "completed" | "cancelled";
    label: string;
    can_register: boolean;
    can_play: boolean;
    is_finished: boolean;
    is_pending_review: boolean;
  };
  verification: {
    is_verified: boolean;
    verified_at: string | null;
    rejection_reason: string | null;
  };
  geographic_scope?: {
    id: number;
    name: string;
    level: string;
    local_term: string;
    full_path: string;
  };
  venue: {
    name: string | null;
    address: string | null;
  };
  organizer?: {
    id: number;
    name: string;
    logo_url?: string;
  };
  dates: {
    registration_opens_at?: string;
    registration_closes_at?: string;
    starts_at?: string;
    starts_at_date?: string;
    ends_at?: string;
    is_registration_open: boolean;
    is_start_date_reached: boolean;
  };
  can_be_started: boolean;
  settings: {
    winners_count: number;
    winners_per_level: number;
    race_to: number;
    finals_race_to?: number;
    confirmation_hours: number;
  };
  entry_fee: {
    amount: number;
    currency: string;
    formatted: string;
    requires_payment: boolean;
    is_free: boolean;
  };
  stats: {
    participants_count: number;
    matches_count: number;
  };
  created_at: string;
  updated_at: string;
}

export interface TournamentParticipant {
  id: number;
  player: {
    id: number;
    name: string;
    full_name: string;
    photo_url?: string;
    rating: number;
    rating_category: string;
    location?: {
      id: number;
      name: string;
      full_path: string;
    };
    stats?: {
      total_matches: number;
      wins: number;
      losses: number;
      win_rate: number;
    };
  };
  seed?: number;
  status: {
    value: "registered" | "checked_in" | "eliminated" | "winner";
    label: string;
    can_play: boolean;
  };
  final_position?: number;
  stats?: {
    matches_played: number;
    matches_won: number;
    matches_lost: number;
    frames_won: number;
    frames_lost: number;
    frame_difference: number;
    points: number;
    win_rate: number;
  };
  registered_at: string;
  eliminated_at?: string;
}

export const tournamentApi = {
  // Public
  list: (params?: { status?: string; page?: number }) =>
    api.get<{ data: Tournament[]; meta: { current_page: number; last_page: number; total: number } }>(
      `/tournaments${params ? `?${new URLSearchParams(params as Record<string, string>)}` : ""}`
    ),

  get: (id: number) => api.get<{ data: Tournament }>(`/tournaments/${id}`),

  getParticipants: (id: number) =>
    api.get<{ participants: TournamentParticipant[] }>(`/tournaments/${id}/participants`),

  // Player - tournaments they've registered for
  myRegistered: (params?: { page?: number }) =>
    api.get<{ data: Tournament[]; meta: { current_page: number; last_page: number; total: number } }>(
      `/tournaments/my-registered${params ? `?${new URLSearchParams(params as Record<string, string>)}` : ""}`
    ),

  // Organizer - tournaments they've created
  myTournaments: (params?: { status?: string; page?: number }) =>
    api.get<{ data: Tournament[]; meta: { current_page: number; last_page: number; total: number } }>(
      `/tournaments/my-tournaments${params ? `?${new URLSearchParams(params as Record<string, string>)}` : ""}`
    ),

  create: (data: {
    name: string;
    description?: string;
    format?: string;
    max_participants: number;
    entry_fee: number;
    race_to: number;
    finals_race_to?: number;
    starts_at: string;
    registration_deadline?: string;
    registration_closes_at?: string;
    venue_id?: number;
    geographic_scope_id?: number;
    venue_name?: string;
    venue_address?: string;
    type?: string;
  }) => api.post<{ message: string; tournament: Tournament }>("/tournaments", data),

  update: (
    id: number,
    data: {
      name?: string;
      description?: string;
      format?: string;
      race_to?: number;
      finals_race_to?: number;
      entry_fee?: number;
      venue_name?: string;
      venue_address?: string;
      starts_at?: string;
      registration_closes_at?: string;
      geographic_scope_id?: number;
    }
  ) => api.put<{ message: string; tournament: Tournament }>(`/tournaments/${id}`, data),

  delete: (id: number) => api.delete<{ message: string }>(`/tournaments/${id}`),

  openRegistration: (id: number) =>
    api.post<{ message: string; tournament: Tournament }>(`/tournaments/${id}/open-registration`),

  closeRegistration: (id: number) =>
    api.post<{ message: string; tournament: Tournament }>(`/tournaments/${id}/close-registration`),

  start: (id: number) =>
    api.post<{ message: string; tournament: Tournament }>(`/tournaments/${id}/start`),

  cancel: (id: number) =>
    api.post<{ message: string; tournament: Tournament }>(`/tournaments/${id}/cancel`),

  // Player
  register: (id: number) =>
    api.post<{ message: string }>(`/tournaments/${id}/register`),

  withdraw: (id: number) =>
    api.delete<{ message: string }>(`/tournaments/${id}/register`),
};

// ============================================
// Payment API
// ============================================

export interface Payment {
  id: number;
  user_id: number;
  amount: number;
  currency: string;
  type: "entry_fee" | "subscription" | "payout" | "refund";
  status: "pending" | "completed" | "failed" | "refunded";
  reference: string;
  description?: string;
  tournament?: {
    id: number;
    name: string;
  };
  created_at: string;
}

export const paymentApi = {
  list: (params?: { type?: string; page?: number }) =>
    api.get<{ data: Payment[]; meta: { current_page: number; last_page: number; total: number } }>(
      `/payments${params ? `?${new URLSearchParams(params as Record<string, string>)}` : ""}`
    ),

  get: (id: number) => api.get<{ payment: Payment }>(`/payments/${id}`),

  initiateTournamentPayment: (tournamentId: number) =>
    api.post<{ authorization_url: string; reference: string }>(
      `/payments/tournament/${tournamentId}`
    ),

  verify: (reference: string) =>
    api.get<{ payment: Payment }>(`/payments/verify/${reference}`),
};

// ============================================
// Subscription API
// ============================================

export interface Subscription {
  id: number;
  plan_code: string;
  status: "active" | "cancelled" | "expired";
  starts_at: string;
  ends_at: string;
  tournaments_used: number;
  tournaments_limit: number | null;
}

export interface SubscriptionPlan {
  code: string;
  name: string;
  amount: number;
  currency: string;
  interval: string;
  limits: {
    tournaments: number | null;
    players: number | null;
    organizer_accounts: number;
  };
  entry_fees: {
    can_collect: boolean;
    percentage: number;
    flat_fee: number;
  };
  features: string[];
  limitations: string[];
}

export const subscriptionApi = {
  plans: () => api.get<{ plans: SubscriptionPlan[] }>("/subscriptions/plans"),

  current: () => api.get<{ subscription: Subscription | null }>("/subscriptions/current"),

  history: () => api.get<{ subscriptions: Subscription[] }>("/subscriptions/history"),

  canHost: () => api.get<{ can_host: boolean; reason?: string }>("/subscriptions/can-host"),

  subscribe: (planCode: string) =>
    api.post<{ authorization_url: string; reference: string }>(
      `/subscriptions/subscribe/${planCode}`
    ),

  cancel: () => api.post<{ message: string }>("/subscriptions/cancel"),
};

// ============================================
// Profile API
// ============================================

export const profileApi = {
  get: () => api.get("/profile"),

  getSettings: () => api.get("/profile/settings"),

  update: (data: {
    first_name?: string;
    last_name?: string;
    nickname?: string;
    date_of_birth?: string;
    gender?: string;
    location_id?: number;
  }) => api.put("/profile", data),

  uploadPhoto: async (file: File) => {
    const formData = new FormData();
    formData.append("photo", file);
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    const res = await fetch(`${API_BASE_URL}/api/profile/photo`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
      body: formData,
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to upload photo");
    }
    return res.json();
  },

  changePassword: (data: {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
  }) => api.post("/profile/change-password", data),

  getMatches: (params?: Record<string, string>) =>
    api.get(
      `/profile/match-history${params ? `?${new URLSearchParams(params)}` : ""}`
    ),

  getTournaments: (params?: Record<string, string>) =>
    api.get(
      `/profile/tournament-history${params ? `?${new URLSearchParams(params)}` : ""}`
    ),

  getRatingHistory: (params?: Record<string, string>) =>
    api.get(
      `/profile/rating-history${params ? `?${new URLSearchParams(params)}` : ""}`
    ),
};

// ============================================
// Player API (Public profiles)
// ============================================

export interface RankedPlayer {
  rank: number;
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  nickname?: string;
  photo_url?: string;
  rating: number;
  rating_category: {
    value: string;
    label: string;
  };
  wins: number;
  total_matches: number;
  tournaments_won: number;
  community?: string;
  county?: string;
  country?: {
    id: number;
    name: string;
    code: string;
  };
}

export interface RankingsResponse {
  data: RankedPlayer[];
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
  };
}

export interface RankingsParams {
  country_id?: number;
  region_id?: number;
  category?: string;
  sort_by?: "rating" | "wins" | "tournaments_won" | "total_matches";
  page?: number;
  per_page?: number;
}

export interface LeaderboardPlayer {
  id: number;
  name: string;
  nickname?: string | null;
  photo_url?: string | null;
  rating: number;
  rating_category: string | { value: string; label: string };
  wins: number;
  total_matches: number;
  tournaments_won: number;
  country_rank: number;
  location?: string | null;
  country?: {
    id: number;
    name: string;
    code: string;
  };
}

export interface LeaderboardResponse {
  data: LeaderboardPlayer[];
  meta: {
    has_more: boolean;
    next_cursor: number | null;
    per_page: number;
    rank_type: string;
  };
}

export interface LeaderboardParams {
  country_id: number;
  gender?: "male" | "female";
  per_page?: number;
  after?: number;
}

export const playerApi = {
  get: (id: number) => api.get(`/players/${id}`),

  getMatches: (id: number, params?: Record<string, string>) =>
    api.get(
      `/players/${id}/matches${params ? `?${new URLSearchParams(params)}` : ""}`
    ),

  getTournaments: (id: number, params?: Record<string, string>) =>
    api.get(
      `/players/${id}/tournaments${params ? `?${new URLSearchParams(params)}` : ""}`
    ),

  getRatingHistory: (id: number, params?: Record<string, string>) =>
    api.get(
      `/players/${id}/rating-history${params ? `?${new URLSearchParams(params)}` : ""}`
    ),

  search: (query: string, params?: Record<string, string>) =>
    api.get(
      `/players/search?q=${encodeURIComponent(query)}${params ? `&${new URLSearchParams(params)}` : ""}`
    ),

  rankings: (params?: RankingsParams) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.set(key, String(value));
        }
      });
    }
    const queryString = searchParams.toString();
    return api.get<RankingsResponse>(
      `/players/rankings${queryString ? `?${queryString}` : ""}`
    );
  },

  leaderboard: (params: LeaderboardParams) => {
    const searchParams = new URLSearchParams();
    searchParams.set("country_id", String(params.country_id));
    if (params.gender) searchParams.set("gender", params.gender);
    if (params.per_page) searchParams.set("per_page", String(params.per_page));
    if (params.after) searchParams.set("after", String(params.after));
    return api.get<LeaderboardResponse>(
      `/players/leaderboard?${searchParams.toString()}`
    );
  },
};

// ============================================
// Matches Feed API (Public)
// ============================================

export interface FeedMatch {
  id: number;
  round_number: number;
  round_name: string;
  bracket_position: number;
  match_type: string;
  status: {
    value: string;
    label: string;
  };
  player1: {
    id: number;
    name: string;
    photo_url: string | null;
    seed: number | null;
  } | null;
  player2: {
    id: number;
    name: string;
    photo_url: string | null;
    seed: number | null;
  } | null;
  player1_score: number | null;
  player2_score: number | null;
  winner_id: number | null;
  scheduled_at: string | null;
  played_at: string | null;
}

export interface FeedTournament {
  id: number;
  name: string;
  slug: string;
  status: {
    value: string;
    label: string;
  };
  venue: {
    name: string | null;
    address: string | null;
  };
  organizer: {
    name: string;
    logo_url: string | null;
  } | null;
  matches: FeedMatch[];
}

export interface MatchesFeedResponse {
  tournaments: FeedTournament[];
  stats: {
    total_tournaments: number;
    total_matches: number;
    live: number;
    scheduled: number;
    completed: number;
  };
  date: string;
}

export interface MatchesFeedParams {
  date?: string;
  tournament_id?: number;
  status?: string;
}

export interface ActiveMatch {
  id: number;
  round_number: number;
  round_name: string;
  bracket_position: number;
  status: {
    value: string;
    label: string;
  };
  player1: {
    id: number;
    name: string;
    photo_url?: string;
    phone_number?: string;
  } | null;
  player2: {
    id: number;
    name: string;
    photo_url?: string;
    phone_number?: string;
  } | null;
  player1_score: number | null;
  player2_score: number | null;
  winner_id: number | null;
  scheduled_at: string | null;
  played_at: string | null;
  result_submitted_by?: number;
  confirmation_deadline?: string;
  tournament: {
    id: number;
    name: string;
  };
}

export interface MyMatchesResponse {
  pending: ActiveMatch[];
  requiring_action: ActiveMatch[];
  recent: ActiveMatch[];
}

// Match detail types
export interface MatchDetail {
  id: number;
  tournament_id: number;
  tournament?: {
    id: number;
    name: string;
    type?: string;
    race_to?: number;
    finals_race_to?: number;
  };
  stage_id: number | null;
  round: {
    number: number;
    name: string;
  };
  match_type: string;
  match_type_label: string;
  bracket_position: number;
  player1: {
    id: number;
    player_profile_id: number;
    name: string;
    photo_url?: string | null;
    phone_number?: string;
    rating?: number;
    score: number;
    is_winner: boolean;
  } | null;
  player2: {
    id: number;
    player_profile_id: number;
    name: string;
    photo_url?: string | null;
    phone_number?: string;
    rating?: number;
    score: number;
    is_winner: boolean;
  } | null;
  score: string;
  status: string;
  status_label: string;
  winner_id: number | null;
  submission: {
    submitted_by: number | null;
    submitted_at: string | null;
    confirmed_by: number | null;
    confirmed_at: string | null;
  };
  dispute?: {
    disputed_by: number | null;
    disputed_at: string | null;
    reason: string | null;
    resolved_by: number | null;
    resolved_at: string | null;
    resolution_notes: string | null;
  };
  timing: {
    scheduled_play_date: string | null;
    played_at: string | null;
    expires_at: string | null;
    time_remaining: string | null;
  };
  next_match?: {
    id: number;
    slot: string;
  };
  group_number: number | null;
}

export interface MatchEvidence {
  id: number;
  match_id: number;
  type: string;
  url: string;
  description?: string;
  uploaded_by: {
    id: number;
    name: string;
  };
  created_at: string;
}

export const matchesApi = {
  feed: (params?: MatchesFeedParams) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.set(key, String(value));
        }
      });
    }
    const queryString = searchParams.toString();
    return api.get<MatchesFeedResponse>(
      `/matches/feed${queryString ? `?${queryString}` : ""}`
    );
  },

  myMatches: () => api.get<MyMatchesResponse>("/matches/my-matches"),

  get: async (matchId: number) => {
    const response = await api.get<{ data: MatchDetail }>(`/matches/${matchId}`);
    return response.data;
  },

  submitResult: (matchId: number, data: { my_score: number; opponent_score: number }) =>
    api.post(`/matches/${matchId}/submit-result`, data),

  confirmResult: (matchId: number) =>
    api.post(`/matches/${matchId}/confirm`),

  disputeResult: (matchId: number, data: { reason: string; my_score?: number; opponent_score?: number }) =>
    api.post(`/matches/${matchId}/dispute`, data),

  reportNoShow: (matchId: number, data: { description: string }) =>
    api.post(`/matches/${matchId}/report-no-show`, data),

  // Evidence
  getEvidence: (matchId: number) =>
    api.get<{ evidence: MatchEvidence[] }>(`/matches/${matchId}/evidence`),

  uploadEvidence: async (matchId: number, file: File, type: "image" | "video", description?: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    if (description) {
      formData.append("description", description);
    }
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    console.log("uploadEvidence: Sending request", { matchId, type, fileName: file.name, fileSize: file.size, fileType: file.type });
    const res = await fetch(`${API_BASE_URL}/api/matches/${matchId}/evidence`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      body: formData,
    });
    console.log("uploadEvidence: Response", { status: res.status, ok: res.ok });
    if (!res.ok) {
      const error = await res.json();
      console.error("uploadEvidence: Error response", error);
      throw new Error(error.message || "Failed to upload evidence");
    }
    return res.json() as Promise<{ message: string; evidence: MatchEvidence }>;
  },

  deleteEvidence: (matchId: number, evidenceId: number) =>
    api.delete<{ message: string }>(`/matches/${matchId}/evidence/${evidenceId}`),

  addVideoLink: (matchId: number, url: string, description?: string) =>
    api.post<{ message: string; evidence: MatchEvidence }>(`/matches/${matchId}/evidence`, {
      type: "video",
      url,
      description,
    }),
};

// ============================================
// Country Rankings API (Public)
// ============================================

export interface RankedCountry {
  rank: number;
  country: {
    id: number;
    name: string;
    code: string;
  };
  top_10_avg: number;
  top_players_count: number;
  total_players: number;
  pro_count: number;
  avg_rating: number;
  tournaments_won: number;
  total_matches: number;
  total_wins: number;
  highest_rating: number;
}

export interface CountryRankingsResponse {
  data: RankedCountry[];
  meta: {
    total: number;
    sort_by: string;
    ranking_method: string;
  };
}

export type CountrySortBy =
  | "top_10_avg"
  | "total_players"
  | "pro_count"
  | "avg_rating"
  | "tournaments_won"
  | "total_matches"
  | "highest_rating";

export const countryApi = {
  rankings: (sortBy?: CountrySortBy) => {
    const params = sortBy ? `?sort_by=${sortBy}` : "";
    return api.get<CountryRankingsResponse>(`/countries/rankings${params}`);
  },
};

// ============================================
// Location API (Public)
// ============================================

export interface GeographicUnit {
  id: number;
  name: string;
  code?: string;
  type: "country" | "region" | "county" | "sub_county" | "ward" | "community";
  parent_id?: number;
}

export const locationApi = {
  countries: () => api.get<{ countries: GeographicUnit[] }>("/locations/countries"),

  search: (query: string, options?: { level?: number; country_id?: number }) =>
    api.get<{ results: Array<{ id: number; name: string; full_path: string; level: number; local_term: string }> }>(
      `/locations/search?q=${encodeURIComponent(query)}${options?.level ? `&level=${options.level}` : ""}${options?.country_id ? `&country_id=${options.country_id}` : ""}`
    ),

  get: (id: number) => api.get<{
    location: GeographicUnit;
    ancestors: Array<{ id: number; name: string; level: number; local_term: string }>
  }>(`/locations/${id}`),

  children: (id: number) =>
    api.get<{ children: GeographicUnit[] }>(`/locations/${id}/children`),
};

// ============================================
// Articles API (Public)
// ============================================

export interface ArticleCategory {
  value: string;
  label: string;
  color: string;
}

export interface ArticleStatus {
  value: string;
  label: string;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  featured_image_url: string | null;
  category: ArticleCategory;
  author: string;
  status: ArticleStatus;
  is_featured: boolean;
  view_count: number;
  read_time: string;
  read_time_minutes: number;
  published_at: string | null;
  formatted_date: string | null;
  created_at: string;
  updated_at: string;
  meta?: {
    title: string;
    description: string;
  };
}

export interface ArticlesResponse {
  data: Article[];
  categories: Array<{
    name: string;
    slug: string;
    count: number;
  }>;
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface ArticlesParams {
  category?: string;
  featured?: boolean;
  search?: string;
  page?: number;
  per_page?: number;
}

export const articleApi = {
  list: (params?: ArticlesParams) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.set(key, String(value));
        }
      });
    }
    const queryString = searchParams.toString();
    return api.get<ArticlesResponse>(
      `/articles${queryString ? `?${queryString}` : ""}`
    );
  },

  get: (slug: string) => api.get<{ data: Article }>(`/articles/${slug}`),

  trending: (limit?: number) =>
    api.get<{ data: Article[] }>(
      `/articles/trending${limit ? `?limit=${limit}` : ""}`
    ),

  featured: () => api.get<{ data: Article | null }>("/articles/featured"),

  related: (slug: string, limit?: number) =>
    api.get<{ data: Article[] }>(
      `/articles/${slug}/related${limit ? `?limit=${limit}` : ""}`
    ),
};

// ============================================
// Role Helper Functions
// ============================================

export type UserRole = "player" | "organizer" | "support" | "super_admin";

export const roleHelpers = {
  /**
   * Check if user has player role
   */
  isPlayer: (user: User | null): boolean => {
    return !!user?.roles?.is_player;
  },

  /**
   * Check if user has organizer role with active profile
   */
  isOrganizer: (user: User | null): boolean => {
    return !!user?.roles?.is_organizer && !!user?.organizer_profile;
  },

  /**
   * Check if user has both player and organizer roles
   */
  isDualRole: (user: User | null): boolean => {
    return roleHelpers.isPlayer(user) && roleHelpers.isOrganizer(user);
  },

  /**
   * Check if user has support role
   */
  isSupport: (user: User | null): boolean => {
    return !!user?.roles?.is_support;
  },

  /**
   * Check if user has super admin role
   */
  isSuperAdmin: (user: User | null): boolean => {
    return !!user?.roles?.is_super_admin;
  },

  /**
   * Get the default dashboard path for a user
   */
  getDefaultDashboard: (user: User | null): string => {
    if (!user) return "/auth/signin";

    const isPlayer = roleHelpers.isPlayer(user);
    const isOrganizer = roleHelpers.isOrganizer(user);

    // Dual role - show role selection
    if (isPlayer && isOrganizer) {
      return "/auth/role-select";
    }

    // Single role
    if (isPlayer) return "/player";
    if (isOrganizer) return "/organizer";

    // Fallback for edge cases
    return "/";
  },

  /**
   * Get list of available roles for a user
   */
  getAvailableRoles: (user: User | null): UserRole[] => {
    if (!user) return [];

    const roles: UserRole[] = [];
    if (user.roles?.is_player) roles.push("player");
    if (user.roles?.is_organizer && user.organizer_profile) roles.push("organizer");
    if (user.roles?.is_support) roles.push("support");
    if (user.roles?.is_super_admin) roles.push("super_admin");

    return roles;
  },

  /**
   * Get user's display name based on active role
   */
  getDisplayName: (user: User | null, role: UserRole = "player"): string => {
    if (!user) return "Guest";

    if (role === "organizer" && user.organizer_profile) {
      return user.organizer_profile.organization_name;
    }

    if (user.player_profile) {
      return `${user.player_profile.first_name} ${user.player_profile.last_name}`;
    }

    return user.email;
  },
};
