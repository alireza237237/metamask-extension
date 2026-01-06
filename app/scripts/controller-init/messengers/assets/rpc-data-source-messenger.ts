import type {
  RpcDataSourceMessenger as CoreRpcDataSourceMessenger,
  RpcDataSourceAllowedActions,
  RpcDataSourceAllowedEvents,
} from '@metamask/assets-controllers';
import { Messenger } from '@metamask/messenger';
import { RootMessenger } from '../../../lib/messenger';

export type RpcDataSourceMessenger = CoreRpcDataSourceMessenger;

/**
 * Actions that RpcDataSource is allowed to call.
 */
type AllowedActions = RpcDataSourceAllowedActions;

/**
 * Events that RpcDataSource is allowed to subscribe to.
 */
type AllowedEvents = RpcDataSourceAllowedEvents;

/**
 * Get a restricted messenger for RpcDataSource.
 *
 * This messenger allows RpcDataSource to:
 * - Call NetworkController:getState to get network configurations
 * - Subscribe to NetworkController:stateChange for network updates
 * - Register its own actions (fetch, subscribe, etc.)
 * - Publish events (activeChainsChanged, assetsUpdated)
 *
 * @param messenger - The root controller messenger.
 * @returns The restricted messenger for RpcDataSource.
 */
export function getRpcDataSourceMessenger(
  messenger: RootMessenger<AllowedActions, AllowedEvents>,
): CoreRpcDataSourceMessenger {
  const dataSourceMessenger = new Messenger<
    'RpcDataSource',
    AllowedActions,
    AllowedEvents,
    typeof messenger
  >({
    namespace: 'RpcDataSource',
    parent: messenger,
  });

  // Delegate NetworkController actions and events
  messenger.delegate({
    messenger: dataSourceMessenger,
    actions: [
      'NetworkController:getState',
      'NetworkController:getNetworkClientById',
    ] as AllowedActions['type'][],
    events: ['NetworkController:stateChange'] as AllowedEvents['type'][],
  });

  return dataSourceMessenger as unknown as CoreRpcDataSourceMessenger;
}

