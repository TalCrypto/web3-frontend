export default function networkNameDisplay(currentChain: number): string {
  let networkName = '';
  switch (currentChain) {
    case 1:
      networkName = 'Ethereum Mainnet';
      break;

    case 5:
      networkName = 'Goerli Testnet';
      break;

    case 137:
      networkName = 'Polygon Mainnet';
      break;

    case 42161:
      networkName = 'Arbitrum One Mainnet';
      break;

    case 421613:
      networkName = 'Arbitrum Goerli Testnet';
      break;

    case 11155111:
      networkName = 'Sepolia Testnet';
      break;

    default:
      networkName = 'Unidentified Network';
      break;
  }
  return networkName;
}
