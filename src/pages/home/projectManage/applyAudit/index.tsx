import React, { useState } from 'react';
import { View } from '@tarojs/components';
import { AtTag, AtTabs, AtTabsPane } from 'taro-ui';
import styles from './index.module.less';
import { AuditItem } from './components/auditItem';

const ApplyAudit: React.FC = () => {
  const [cur, setCur] = useState(0);
  const tablist = [
    { title: '问题完成时间调整' },
    { title: '节点预计完成时间调整' },
  ];
  return (
    <>
      <View className={styles.top}>
        <AtTag className={styles.tag} circle>
          上报审批
        </AtTag>
      </View>
      <AtTabs
        current={cur}
        tabList={tablist}
        onClick={e => {
          setCur(e);
        }}>
        <AtTabsPane current={cur} index={0}>
          <AuditItem auditNum={0} type='question' />
        </AtTabsPane>
        <AtTabsPane current={cur} index={1}>
          <AuditItem auditNum={0} type='node' />
        </AtTabsPane>
      </AtTabs>
    </>
  );
};
export default ApplyAudit;
