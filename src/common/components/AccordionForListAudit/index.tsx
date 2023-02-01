import Taro from '@tarojs/taro';
import { message } from '@/common/functions';
import httpUtil from '@/utils/httpUtil';
import { useState } from 'react';
import { View } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import { AccordionForListAuditProps } from './indexProps';

import styles from './index.module.less';

const AccordionForListAudit: React.FC<
  AccordionForListAuditProps
> = selfProps => {
  const {
    data,
    getMediateList,
    index,
    setSelectRecord,
    setIsRejectModal,
    setIsAssignResponsibilities,
  } = selfProps;
  const [active, setActive] = useState<Boolean>(false);
  const projectId = Taro.getStorageSync('projectId');
  const progressId = Taro.getStorageSync('progressId');
  const SorterTitle = ['原因', '意见', '条件'];
  const RenderOperation: React.FC<{ records: any }> = Iprops => {
    const { records } = Iprops;
    const showPassModal = records => {
      setSelectRecord(records);
      setIsAssignResponsibilities(true);
    };
    const showRejetConfirm = records => {
      setSelectRecord(records);
      setIsRejectModal(true);
    };
    return (
      <>
        <View
          className={styles['pass-btn']}
          onClick={() => showPassModal(records)}>
          通过
        </View>
        <View
          className={styles['back-btn']}
          onClick={() => showRejetConfirm(records)}>
          驳回
        </View>
      </>
    );
  };
  return (
    <>
      {active && active ? (
        <View className={styles['boardw']}>
          <View className={styles['board-list']}>
            <View
              style={{
                width: '20%',
                textAlign: 'center',
                fontSize: '32rpx',
              }}>
              {data.name}
            </View>
            <View
              style={{
                width: '50%',
                textAlign: 'center',
                fontSize: '32rpx',
              }}>
              {data?.progress?.name}
            </View>
            <View
              style={{
                width: '20%',
                textAlign: 'center',
                fontSize: '32rpx',
              }}>
              <RenderOperation records={data} />
            </View>
            <View style={{ width: '10%' }} onClick={() => setActive(false)}>
              <View style={{ float: 'right' }}>
                <AtIcon value='chevron-up' size='20' color='#767676'></AtIcon>
              </View>
            </View>
          </View>
          <View className={styles['board-list']}>
            <View className={styles['boardw-subList']} style={{ width: '20%' }}>
              序号
            </View>
            <View className={styles['boardw-subList']} style={{ width: '80%' }}>
              内容
            </View>
          </View>
          {data.reasons.length !== 0 ? (
            data.reasons.map((list, ids) => {
              return (
                <View
                  className={styles['boardw-list']}
                  key={'reason-row' + ids}>
                  <View
                    className={styles['boardw-subList']}
                    style={{ width: '20%' }}>
                    {SorterTitle[index - 1] + (ids + 1)}
                  </View>
                  <View
                    className={styles['boardw-subList']}
                    style={{ width: '80%' }}>
                    {list.reason}
                  </View>
                </View>
              );
            })
          ) : (
            <View className={styles['boardw-list']}>
              <View
                style={{
                  textAlign: 'center',
                  lineHeight: '30rpx',
                  fontSize: '30rpx',
                  color: '#9A9A9A',
                }}>
                暂无数据
              </View>
            </View>
          )}
        </View>
      ) : (
        <View className={styles['board']}>
          <View className={styles['board-list']}>
            <View
              style={{
                width: '20%',
                textAlign: 'center',
                fontSize: '32rpx',
              }}>
              {data.name}
            </View>
            <View
              style={{
                width: '50%',
                textAlign: 'center',
                fontSize: '32rpx',
              }}>
              {data?.progress?.name}
            </View>
            <View
              style={{
                width: '20%',
                textAlign: 'center',
                fontSize: '32rpx',
              }}>
              <RenderOperation records={data} />
            </View>
            <View
              style={{
                fontSize: '32rpx',
                lineHeight: '70rpx',
                width: '10%',
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
export default AccordionForListAudit;
