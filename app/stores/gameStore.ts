import { create } from "zustand";
import { getGames } from "../api/game/gameApi";
import type { GameSummary } from "../api/game/types";

interface GameStoreState {
  games: GameSummary[];
  loading: boolean;
  error: string | null;
  isMock: boolean;
  fetchGames: () => Promise<GameSummary[]>;
}

export const useGameStore = create<GameStoreState>((set, get) => ({
  games: [],
  loading: false,
  error: null,
  isMock: false,
  async fetchGames() {
    if (get().loading) {
      return get().games;
    }

    set({ loading: true, error: null });
    try {
      const { data, isMock } = await getGames();
      set({
        games: data,
        loading: false,
        isMock,
        error: null,
      });
      return data;
    } catch (error) {
      set({
        games: [],
        loading: false,
        isMock: true,
        error:
          error instanceof Error
            ? error.message
            : "게임 정보를 불러오는 중 오류가 발생했습니다.",
      });
      throw error;
    }
  },
}));
