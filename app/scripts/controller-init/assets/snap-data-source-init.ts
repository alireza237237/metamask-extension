import {
  SnapDataSource,
  ALL_DEFAULT_NETWORKS,
  type SnapDataSourceMessenger,
  type SnapProvider,
} from '@metamask/assets-controllers';
import { HandlerType } from '@metamask/snaps-utils';
import { ControllerInitFunction } from '../types';

// ============================================================================
// SNAP PROVIDER
// ============================================================================

/**
 * Creates a snap provider that uses MetaMask's snap infrastructure.
 *
 * This provider uses the SnapController's handleRequest method to communicate
 * with installed snaps. It supports:
 * - wallet_getSnaps: Returns all installed snaps
 * - wallet_invokeSnap: Invokes a snap's RPC handler
 */
function createSnapProvider(
  getController: (name: string) => unknown,
): SnapProvider {
  return {
    request: async <T>(args: { method: string; params?: unknown }): Promise<T> => {
      // Get the snap controller
      const snapController = getController('SnapController');
      if (!snapController) {
        throw new Error('SnapController not available');
      }

      // For wallet_getSnaps - return all installed snaps from state
      if (args.method === 'wallet_getSnaps') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const controller = snapController as any;

        // Access state.snaps which contains all installed snaps
        const snaps = controller.state?.snaps ?? {};

        // Transform to the expected format: { snapId: { version: string } }
        const result: Record<string, { version: string }> = {};
        for (const [snapId, snap] of Object.entries(snaps)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const snapData = snap as any;
          // Only include enabled, non-blocked snaps
          if (snapData.enabled && !snapData.blocked) {
            result[snapId] = { version: snapData.version };
          }
        }

        return result as T;
      }

      // For wallet_invokeSnap - use handleRequest with proper origin
      if (args.method === 'wallet_invokeSnap') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const params = args.params as any;
        const { snapId, request } = params;

        // Use handleRequest which is the internal API for calling snaps
        // The origin 'metamask' is allowed for keyring methods
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = await (snapController as any).handleRequest({
          snapId,
          origin: 'metamask',
          handler: HandlerType.OnKeyringRequest, // Use keyring handler for keyring methods
          request: {
            jsonrpc: '2.0',
            id: Date.now().toString(),
            method: request.method,
            params: request.params,
          },
        });

        return result as T;
      }

      throw new Error(`Unsupported method: ${args.method}`);
    },
  };
}

// ============================================================================
// SNAP DATA SOURCE INIT
// ============================================================================

/**
 * Initialize the unified SnapDataSource.
 *
 * This single data source handles all snap-based chains:
 * - Solana chains → @metamask/solana-wallet-snap
 * - Bitcoin chains → @metamask/bitcoin-wallet-snap
 * - Tron chains → @metamask/tron-wallet-snap
 *
 * Actions exposed:
 * - SnapDataSource:getActiveChains
 * - SnapDataSource:fetch
 * - SnapDataSource:subscribe
 * - SnapDataSource:unsubscribe
 *
 * Events published:
 * - SnapDataSource:activeChainsChanged
 * - SnapDataSource:assetsUpdated
 */
export const SnapDataSourceInit: ControllerInitFunction<
  SnapDataSource,
  SnapDataSourceMessenger
> = ({ controllerMessenger, persistedState, getController }) => {
  const dataSource = new SnapDataSource({
    messenger: controllerMessenger,
    snapProvider: createSnapProvider(getController),
    configuredNetworks: ALL_DEFAULT_NETWORKS,
    state: persistedState.SnapDataSource,
  });

  return {
    controller: dataSource,
    persistedStateKey: 'SnapDataSource',
    memStateKey: null,
  };
};
