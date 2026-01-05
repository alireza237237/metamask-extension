import { formatChainIdToCaip } from '@metamask/bridge-controller';
import {
  createBridgeMockStore,
  MOCK_EVM_ACCOUNT,
} from '../../../test/data/bridge/mock-bridge-store';
import { CHAIN_IDS } from '../../../shared/constants/network';
import { MultichainNetworks } from '../../../shared/constants/multichain/networks';
import { getAccountGroupsByAddress } from '../../selectors/multichain-accounts/account-tree';
import {
  getBridgeBalancesByChainId,
  getBridgeAssetsByAssetId,
  getBridgeSortedAssets,
} from './asset-selectors';

describe('Bridge asset selectors', () => {
  describe('getBridgeAssetsWithBalance', () => {
    it('returns all assets with balance for the given account group and selected asset', () => {
      const state = createBridgeMockStore({
        featureFlagOverrides: {
          bridgeConfig: {
            refreshRate: 30000,
            priceImpactThreshold: {
              normal: 1,
              gasless: 2,
            },
            maxRefreshCount: 5,
            support: true,
            chainRanking: [
              { chainId: formatChainIdToCaip(CHAIN_IDS.MAINNET) },
              { chainId: formatChainIdToCaip(CHAIN_IDS.OPTIMISM) },
              { chainId: formatChainIdToCaip(CHAIN_IDS.POLYGON) },
              { chainId: MultichainNetworks.SOLANA },
              { chainId: MultichainNetworks.BITCOIN },
              { chainId: MultichainNetworks.TRON },
            ],
          },
        },
      });

      const [accountGroup] = getAccountGroupsByAddress(state, [
        MOCK_EVM_ACCOUNT.address,
      ]);
      const assetsWithBalance = getBridgeSortedAssets(state, accountGroup.id);
      const balanceByAssetId = getBridgeAssetsByAssetId(state, accountGroup.id);
      const balanceByChainId = getBridgeBalancesByChainId(
        state,
        accountGroup.id,
      );

      expect(assetsWithBalance).toMatchInlineSnapshot(`
        [
          {
            "assetId": "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp/slip44:501",
            "balance": "1.530",
            "chainId": "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",
            "decimals": 18,
            "name": "Solana",
            "symbol": "SOL",
            "tokenFiatAmount": 210.8493,
          },
          {
            "assetId": "bip122:000000000019d6689c085ae165831e93/slip44:0",
            "balance": ".001",
            "chainId": "bip122:000000000019d6689c085ae165831e93",
            "decimals": 18,
            "name": "Bitcoin",
            "symbol": "BTC",
            "tokenFiatAmount": 91.238,
          },
          {
            "assetId": "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp/token:EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
            "balance": "2.043238",
            "chainId": "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",
            "decimals": 6,
            "name": "USDC",
            "symbol": "USDC",
            "tokenFiatAmount": 2.04284978478,
          },
        ]
      `);
      expect(balanceByAssetId).toMatchInlineSnapshot(`
        {
          "bip122:000000000019d6689c085ae165831e93/slip44:0": {
            "assetId": "bip122:000000000019d6689c085ae165831e93/slip44:0",
            "balance": ".001",
            "chainId": "bip122:000000000019d6689c085ae165831e93",
            "decimals": 18,
            "name": "Bitcoin",
            "symbol": "BTC",
            "tokenFiatAmount": 91.238,
          },
          "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp/slip44:501": {
            "assetId": "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp/slip44:501",
            "balance": "1.530",
            "chainId": "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",
            "decimals": 18,
            "name": "Solana",
            "symbol": "SOL",
            "tokenFiatAmount": 210.8493,
          },
          "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp/token:EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v": {
            "assetId": "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp/token:EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
            "balance": "2.043238",
            "chainId": "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",
            "decimals": 6,
            "name": "USDC",
            "symbol": "USDC",
            "tokenFiatAmount": 2.04284978478,
          },
        }
      `);

      expect(balanceByChainId).toMatchInlineSnapshot(`
        {
          "bip122:000000000019d6689c085ae165831e93": 91.238,
          "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp": 212.89214978478,
        }
      `);
    });
  });
});
