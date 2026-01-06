import { RpcDataSource } from '@metamask/assets-controllers';
import { ControllerInitFunction } from '../types';
import { RpcDataSourceMessenger } from '../messengers/assets';

/**
 * Initialize the RpcDataSource.
 *
 * RpcDataSource provides balance data by directly querying the blockchain via RPC.
 * It automatically syncs with NetworkController to get available chains and their
 * status. This serves as a fallback when API-based data sources are unavailable.
 *
 * Chains are derived from NetworkController:
 * - networkConfigurationsByChainId provides the list of configured networks
 * - networksMetadata provides the status of each network (available/degraded/etc.)
 * - Only networks with 'available' or 'unknown' status are considered active
 *
 * Providers are obtained via Messenger:
 * - Uses NetworkController:getNetworkClientById to get the network client
 * - Wraps the network client's provider in a Web3Provider
 * - Providers are cached per chain for efficiency
 *
 * Actions exposed:
 * - RpcDataSource:getActiveChains
 * - RpcDataSource:fetch
 * - RpcDataSource:subscribe
 * - RpcDataSource:unsubscribe
 *
 * Events published:
 * - RpcDataSource:activeChainsChanged
 * - RpcDataSource:assetsUpdated
 */
export const RpcDataSourceInit: ControllerInitFunction<
  RpcDataSource,
  RpcDataSourceMessenger
> = ({ controllerMessenger, persistedState }) => {
  const dataSource = new RpcDataSource({
    messenger: controllerMessenger,
    state: persistedState.RpcDataSource,
  });

  return {
    controller: dataSource,
    persistedStateKey: 'RpcDataSource',
    memStateKey: null,
  };
};

