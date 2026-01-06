import type {
  AccountsApiDataSourceMessenger as CoreAccountsApiDataSourceMessenger,
  AccountsApiActions,
} from '@metamask/assets-controllers';
import { Messenger } from '@metamask/messenger';
import { RootMessenger } from '../../../lib/messenger';

export type AccountsApiDataSourceMessenger = CoreAccountsApiDataSourceMessenger;

/**
 * Actions that AccountsApiDataSource is allowed to call.
 * These are the BackendApiClient:Accounts:* actions.
 */
type AllowedActions = AccountsApiActions;

/**
 * Get a restricted messenger for AccountsApiDataSource.
 *
 * This messenger allows AccountsApiDataSource to:
 * - Call BackendApiClient:Accounts:* actions for API calls
 * - Register its own actions (fetch, subscribe, etc.)
 * - Publish events (activeChainsChanged, assetsUpdated)
 *
 * @param messenger - The root controller messenger.
 * @returns The restricted messenger for AccountsApiDataSource.
 */
export function getAccountsApiDataSourceMessenger(
  messenger: RootMessenger<AllowedActions, never>,
): CoreAccountsApiDataSourceMessenger {
  const dataSourceMessenger = new Messenger<
    'AccountsApiDataSource',
    AllowedActions,
    never,
    typeof messenger
  >({
    namespace: 'AccountsApiDataSource',
    parent: messenger,
  });

  // Delegate BackendApiClient:Accounts:* actions
  messenger.delegate({
    messenger: dataSourceMessenger,
    actions: [
      'BackendApiClient:Accounts:getV1SupportedNetworks',
      'BackendApiClient:Accounts:getV2SupportedNetworks',
      'BackendApiClient:Accounts:getV2ActiveNetworks',
      'BackendApiClient:Accounts:getV2Balances',
      'BackendApiClient:Accounts:getV2BalancesWithOptions',
      'BackendApiClient:Accounts:getV4MultiAccountBalances',
      'BackendApiClient:Accounts:getV5MultiAccountBalances',
      'BackendApiClient:Accounts:getV1TransactionByHash',
      'BackendApiClient:Accounts:getV1AccountTransactions',
      'BackendApiClient:Accounts:getV4MultiAccountTransactions',
      'BackendApiClient:Accounts:getV1AccountRelationship',
      'BackendApiClient:Accounts:getV2AccountNfts',
      'BackendApiClient:Accounts:getV2AccountTokens',
      'BackendApiClient:Accounts:getServiceMetadata',
      'BackendApiClient:Accounts:getHealth',
    ] as AllowedActions['type'][],
  });

  return dataSourceMessenger as unknown as CoreAccountsApiDataSourceMessenger;
}

