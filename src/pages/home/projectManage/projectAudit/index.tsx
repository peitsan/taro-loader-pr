import Taro from '@tarojs/taro';
import React from 'react';
import { View } from '@tarojs/components';
import { AtTag } from 'taro-ui';
import { ProjectLists } from './components';
import styles from './index.module.less';

const ProjectAudit = () => {
  const permission = Taro.getStorageSync('permission');
  return (
    <>
      {permission === 'manager' ? (
        <>
          <View className={styles.top}>
            <AtTag className={styles.tag} circle>
              工程审核
            </AtTag>
          </View>
          <ProjectLists />
        </>
      ) : (
        <View style={{ margin: '50px auto', textAlign: 'center' }}>
          该模块只对管理员开放
        </View>
      )}
    </>
  );
};

export default ProjectAudit;
