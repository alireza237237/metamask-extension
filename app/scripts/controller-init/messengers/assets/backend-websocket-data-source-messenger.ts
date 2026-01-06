import type {
  BackendWebsocketDataSourceMessenger as CoreBackendWebsocketDataSourceMessenger,
  BackendWebsocketDataSourceAllowedActions,
  BackendWebsocketDataSourceAllowedEvents,
} from '@metamask/assets-controllers';
import { Messenger } from '@metamask/messenger';
import { RootMessenger } from '../../../lib/messenger';

export type BackendWebsocketDataSourceMessenger =
  CoreBackendWebsocketDataSourceMessenger;

/**
 * Actions that BackendWebsocketDataSource is allowed to call.
 * These are the BackendWebSocketService:* actions.
 */
type AllowedActions = BackendWebsocketDataSourceAllowedActions;

/**
 * Events that BackendWebsocketDataSource is allowed to subscribe to.
 */
type AllowedEvents = BackendWebsocketDataSourceAllowedEvents;

/**
 * Get a restricted messenger for BackendWebsocketDataSource.
 *
 * This messenger allows BackendWebsocketDataSource to:
 * - Call BackendWebSocketService:* actions for WebSocket operations
 * - Register its own actions (fetch, subscribe, etc.)
 * - Publish events (activeChainsChanged, assetsUpdated)
 * - Subscribe to connection state changes
 *
 * @param messenger - The root controller messenger.
 * @returns The restricted messenger for BackendWebsocketDataSource.
 */
export function getBackendWebsocketDataSourceMessenger(
  messenger: RootMessenger<AllowedActions, AllowedEvents>,
): CoreBackendWebsocketDataSourceMessenger {
  const dataSourceMessenger = new Messenger<
    'BackendWebsocketDataSource',
    AllowedActions,
    AllowedEvents,
    typeof messenger
  >({
    namespace: 'BackendWebsocketDataSource',
    parent: messenger,
  });

  // Delegate BackendWebSocketService:* actions
  messenger.delegate({
    messenger: dataSourceMessenger,
    actions: [
      'BackendWebSocketService:connect',
      'BackendWebSocketService:disconnect',
      'BackendWebSocketService:forceReconnection',
      'BackendWebSocketService:sendMessage',
      'BackendWebSocketService:sendRequest',
      'BackendWebSocketService:subscribe',
      'BackendWebSocketService:getConnectionInfo',
      'BackendWebSocketService:getSubscriptionsByChannel',
      'BackendWebSocketService:channelHasSubscription',
      'BackendWebSocketService:findSubscriptionsByChannelPrefix',
      'BackendWebSocketService:addChannelCallback',
      'BackendWebSocketService:removeChannelCallback',
      'BackendWebSocketService:getChannelCallbacks',
    ] as AllowedActions['type'][],
    events: [
      // WebSocket connection state changes
      'BackendWebSocketService:connectionStateChanged',
      // AccountsApiDataSource chain changes - for syncing supported chains
      'AccountsApiDataSource:activeChainsChanged',
    ] as AllowedEvents['type'][],
  });

  return dataSourceMessenger as unknown as CoreBackendWebsocketDataSourceMessenger;
}

