export const abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'bool',
        name: 'isProvider',
        type: 'bool'
      }
    ],
    name: 'BackstopLiquidityProviderChanged',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint8',
        name: 'version',
        type: 'uint8'
      }
    ],
    name: 'Initialized',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'amm',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'int256',
        name: 'amount',
        type: 'int256'
      },
      {
        indexed: false,
        internalType: 'int256',
        name: 'fundingPayment',
        type: 'int256'
      }
    ],
    name: 'MarginChanged',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'OwnershipTransferred',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'Paused',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'trader',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'amm',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'int256',
        name: 'margin',
        type: 'int256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'positionNotional',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'int256',
        name: 'exchangedPositionSize',
        type: 'int256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'fee',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'int256',
        name: 'positionSizeAfter',
        type: 'int256'
      },
      {
        indexed: false,
        internalType: 'int256',
        name: 'realizedPnl',
        type: 'int256'
      },
      {
        indexed: false,
        internalType: 'int256',
        name: 'unrealizedPnlAfter',
        type: 'int256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'badDebt',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'liquidationPenalty',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'spotPrice',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'int256',
        name: 'fundingPayment',
        type: 'int256'
      }
    ],
    name: 'PositionChanged',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'trader',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'amm',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'positionNotional',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'positionSize',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'feeToLiquidator',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'feeToInsuranceFund',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'liquidator',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'badDebt',
        type: 'uint256'
      }
    ],
    name: 'PositionLiquidated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'amm',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'trader',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'valueTransferred',
        type: 'uint256'
      }
    ],
    name: 'PositionSettled',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'amm',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'quoteAssetReserve',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'baseAssetReserve',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'int256',
        name: 'cost',
        type: 'int256'
      }
    ],
    name: 'Repeg',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'amm',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'blockNumber',
        type: 'uint256'
      }
    ],
    name: 'RestrictionModeEntered',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'Unpaused',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'amm',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'quoteAssetReserve',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'baseAssetReserve',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'int256',
        name: 'cost',
        type: 'int256'
      }
    ],
    name: 'UpdateK',
    type: 'event'
  },
  {
    inputs: [],
    name: 'LIQ_SWITCH_RATIO',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'contract IAmm',
        name: '_amm',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '_addedMargin',
        type: 'uint256'
      }
    ],
    name: 'addMargin',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    name: 'backstopLiquidityProviderMap',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'contract IAmm',
        name: '_amm',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '_quoteAssetAmountLimit',
        type: 'uint256'
      }
    ],
    name: 'closePosition',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'contract IERC20',
        name: '_token',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256'
      }
    ],
    name: 'depositCallback',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'contract IAmm',
        name: '_amm',
        type: 'address'
      }
    ],
    name: 'getLatestCumulativePremiumFractionLong',
    outputs: [
      {
        internalType: 'int256',
        name: 'latest',
        type: 'int256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'contract IAmm',
        name: '_amm',
        type: 'address'
      }
    ],
    name: 'getLatestCumulativePremiumFractionShort',
    outputs: [
      {
        internalType: 'int256',
        name: 'latest',
        type: 'int256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'contract IAmm',
        name: '_amm',
        type: 'address'
      },
      {
        internalType: 'address',
        name: '_trader',
        type: 'address'
      }
    ],
    name: 'getMarginRatio',
    outputs: [
      {
        internalType: 'int256',
        name: '',
        type: 'int256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'contract IAmm',
        name: '_amm',
        type: 'address'
      },
      {
        internalType: 'address',
        name: '_trader',
        type: 'address'
      }
    ],
    name: 'getPosition',
    outputs: [
      {
        components: [
          {
            internalType: 'int256',
            name: 'size',
            type: 'int256'
          },
          {
            internalType: 'int256',
            name: 'margin',
            type: 'int256'
          },
          {
            internalType: 'uint256',
            name: 'openNotional',
            type: 'uint256'
          },
          {
            internalType: 'int256',
            name: 'lastUpdatedCumulativePremiumFraction',
            type: 'int256'
          },
          {
            internalType: 'uint256',
            name: 'blockNumber',
            type: 'uint256'
          }
        ],
        internalType: 'struct IClearingHouse.Position',
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'contract IAmm',
        name: '_amm',
        type: 'address'
      },
      {
        internalType: 'address',
        name: '_trader',
        type: 'address'
      },
      {
        internalType: 'enum ClearingHouse.PnlCalcOption',
        name: '_pnlCalcOption',
        type: 'uint8'
      }
    ],
    name: 'getPositionNotionalAndUnrealizedPnl',
    outputs: [
      {
        internalType: 'uint256',
        name: 'positionNotional',
        type: 'uint256'
      },
      {
        internalType: 'int256',
        name: 'unrealizedPnl',
        type: 'int256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'contract IAmm',
        name: '_amm',
        type: 'address'
      }
    ],
    name: 'getVaultFor',
    outputs: [
      {
        internalType: 'uint256',
        name: 'vault',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'contract IInsuranceFund',
        name: '_insuranceFund',
        type: 'address'
      }
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'insuranceFund',
    outputs: [
      {
        internalType: 'contract IInsuranceFund',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'contract IAmm',
        name: '_amm',
        type: 'address'
      },
      {
        internalType: 'address',
        name: '_trader',
        type: 'address'
      }
    ],
    name: 'liquidate',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'contract IAmm',
        name: '_amm',
        type: 'address'
      },
      {
        internalType: 'address',
        name: '_trader',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '_quoteAssetAmountLimit',
        type: 'uint256'
      }
    ],
    name: 'liquidateWithSlippage',
    outputs: [
      {
        internalType: 'uint256',
        name: 'quoteAssetAmount',
        type: 'uint256'
      },
      {
        internalType: 'bool',
        name: 'isPartialClose',
        type: 'bool'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_whitelistMaster',
        type: 'address'
      }
    ],
    name: 'makePrivate',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'makePublic',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'contract IAmm',
        name: '',
        type: 'address'
      }
    ],
    name: 'netRevenuesSinceLastFunding',
    outputs: [
      {
        internalType: 'int256',
        name: '',
        type: 'int256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'contract IAmm',
        name: '_amm',
        type: 'address'
      },
      {
        internalType: 'enum IClearingHouse.Side',
        name: '_side',
        type: 'uint8'
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_leverage',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_oppositeAmountBound',
        type: 'uint256'
      },
      {
        internalType: 'bool',
        name: '_isQuote',
        type: 'bool'
      }
    ],
    name: 'openPosition',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'pause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'paused',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'contract IAmm',
        name: '_amm',
        type: 'address'
      }
    ],
    name: 'payFunding',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    name: 'prepaidBadDebts',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'contract IAmm',
        name: '_amm',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '_removedMargin',
        type: 'uint256'
      }
    ],
    name: 'removeMargin',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      },
      {
        internalType: 'bool',
        name: 'isProvider',
        type: 'bool'
      }
    ],
    name: 'setBackstopLiquidityProvider',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_tollPool',
        type: 'address'
      }
    ],
    name: 'setTollPool',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'contract IAmm',
        name: '_amm',
        type: 'address'
      }
    ],
    name: 'settlePosition',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'tollPool',
    outputs: [
      {
        internalType: 'contract IMultiTokenRewardRecipient',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'unpause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'contract IAmm',
        name: '',
        type: 'address'
      }
    ],
    name: 'vaults',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'whitelistMaster',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
] as const;
