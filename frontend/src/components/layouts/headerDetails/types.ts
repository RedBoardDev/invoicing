import type { IconName } from '@icons/index';
import type { EditManagerConfig } from 'components/common/editManager/types';
import type React from 'react';
import type { ReactNode } from 'react';

export type FieldConfig<T> = {
  key: keyof T;
  label: string;
  render: (data: T) => ReactNode;
  editConfig?: Omit<EditManagerConfig<T>, 'key' | 'label'>;
};

export interface HeaderDetailsLayoutProps<T> {
  title: string;
  icon: IconName;
  data: T | null;
  fields: FieldConfig<T>[];
  editEndpoint: string;
  extraButtons?: React.ReactNode[];
  onBack: () => void;
  onDelete: () => void;
  onEdit: (updatedData: T) => void;
  canBeDeleted?: boolean;
  canBeUpdated?: boolean;
}
