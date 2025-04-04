import type { IconName } from '@icons/index';
import type { EditManagerConfig } from 'components/common/editManager/types';
import type React from 'react';
import type { ReactNode } from 'react';
import type { Result, ApiResponse } from '@api/types/fetch';

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
  id: string;
  fields: FieldConfig<T>[];
  updateService: (id: string, data: Partial<T>) => Promise<Result<ApiResponse<T>>>;
  extraButtons?: React.ReactNode[];
  onBack: () => void;
  onDelete: () => void;
  onEdit: (updatedData: T) => void;
  canBeDeleted?: boolean;
  canBeUpdated?: boolean;
}
