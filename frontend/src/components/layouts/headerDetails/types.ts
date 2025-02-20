import type { IconName } from '@icons/index';
import type { FormItemProps } from 'antd';
import type React from 'react';

export type FieldConfig<T> = {
  key: keyof T;
  label: string;
  render: (data: T) => React.ReactNode;
  editConfig?: {
    rules?: FormItemProps['rules'];
    renderInput: () => React.ReactNode;
  };
};

export type HeaderDetailsLayoutProps<T> = {
  title: string;
  icon: IconName;
  data: T | null;
  fields: FieldConfig<T>[];
  editEndpoint: string;
  extraButtons: React.ReactNode[];
  onBack: () => void;
  onDelete?: () => void;
  onEdit?: (data: T) => void;
};
