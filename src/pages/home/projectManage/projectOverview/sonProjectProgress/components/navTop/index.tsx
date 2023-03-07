import React, { FC } from 'react';
import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtTag } from 'taro-ui';
import styles from './index.module.less';

interface INavTop {
  fatherProName: string;
  proName: string;
  permission: string;
  setIsOpenOperateModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const NavTop: FC<INavTop> = (props: INavTop) => {
  const { fatherProName, proName, permission, setIsOpenOperateModal } = props;
  return (
    <>
      <View className={styles['name-div']}>
        <AtTag className={styles['tag']} circle>
          项目详情
        </AtTag>
        <View className={styles.name}>
          {fatherProName}/{proName}
        </View>
        {permission === 'manager' && (
          <View
            className={styles.operate}
            onClick={() => {
              setIsOpenOperateModal(true);
            }}>
            相关操作
          </View>
        )}
      </View>
    </>
  );
};
