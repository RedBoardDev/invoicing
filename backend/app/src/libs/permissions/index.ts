import type { PermissionConditions, Permissions } from './types';

export async function computePermissions<T>(entity: T, conditions: PermissionConditions<T>): Promise<Permissions> {
  if (!entity) {
    throw new Error('Entity cannot be null or undefined');
  }

  const canBeDeleted = conditions.canBeDeleted
    ? typeof conditions.canBeDeleted === 'function'
      ? await conditions.canBeDeleted(entity)
      : conditions.canBeDeleted
    : true;

  const canBeUpdated: Record<string, boolean> = {};
  if (conditions.canBeUpdated) {
    for (const [field, condition] of Object.entries(conditions.canBeUpdated)) {
      canBeUpdated[field] = typeof condition === 'function' ? await condition(entity) : condition;
    }
  }

  return { canBeDeleted, canBeUpdated };
}
