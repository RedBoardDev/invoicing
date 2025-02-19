import PlusIcon from './plus.svg?react';
import ContractIcon from './contract.svg?react';

export const icons = {
  plus: PlusIcon,
  contract: ContractIcon,
};

export type IconName = keyof typeof icons;
