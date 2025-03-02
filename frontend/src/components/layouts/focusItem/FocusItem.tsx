// frontend/src/components/layouts/focusItem/FocusItem.tsx
import type React from 'react';
import { memo, useCallback, useEffect, useState } from 'react';
import { Breadcrumb, Tabs } from 'antd';
import type { BreadcrumbProps, TabsProps } from 'antd';
import styles from './FocusItem.module.css';

interface FocusItemProps {
  breadCrumbData?: BreadcrumbProps['items'];
  childrenTop: React.ReactNode;
  tabsItems: TabsProps['items'];
  tabContent: Record<string, React.ReactNode>;
  bottomRef?: React.RefObject<HTMLDivElement>;
  showBorder?: boolean;
}

interface TabsWithUrlProps {
  tabsItems: TabsProps['items'];
  tabContent: Record<string, React.ReactNode>;
  defaultTabKey: string;
}

const TabsWithUrl = memo(({ tabsItems, tabContent, defaultTabKey }: TabsWithUrlProps) => {
  const [activeTabKey, setActiveTabKey] = useState(defaultTabKey);

  useEffect(() => {
    if (!tabsItems) return;
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    const isValidTab = tabParam && tabsItems.some((tab) => tab.key === tabParam);
    setActiveTabKey(isValidTab ? tabParam : defaultTabKey);
  }, [tabsItems, defaultTabKey]);

  const onChange = useCallback((key: string) => {
    setActiveTabKey(key);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', key);
    window.history.pushState({}, '', url);
  }, []);

  return (
    <Tabs
      activeKey={activeTabKey}
      onChange={onChange}
      items={tabsItems}
      className={styles.tabs}
      tabBarStyle={{ marginBottom: 0 }}
    />
  );
});

const FocusItem: React.FC<FocusItemProps> = ({
  breadCrumbData,
  childrenTop,
  tabsItems,
  tabContent,
  bottomRef,
  showBorder = true,
}) => {
  const defaultTabKey = tabsItems?.[0]?.key?.toString() || 'default';

  return (
    <div className={styles.focusItemPage}>
      {breadCrumbData && (
        <div className={styles.headerNavigation}>
          <Breadcrumb items={breadCrumbData} />
        </div>
      )}
      <div className={styles.topPartContainer}>{childrenTop}</div>
      <div className={styles.tabsContainer} ref={bottomRef}>
        <TabsWithUrl tabsItems={tabsItems} tabContent={tabContent} defaultTabKey={defaultTabKey} />
      </div>
      <div className={breadCrumbData ? styles.bottomPartContainerBreadcrumb : styles.bottomPartContainer}>
        <div className={styles.bottomChildrenContainer} style={showBorder ? undefined : { border: 0 }}>
          {tabContent[tabsItems?.find((item) => item.key === defaultTabKey)?.key || defaultTabKey]}
        </div>
      </div>
    </div>
  );
};

export default FocusItem;
