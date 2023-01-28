import React, { FC } from 'react';
import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtFloatLayout } from 'taro-ui';
import IShowMore from './type';
import styles from './index.module.less';

export const ShowMoreInfo: FC<IShowMore> = (props: IShowMore) => {
  const { isOpen, setIsOpen, moreData } = props;
  return (
    <AtFloatLayout
      isOpened={isOpen}
      onClose={() => {
        setIsOpen(false);
      }}>
      {'manager' in moreData ? (
        <>
          <View className={styles.moreInfoStyle}>
            项目经理: {moreData.manager}
          </View>
          <View className={styles.moreInfoStyle}>
            项目规模：{moreData.scope ? '规模以下' : '规模以上'}
          </View>
        </>
      ) : (
        <>
          <View className={styles.moreInfoStyle}>
            初步设计启动时间：{moreData.startTime}
          </View>
          <View className={styles.moreInfoStyle}>
            项目规模：{moreData.scope}
          </View>
          {/* @ts-ignore */}
          <View className={styles.moreInfoStyle}>
            项目进度：{moreData.progressNow}
          </View>
          <View></View>
        </>
      )}
    </AtFloatLayout>
  );
};
