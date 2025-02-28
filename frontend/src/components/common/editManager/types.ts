import type { FormItemProps } from 'antd';
import type { Store, StoreValue } from 'antd/es/form/interface';
import type { FormInstance } from 'antd/lib';
import type { ReactNode } from 'react';

export type EditManagerConfig<T> = {
  key: keyof T;
  label: string;
  rules?: FormItemProps['rules'];
  renderInput: (form: FormInstance<Partial<T>>) => ReactNode;
  normalize?: ((value: StoreValue, prevValue: StoreValue, allValues: Store) => StoreValue) | undefined;
  getValueProps?: ((value: StoreValue) => Record<string, unknown>) | undefined;
};

export type EditManagerProps<T> = {
  data: T | null;
  disabled?: boolean;
  configs: EditManagerConfig<T>[];
  editEndpoint: string;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
};
