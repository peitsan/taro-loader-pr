import React, { FC } from 'react';
import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import styles from './index.module.less';
import IType from './type';

export const AuditItem: FC<IType> = (props: IType) => {
  const { auditNum, type } = props;
  const title =
    type === 'question'
      ? '问题完成时间调整上报审批'
      : '项目节点预计完成时间上报审批';
  const nav = () => {
    type === 'question' &&
      Taro.navigateTo({
        url: '/pages/home/projectManage/applyAudit/questionTable/index',
      });
    type === 'node' &&
      Taro.navigateTo({
        url: '/pages/home/projectManage/applyAudit/nodeTable/index',
      });
  };
  return (
    <>
      <View className={styles.box}>
        <View className={styles.title}>{title}</View>
        <View className={styles.line}></View>
        <View className={styles.content_div}>
          <View className={styles.content_font}>待审批:</View>
          <View className={`${styles.num} ${auditNum !== 0 && styles.noZero}`}>
            {auditNum}
          </View>
        </View>
        <View className={styles.btn} onClick={nav}>
          进入
        </View>
      </View>
    </>
  );
};
