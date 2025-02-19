import type React from 'react';
import { useState, useEffect, memo, useCallback } from 'react';
import { Breadcrumb, Tabs } from 'antd';
import type { TabsProps, BreadcrumbProps } from 'antd';
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
  const [activeTabKey, setActiveTabKey] = useState<string>(defaultTabKey);

  useEffect(() => {
    if (!tabsItems) return;
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    const isValidTab = tabParam && tabsItems.some((tab) => tab.key === tabParam);
    if (isValidTab) {
      setActiveTabKey(tabParam);
    } else {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', defaultTabKey);
      window.history.replaceState({}, '', url);
    }
  }, [tabsItems, defaultTabKey]);

  const onChange = useCallback((key: string) => {
    setActiveTabKey(key);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', key);
    window.history.pushState({}, '', url);
  }, []);

  return (
    <>
      <Tabs activeKey={activeTabKey} onChange={onChange} items={tabsItems} />
      <div className={styles.tabContentContainer}>{tabContent[activeTabKey]}</div>
    </>
  );
});

const FocusItem = ({
  breadCrumbData,
  childrenTop,
  tabsItems,
  tabContent,
  bottomRef,
  showBorder = true,
}: FocusItemProps) => {
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
        <div className={styles.bottomChildrenContainer} style={showBorder ? undefined : { border: 0 }} />
      </div>
    </div>
  );
};

export default FocusItem;
