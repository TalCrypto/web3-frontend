import { atom } from 'nanostores';
import { Address } from 'viem';

interface PositionChangedEvent {
  amm: Address;
  trader: Address;
  txHash: string;
  exchangedNotional: number;
  positionSizeAfter: number;
  exchangedPositionSize: number;
  liquidationPenalty: number;
  vammPrice: number;
}

export const $pendingPositionChangedEvents = atom<PositionChangedEvent[]>([]);
