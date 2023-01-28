import Taro from '@tarojs/taro';
import React from 'react';
import { View } from '@tarojs/components';
import { AtTag } from 'taro-ui';
import { ProjectLists } from './components';
import styles from './index.module.less';

const ProjectAudit = () => {
  return (
    <>
      <View className={styles.top}>
        <AtTag className={styles.tag} circle>
          工程审核
        </AtTag>
      </View>
      <ProjectLists />
    </>
  );
};

export default ProjectAudit;
