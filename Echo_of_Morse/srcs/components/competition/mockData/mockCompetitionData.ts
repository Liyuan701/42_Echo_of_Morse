import type {
  OnlineOverviewData,
  RadioConfig,
  RadioId,
  RadioUser,
} from "./competitionTypes";

export const radioConfigs: RadioConfig[] = [
  {
    id: "01",
    name: "Radio Wave 01",
    wpm: 8,
    description:
      "A slower Morse frequency for beginners and warm-up decoding duels.",
  },
  {
    id: "02",
    name: "Radio Wave 02",
    wpm: 12,
    description:
      "A balanced Morse rhythm for players with some regular practice.",
  },
  {
    id: "03",
    name: "Radio Wave 03",
    wpm: 16,
    description:
      "A faster and more intense frequency for advanced Morse players.",
  },
];

export const onlineOverviewMock: OnlineOverviewData = {
  onlineNow: 12,
  currentlyPlaying: 5,
  radioUsers: {
    "01": 3,
    "02": 6,
    "03": 2,
  },
};

export const mockRadioUsersByRadioId: Record<RadioId, RadioUser[]> = {
  "01": [
    {
      id: "current-user",
      username: "you",
      displayName: "You",
      avatarUrl: null,
      avatarInitial: "Y",
      status: "idle",
      isFriend: false,
      isCurrentUser: true,
    },
    {
      id: "u-001",
      username: "alice",
      displayName: "Alice",
      avatarUrl: null,
      avatarInitial: "A",
      status: "ready",
      isFriend: true,
    },
    {
      id: "u-002",
      username: "marc",
      displayName: "Marc",
      avatarUrl: null,
      avatarInitial: "M",
      status: "idle",
      isFriend: true,
    },
    {
      id: "u-003",
      username: "lina",
      displayName: "Lina",
      avatarUrl: null,
      avatarInitial: "L",
      status: "playing",
      isFriend: false,
    },
  ],
  "02": [
    {
      id: "current-user",
      username: "you",
      displayName: "You",
      avatarUrl: null,
      avatarInitial: "Y",
      status: "idle",
      isFriend: false,
      isCurrentUser: true,
    },
    {
      id: "u-004",
      username: "yongyue",
      displayName: "Yongyue",
      avatarUrl: null,
      avatarInitial: "Y",
      status: "ready",
      isFriend: true,
    },
    {
      id: "u-005",
      username: "noah",
      displayName: "Noah",
      avatarUrl: null,
      avatarInitial: "N",
      status: "ready",
      isFriend: false,
    },
    {
      id: "u-006",
      username: "emma",
      displayName: "Emma",
      avatarUrl: null,
      avatarInitial: "E",
      status: "idle",
      isFriend: true,
    },
  ],
  "03": [
    {
      id: "current-user",
      username: "you",
      displayName: "You",
      avatarUrl: null,
      avatarInitial: "Y",
      status: "idle",
      isFriend: false,
      isCurrentUser: true,
    },
    {
      id: "u-007",
      username: "sasha",
      displayName: "Sasha",
      avatarUrl: null,
      avatarInitial: "S",
      status: "playing",
      isFriend: true,
    },
    {
      id: "u-008",
      username: "theo",
      displayName: "Theo",
      avatarUrl: null,
      avatarInitial: "T",
      status: "idle",
      isFriend: false,
    },
  ],
};

export function isValidRadioId(radioId: string): radioId is RadioId {
  return radioId === "01" || radioId === "02" || radioId === "03";
}

export function getRadioConfig(radioId: RadioId): RadioConfig {
  return radioConfigs.find((radio) => radio.id === radioId) ?? radioConfigs[0];
}