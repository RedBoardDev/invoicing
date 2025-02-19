import type { FormItemProps } from 'antd';
import type React from 'react';

export type EditManagerConfig<T> = {
  key: keyof T;
  label: string;
  rules?: FormItemProps['rules'];
  renderInput: () => React.ReactNode;
};

export type EditManagerProps<T> = {
  data: T | null;
  configs: EditManagerConfig<T>[];
  editEndpoint: string;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
};
