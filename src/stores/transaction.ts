import { atom } from 'nanostores';

export const positionChanged = atom({
  event: {},
  isActive: false
});

export const setPositionChanged = (event, isActive) => {
  positionChanged.set({
    event,
    isActive
  });
};

export const resetPositionChanged = () => {
  positionChanged.set({
    event: {},
    isActive: false
  });
};
