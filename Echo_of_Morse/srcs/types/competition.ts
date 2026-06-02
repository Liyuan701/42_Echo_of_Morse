export type RadioId = "01" | "02" | "03";

export const RADIO_LOBBY_MAX_USERS = 7;

export type RadioUserStatus = "idle" | "ready" | "playing";

export type RadioConfig = {
  id: RadioId;
  name: string;
  wpm: number;
  description: string;
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