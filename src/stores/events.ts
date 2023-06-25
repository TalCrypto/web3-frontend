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

interface MarginChangedEvent {
  amm: Address;
  trader: Address;
  txHash: string;
  amount: number;
}

export const $pendingPositionChangedEvents = atom<PositionChangedEvent[]>([]);

export const $pendingMarginChangedEvents = atom<MarginChangedEvent[]>([]);
