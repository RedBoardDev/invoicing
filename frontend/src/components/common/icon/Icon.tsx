import type React from 'react';
import { icons, type IconName } from '@icons/index';

type IconProps = {
  name: IconName;
  size?: number | string;
  color?: string;
  className?: string;
};

const Icon: React.FC<IconProps> = ({ name, size = 24, color = 'currentColor', className }) => {
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

export default Icon;
