import { BackendWebsocketDataSource } from '@metamask/assets-controllers';
import { ControllerInitFunction } from '../types';
import { BackendWebsocketDataSourceMessenger } from '../messengers/assets';

/**
 * Initialize the BackendWebsocketDataSource.
 *
 * BackendWebsocketDataSource provides real-time balance updates via WebSocket.
 * It communicates with BackendWebSocketService via the Messenger pattern.
 *
 * Actions exposed:
 * - BackendWebsocketDataSource:getActiveChains
 * - BackendWebsocketDataSource:fetch
 * - BackendWebsocketDataSource:subscribe
 * - BackendWebsocketDataSource:unsubscribe
 *
 * Events published:
 * - BackendWebsocketDataSource:activeChainsChanged
 * - BackendWebsocketDataSource:assetsUpdated
 */
export const BackendWebsocketDataSourceInit: ControllerInitFunction<
  BackendWebsocketDataSource,
  BackendWebsocketDataSourceMessenger
> = ({ controllerMessenger, persistedState }) => {
  const dataSource = new BackendWebsocketDataSource({
    messenger: controllerMessenger,
    state: persistedState.BackendWebsocketDataSource,
  });

  return {
    controller: dataSource,
    // BackendWebsocketDataSource state can be persisted for faster startup
    persistedStateKey: 'BackendWebsocketDataSource',
    memStateKey: null,
  };
};

