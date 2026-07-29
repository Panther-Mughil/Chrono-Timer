import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TimerStatus = 'idle' | 'running' | 'paused';

export interface Timer {
  id: string;
  name: string;
  duration: number; // in seconds
  remaining: number; // in seconds
  status: TimerStatus;
}

interface AppState {
  timers: Timer[];
  coins: number;
  unlockedItems: number[];
  activeTab: 'timer' | 'shop';
  focusSeconds: number; // accumulator for coins
  
  // Actions
  addTimer: (duration: number, name: string) => void;
  removeTimer: (id: string) => void;
  updateTimerStatus: (id: string, status: TimerStatus) => void;
  resetTimer: (id: string) => void;
  tick: () => void;
  addCoins: (amount: number) => void;
  unlockItem: (id: number, cost: number) => void;
  setActiveTab: (tab: 'timer' | 'shop') => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      timers: [],
      coins: 0,
      unlockedItems: [],
      activeTab: 'timer',
      focusSeconds: 0,

      addTimer: (duration, name) => set((state) => ({
        timers: [...state.timers, { id: crypto.randomUUID(), name, duration, remaining: duration, status: 'idle' }]
      })),
      
      removeTimer: (id) => set((state) => ({
        timers: state.timers.filter(t => t.id !== id)
      })),

      updateTimerStatus: (id, status) => set((state) => ({
        timers: state.timers.map(t => t.id === id ? { ...t, status } : t)
      })),

      resetTimer: (id) => set((state) => ({
        timers: state.timers.map(t => t.id === id ? { ...t, remaining: t.duration, status: 'idle' } : t)
      })),

      tick: () => set((state) => {
        const activeTimers = state.timers.filter(t => t.status === 'running' && t.remaining > 0);
        if (activeTimers.length === 0) return state; // nothing running

        let newCoins = state.coins;
        let newFocusSeconds = state.focusSeconds + 1;

        if (newFocusSeconds >= 60) {
          newCoins += 1;
          newFocusSeconds = 0; // reset accumulator
        }

        const updatedTimers = state.timers.map(t => {
          if (t.status === 'running' && t.remaining > 0) {
            const nextRemaining = t.remaining - 1;
            return {
              ...t,
              remaining: nextRemaining,
              status: (nextRemaining === 0 ? 'idle' : t.status) as TimerStatus
            };
          }
          return t;
        });

        return {
          timers: updatedTimers,
          coins: newCoins,
          focusSeconds: newFocusSeconds,
        };
      }),

      addCoins: (amount) => set((state) => ({ coins: state.coins + amount })),
      unlockItem: (id, cost) => set((state) => {
        if (state.coins >= cost && !state.unlockedItems.includes(id)) {
          return {
            coins: state.coins - cost,
            unlockedItems: [...state.unlockedItems, id]
          };
        }
        return state;
      }),
      setActiveTab: (tab) => set({ activeTab: tab })
    }),
    {
      name: 'chrono-timer-storage',
    }
  )
);
