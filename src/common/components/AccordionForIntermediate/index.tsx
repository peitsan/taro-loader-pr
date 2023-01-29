import Taro from '@tarojs/taro';
import { message } from '@/common/functions';
import httpUtil from '@/utils/httpUtil';
import { useState } from 'react';
import { View } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import { AccordionForIntermediateProps } from './indexProps';

import styles from './index.module.less';

const AccordionForIntermediate: React.FC<
  AccordionForIntermediateProps
> = selfProps => {
  const { data, getMediateList } = selfProps;
  const [active, setActive] = useState<Boolean>(false);
  const ModalName = Taro.getStorageSync('ModalName');
  const projectId = Taro.getStorageSync('projectId');
  const progressId = Taro.getStorageSync('progressId');
  const handleCheckOrUncheck = async (sheetId: number, isCheck: number) => {
    message('请求中', 'warning');
    const res = await httpUtil.managerCheckMidContent({
      projectId: Number(projectId),
      progressId: Number(progressId),
      sheetIds: [sheetId],
      isCheck: isCheck === 0 ? 1 : 0,
    });
    getMediateList();
  };
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
            {ModalName == 'projectAudit' ? (
              <>
                <View
                  className={styles['boardw-subList']}
                  style={{ width: '60%' }}>
                  检查要点
                </View>
                <View
                  className={styles['boardw-subList']}
                  style={{ width: '6%' }}>
                  状态
                </View>
                <View
                  className={styles['boardw-subList']}
                  style={{ width: '8%' }}>
                  操作
                </View>
              </>
            ) : (
              <>
                <View
                  className={styles['boardw-subList']}
                  style={{ width: '68%' }}>
                  检查要点
                </View>
                <View
                  className={styles['boardw-subList']}
                  style={{ width: '6%' }}>
                  状态
                </View>
              </>
            )}
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
                  {ModalName == 'projectAudit' ? (
                    <>
                      <View
                        className={styles['boardw-subList']}
                        style={{ width: '67%' }}>
                        {list.checkPoint}
                      </View>
                      <View
                        className={styles['boardw-subList']}
                        style={{ width: '6%' }}>
                        {list.isCheck ? (
                          <View style={{ color: 'rgb(82, 196, 26)' }}>
                            已检查
                          </View>
                        ) : (
                          <View style={{ color: 'rgb(222, 151, 9)' }}>
                            未检查
                          </View>
                        )}
                      </View>
                      <View
                        className={styles['boardw-subList']}
                        style={{ width: '8%' }}>
                        {list.isCheck ? (
                          <View
                            className={styles['back-btn']}
                            onClick={handleCheckOrUncheck.bind(
                              null,
                              list.id,
                              list.isCheck,
                            )}>
                            取消
                            <AtIcon
                              value='reload'
                              size='18'
                              color='#fff'></AtIcon>
                          </View>
                        ) : (
                          <View
                            className={styles['pass-btn']}
                            onClick={handleCheckOrUncheck.bind(
                              null,
                              list.id,
                              list.isCheck,
                            )}>
                            {' '}
                            检查
                            <AtIcon
                              value='check'
                              size='18'
                              color='#fff'></AtIcon>
                          </View>
                        )}
                      </View>
                    </>
                  ) : (
                    <>
                      <View
                        className={styles['boardw-subList']}
                        style={{ width: '75%' }}>
                        {list.checkPoint}
                      </View>
                      <View
                        className={styles['boardw-subList']}
                        style={{ width: '5%' }}>
                        {list.isCheck ? (
                          <View style={{ color: 'rgb(82, 196, 26)' }}>
                            已审核
                          </View>
                        ) : (
                          <View style={{ color: 'rgb(222, 151, 9)' }}>
                            未审核
                          </View>
                        )}
                      </View>
                    </>
                  )}
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
