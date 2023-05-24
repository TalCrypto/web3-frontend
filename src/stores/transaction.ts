import { atom } from 'nanostores';

interface PositionChangedState {
  event: any;
  isActive: boolean;
}

export const positionChanged = atom<PositionChangedState>({
  event: {},
  isActive: false
});

export const setPositionChanged = (event: any, isActive: boolean): void => {
  positionChanged.set({
    event,
    isActive
  });
};

export const resetPositionChanged = (): void => {
  positionChanged.set({
    event: {},
    isActive: false
  });
};
