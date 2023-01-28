import React from 'react';
import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtTag } from 'taro-ui';
import styles from './index.module.less';
import { ProjectLists } from './components/projectLists';

const ThreeListAudit = () => {
  return (
    <>
      <View className={styles.top}>
        <AtTag className={styles.tag} circle>
          清单审核
        </AtTag>
      </View>
      <ProjectLists />
    </>
  );
};

export default ThreeListAudit;
