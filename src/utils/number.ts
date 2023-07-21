export function getRandomIntInclusive(min: number, max: number) {
  const minN = Math.ceil(min);
  const maxN = Math.floor(max);
  return Math.floor(Math.random() * (maxN - minN + 1) + minN);
}
