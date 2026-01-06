import { AccountsApiDataSource } from '@metamask/assets-controllers';
import { ControllerInitFunction } from '../types';
import { AccountsApiDataSourceMessenger } from '../messengers/assets';

/**
 * Initialize the AccountsApiDataSource.
 *
 * AccountsApiDataSource provides balance data from the MetaMask Accounts API.
 * It communicates with BackendApiClient via the Messenger pattern.
 *
 * Actions exposed:
 * - AccountsApiDataSource:getActiveChains
 * - AccountsApiDataSource:fetch
 * - AccountsApiDataSource:subscribe
 * - AccountsApiDataSource:unsubscribe
 *
 * Events published:
 * - AccountsApiDataSource:activeChainsChanged
 * - AccountsApiDataSource:assetsUpdated
 */
export const AccountsApiDataSourceInit: ControllerInitFunction<
  AccountsApiDataSource,
  AccountsApiDataSourceMessenger
> = ({ controllerMessenger, persistedState }) => {
  const dataSource = new AccountsApiDataSource({
    messenger: controllerMessenger,
    state: persistedState.AccountsApiDataSource,
  });

  return {
    controller: dataSource,
    // AccountsApiDataSource state can be persisted for faster startup
    persistedStateKey: 'AccountsApiDataSource',
    memStateKey: null,
  };
};

