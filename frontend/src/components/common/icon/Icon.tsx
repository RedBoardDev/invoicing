import { type IconName, icons } from '@icons/index';
import type React from 'react';

type IconProps = {
  name: IconName;
  size?: number | string;
  color?: string;
  className?: string;
};

export const Icon: React.FC<IconProps> = ({ name, size = 24, color = 'currentColor', className }) => {
  if (!icons[name]) {
    console.warn(`Icon "${name}" not found, using fallback.`);
    return <span style={{ width: size, height: size, background: '#ccc' }} />;
  }

  const IconComponent = icons[name];

  return (
    <IconComponent
      width={size}
      height={size}
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    />
  );
};

export type IconComponent = React.ComponentType<IconProps>;
