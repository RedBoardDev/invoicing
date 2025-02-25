import type React from 'react';
import FocusItem from 'components/layouts/focusItem/FocusItem';
import type { TabsProps } from 'antd';
import { Icon } from 'components/common';
import EmailTemplatesTab from '@views/settings/tabs/EmailTemplatesTab';

const items: TabsProps['items'] = [
  {
    key: 'emailTemplates',
    label: (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Icon name="contract" size={15} color="var(--color-primary)" />
        Modèles d'Email
      </div>
    ),
  },
];

const Settings: React.FC = () => {
  const tabContent = {
    emailTemplates: <EmailTemplatesTab />,
  };

  return (
    <FocusItem
      childrenTop={<h1 style={{ margin: '16px 24px', fontSize: 24, color: 'var(--color-primary)' }}>Paramètres</h1>}
      tabsItems={items}
      tabContent={tabContent}
    />
  );
};

export default Settings;
