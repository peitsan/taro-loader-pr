import React, { useState, useEffect } from 'react';
import { View } from '@tarojs/components';
import { useDispatch, useSelector } from '@/redux/hooks';
import { getApplyListAC } from '@/redux/actionCreators';
import { AtTag, AtTabs, AtTabsPane } from 'taro-ui';
import styles from './index.module.less';
import { AuditItem } from './components/auditItem';

const ApplyAudit: React.FC = () => {
  const [cur, setCur] = useState(0);
  const dispatch = useDispatch();
  const questionApprovals = useSelector(
    state => state.applyAudit.questionApprovals,
  );
  const projectApprovals = useSelector(
    state => state.applyAudit.projectApprovals,
  );
  useEffect(() => {
    // 首次加载因为初始值为0，通过loading减少用户等待焦虑
    if (questionApprovals.length === 0 || projectApprovals.length === 0) {
      dispatch(getApplyListAC(true));
    } else {
      dispatch(getApplyListAC(false));
    }
  }, []);
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
          <AuditItem auditNum={questionApprovals.length} type='question' />
        </AtTabsPane>
        <AtTabsPane current={cur} index={1}>
          <AuditItem auditNum={projectApprovals.length} type='node' />
        </AtTabsPane>
      </AtTabs>
    </>
  );
};
export default ApplyAudit;
