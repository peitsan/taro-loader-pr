import { useState } from 'react';
import { View } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import { AccordionForIntermediateProps } from './indexProps';

import styles from './index.module.less';

const AccordionForIntermediate: React.FC<
  AccordionForIntermediateProps
> = selfProps => {
  const { data } = selfProps;
  console.log(data);
  const [active, setActive] = useState<Boolean>(false);

  return (
    <>
      {active && active ? (
        <View className={styles['boardw']}>
          <View className={styles['board-list']}>
            <View
              style={{
                width: '30%',
                textAlign: 'center',
                fontSize: '32rpx',
              }}>
              {data.major}
            </View>
            <View style={{ width: '70%' }} onClick={() => setActive(false)}>
              <View style={{ float: 'right' }}>
                <AtIcon value='chevron-up' size='20' color='#767676'></AtIcon>
              </View>
            </View>
          </View>
          <View className={styles['board-list']}>
            <View className={styles['boardw-subList']} style={{ width: '6%' }}>
              序号
            </View>
            <View className={styles['boardw-subList']} style={{ width: '20%' }}>
              检查内容
            </View>
            <View className={styles['boardw-subList']} style={{ width: '68%' }}>
              检查要点
            </View>
            <View className={styles['boardw-subList']} style={{ width: '6%' }}>
              状态
            </View>
          </View>
          {data.checkList.length !== 0 ? (
            data.checkList.map((list, ids) => {
              return (
                <View
                  className={styles['boardw-list']}
                  key={'reason-row' + ids}>
                  <View
                    className={styles['boardw-subList']}
                    style={{ width: '5%' }}>
                    {ids + 1}
                  </View>
                  <View
                    className={styles['boardw-subList']}
                    style={{ width: '15%' }}>
                    {list.checkText}
                  </View>
                  <View
                    className={styles['boardw-subList']}
                    style={{ width: '75%' }}>
                    {list.checkPoint}
                  </View>
                  <View
                    className={styles['boardw-subList']}
                    style={{ width: '5%' }}>
                    {list.isCheck ? (
                      <View style={{ color: 'rgb(82, 196, 26)' }}>已审核</View>
                    ) : (
                      <View style={{ color: 'rgb(222, 151, 9)' }}>未审核</View>
                    )}
                  </View>
                </View>
              );
            })
          ) : (
            <View className={styles['boardw-list']}>暂无数据</View>
          )}
        </View>
      ) : (
        <View className={styles['board']}>
          <View className={styles['board-list']}>
            <View
              style={{
                fontSize: '32rpx',
                lineHeight: '70rpx',
                width: '30%',
                textAlign: 'center',
              }}>
              {data.major}
            </View>
            <View
              style={{
                fontSize: '32rpx',
                lineHeight: '70rpx',
                width: '70%',
              }}>
              <View style={{ float: 'right' }} onClick={() => setActive(true)}>
                <AtIcon value='chevron-down' size='20' color='#767676'></AtIcon>
              </View>
            </View>
          </View>
        </View>
      )}
    </>
  );
};
export default AccordionForIntermediate;
