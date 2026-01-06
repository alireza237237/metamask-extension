import type { SnapDataSourceMessenger as CoreSnapDataSourceMessenger } from '@metamask/assets-controllers';
import { Messenger } from '@metamask/messenger';
import { RootMessenger } from '../../../lib/messenger';

export type SnapDataSourceMessenger = CoreSnapDataSourceMessenger;

/**
 * Get a restricted messenger for the unified SnapDataSource.
 *
 * SnapDataSource handles all snap-based chains (Solana, Bitcoin, Tron)
 * and routes requests to the appropriate snap.
 *
 * @param messenger - The root controller messenger.
 * @returns The restricted messenger for SnapDataSource.
 */
export function getSnapDataSourceMessenger(
  messenger: RootMessenger<never, never>,
): CoreSnapDataSourceMessenger {
  const dataSourceMessenger = new Messenger<
    'SnapDataSource',
    never,
    never,
    typeof messenger
  >({
    namespace: 'SnapDataSource',
    parent: messenger,
  });

  return dataSourceMessenger as unknown as CoreSnapDataSourceMessenger;
}
