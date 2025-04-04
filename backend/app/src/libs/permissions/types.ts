export type PermissionCondition<T> = (entity: T) => Promise<boolean> | boolean;

export type PermissionConditions<T> = {
  canBeDeleted?: PermissionCondition<T>;
  canBeUpdated?: Partial<Record<keyof T, PermissionCondition<T>>>;
};

export interface Permissions {
  canBeDeleted: boolean;
  canBeUpdated: Record<string, boolean>;
}

export type WithPermissions<T> = T & Permissions;
