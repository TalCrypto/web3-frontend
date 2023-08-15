import { atom } from 'nanostores';

export const $screenWidth = atom(0);
export const $isMobileScreen = atom(false);

$screenWidth.listen(v => {
  // console.log(v);
  $isMobileScreen.set(v <= 768);
});
