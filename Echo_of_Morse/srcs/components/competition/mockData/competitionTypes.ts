export type RadioId = "01" | "02" | "03";

export const RADIO_LOBBY_MAX_USERS = 7;

// Backend/socket note:
// The lobby status model currently supports only idle, ready, and playing.
// A future spectating state can be added here once the team decides to support
// spectators in the radio lobby and game session flows.
export type RadioUserStatus = "idle" | "ready" | "playing";

export type RadioConfig = {
  id: RadioId;
  name: string;
  wpm: number;
  description: string;
};

export type OnlineOverviewData = {
  onlineNow: number;
  currentlyPlaying: number;
  radioUsers: Record<RadioId, number>;
};

export type RadioUser = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  avatarInitial: string;
  status: RadioUserStatus;
  isFriend: boolean;
  isCurrentUser?: boolean;
};

export type ApiFriend = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  isOnline: boolean;
  lastMessage?: string;
  lastMessageAt?: string;
};
