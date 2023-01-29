import React from 'react';
import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtTag } from 'taro-ui';
import styles from './index.module.less';
import { ProjectLists } from './components/projectLists';

const ThreeListAudit = () => {
  const permission = Taro.getStorageSync('permission');
  return (
    <>
      {permission === 'manager' ? (
        <>
          <View className={styles.top}>
            <AtTag className={styles.tag} circle>
              清单审核
            </AtTag>
          </View>
          <ProjectLists />
        </>
      ) : (
        <View style={{ margin: '50px auto', textAlign: 'center' }}>
          该模块只对项目经理开放
        </View>
      )}
    </>
  );
};

export default ThreeListAudit;
