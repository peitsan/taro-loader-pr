/* eslint-disable react/jsx-key */
import Taro from '@tarojs/taro';
import { useState } from 'react';
import { View } from '@tarojs/components';
import {
  AtIcon,
  AtButton,
  AtModal,
  AtTextarea,
  AtModalContent,
  AtModalAction,
  AtMessage,
} from 'taro-ui';
import { Item, AccordionProps } from './indexProps';
import { canCheckOtherReply, message } from '../../functions/index';
import httpUtil from '../../../utils/httpUtil';

import styles from './index.module.less';

const Accordion: React.FC<AccordionProps> = selfProps => {
  const { data, index, setIsCheckModal, setIsManageModal } = selfProps;
  const [active, setActive] = useState<Boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [reasonId, setReasonId] = useState<number>(0);
  const [isAdjustTime, setIsAdjustTime] = useState<boolean>(false);
  const [planTime, setPlanTime] = useState<string>('');
  // const [isCheckModal, setIsCheckModal] = useState<boolean>(false);
  const [attachmentUrl, setAttachmentUrl] = useState<string>('');
  const [replyText, setReplyText] = useState<string>('空');
  const ModalName = Taro.getStorageSync('ModalName');
  const itemName = ['reason', 'opinion', 'condition', 'question'];
  const { item } = data;
  let len: number = 0;
  for (let i = 0; i < item.length; i++) {
    const { manageId, code } = item[i];
    const { id } = JSON.parse(Taro.getStorageSync('user')!);
    if (manageId.includes(id) && code === 1) {
      len++;
    }
  }

  const showModal = (record: Item) => {
    setIsModalVisible(true);
    setReasonId(Number(record.key));
  };
  const showApplyModal = (record: Item) => {
    setIsAdjustTime(true);
    setPlanTime(record.planTime);
    setReasonId(Number(record.key));
  };
  const lookReply = (question_id: string) => {
    message('请稍等', 'warning');
    httpUtil
      .lookAllListReply({
        project_id: Taro.getStorageSync('projectId')!,
        question_id: question_id,
        itemName: itemName[index - 1],
      })
      .then(res => {
        const {
          data: {
            reply: { text, attachment },
          },
        } = res;
        setReplyText(text);
        setAttachmentUrl(attachment);
      });
  };
  const showCheckModal = (record: Item) => {
    lookReply(String(record.key));
    setIsCheckModal(true);
  };
  const showManageSelector = async (record: Item) => {
    setIsManageModal(true);
  };
  const GetOperationForUnite: React.FC<any> = props => {
    const { records } = props;
    const { manageId, code } = records;
    const { id } = JSON.parse(Taro.getStorageSync('user')!);
    return code === 0 ? ( //判断是否有权限
      ModalName === 'projectOverview' ? ( //判断流程是否在工程总览阶段
        // 工程总览有权限回复清单的经理
        <>
          {/* <View
            className={styles['pass-btn ']}
            onClick={() => showModal(records)}>
            回复
          </View> */}
          <View>无</View>
        </>
      ) : (
        // 工程审核有权限回复清单的经理
        <>
          <AtButton
            className={styles['pass-btn']}
            onClick={() => showManageSelector(records)}>
            <View>指定</View>
            <View>负责人</View>
          </AtButton>
        </>
      )
    ) : ((code === 2 || code === 3) && manageId.includes(id)) ||
      (code === 3 &&
        canCheckOtherReply(Number(Taro.getStorageSync('fatherId')))) ? (
      <AtButton
        size='small'
        type='primary'
        onClick={() => showCheckModal(records)}>
        查看回复
      </AtButton>
    ) : (
      <View>无</View>
    );
  };
  const GetOperationForList: React.FC<any> = props => {
    const { records } = props;
    // console.log('List', records);
    const { manageId, code } = records;
    const { id } = JSON.parse(Taro.getStorageSync('user')!);
    return code === 1 && //流程在待回复(负责人已指定)
      manageId.includes(id) ? ( //判断是否有权限
      ModalName === 'projectOverview' ? ( //判断流程是否在工程总览阶段
        // 工程总览有权限回复清单的经理
        <>
          <View
            className={styles['pass-btn']}
            onClick={() => showModal(records)}>
            回复
          </View>

          <View
            className={styles['pass-btn']}
            onClick={() => showApplyModal(records)}>
            调整时间
          </View>
        </>
      ) : (
        // 工程审核有权限回复清单的经理
        <>
          <View
            className={styles['look-btn']}
            onClick={() => showModal(records)}>
            查看
          </View>
          <View
            className={styles['pass-btn']}
            onClick={() => showApplyModal(records)}>
            通过
          </View>
          <View
            className={styles['back-btn']}
            onClick={() => showApplyModal(records)}>
            驳回
          </View>
          <View
            className={styles['cofirm-btn']}
            onClick={() => showApplyModal(records)}>
            上报
          </View>{' '}
        </>
      )
    ) : ((code === 2 || code === 3) && manageId.includes(id)) ||
      (code === 3 &&
        canCheckOtherReply(Number(Taro.getStorageSync('fatherId')))) ? (
      <AtButton
        size='small'
        type='primary'
        onClick={() => showCheckModal(records)}>
        查看回复
      </AtButton>
    ) : (
      <View>无</View>
    );
  };
  const statusList = ['被驳回', '待审批', '通过'];
  const statusColor = ['reply', 'approval', 'solve'];
  return (
    <>
      {active && active ? (
        <View className={styles['boardw']}>
          {index === 4 ? (
            <View className={styles['board-list']}>
              <View
                style={{
                  width: '30%',
                  textAlign: 'center',
                  fontSize: '32rpx',
                  lineHeight: '50rpx',
                }}>
                {data.issueOverView}
              </View>
              <View
                style={{
                  fontSize: '32rpx',
                  lineHeight: '50rpx',
                  width: '35%',
                  textAlign: 'center',
                  color: '#52c41a',
                }}>
                {data.len}
              </View>
              <View style={{ width: '35%' }} onClick={() => setActive(false)}>
                <View style={{ float: 'right' }}>
                  <AtIcon value='chevron-up' size='20' color='#767676'></AtIcon>
                </View>
              </View>
            </View>
          ) : (
            <View className={styles['board-list']}>
              <View
                style={{
                  fontSize: '32rpx',
                  lineHeight: '70rpx',
                  width: '25%',
                  textAlign: 'center',
                }}>
                {data.issueOverView}
              </View>
              <View
                style={{
                  fontSize: '32rpx',
                  width: '25%',
                  textAlign: 'center',
                  color: '#ff4500',
                }}>
                {data.progress.name}
              </View>
              <View
                style={{
                  fontSize: '32rpx',
                  lineHeight: '70rpx',
                  width: '25%',
                  textAlign: 'center',
                  color: '#52c41a',
                }}>
                {len}
              </View>
              <View
                style={{
                  fontSize: '32rpx',
                  lineHeight: '70rpx',
                  width: '20%',
                  textAlign: 'center',
                }}
                className={styles[statusColor[data.status + 1]]}>
                {statusList[Number(data.status) + 1]}
              </View>
              <View style={{ width: '5%' }} onClick={() => setActive(false)}>
                <View style={{ float: 'right' }}>
                  <AtIcon value='chevron-up' size='20' color='#767676'></AtIcon>
                </View>
              </View>
            </View>
          )}
          {/* <CheckModal /> */}
          {/* 子列表 */}
          <View className={styles['board-list']}>
            <View className={styles['board-subList']} style={{ width: '20%' }}>
              {index == 4 ? '单项' : '原因'}
            </View>
            <View className={styles['board-subList']} style={{ width: '25%' }}>
              {index == 4 ? '截止时间' : '计划完成时间'}
            </View>
            <View className={styles['board-subList']} style={{ width: '25%' }}>
              {index == 4 ? '负责人及单位' : '责任人及责任单位'}
            </View>
            <View className={styles['board-subList']} style={{ width: '15%' }}>
              {index == 4 ? '状态' : '当前整改情况'}
            </View>
            <View className={styles['board-subList']} style={{ width: '10%' }}>
              操作
            </View>
          </View>
          {item.length !== 0 ? (
            item.map((list, id) => {
              return (
                <View className={styles['boardw-list']} key={'reason-row' + id}>
                  <View
                    className={styles['boardw-subList']}
                    style={{ width: '20%' }}>
                    {list.reason}
                  </View>
                  <View
                    className={styles['boardw-subList']}
                    style={{ width: '25%' }}>
                    {list.planTime}
                  </View>
                  <View
                    className={styles['boardw-subList']}
                    style={{ width: '25%' }}>
                    {list.manage.length && list.manage.length !== 0
                      ? list.manage.map(manage => {
                          return (
                            <View
                              className={styles['boardw-subList']}
                              style={{ width: '20%' }}>
                              {manage.unit.name + '-' + manage.nickname}
                            </View>
                          );
                        })
                      : '暂未指定'}
                  </View>
                  <View
                    className={styles['boardw-subList']}
                    style={{ width: '10%' }}>
                    {list.current}
                  </View>
                  <View
                    className={styles['boardw-subList']}
                    style={{ width: '20%' }}>
                    {index == 4 ? (
                      <GetOperationForUnite records={list} />
                    ) : (
                      <GetOperationForList records={list} />
                    )}
                  </View>
                </View>
              );
            })
          ) : (
            <View className={styles['board-list']}>
              <View
                style={{
                  textAlign: 'center',
                  padding: '0 40%',
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
          {index === 4 ? (
            <View className={styles['board-list']}>
              <View
                style={{
                  fontSize: '32rpx',
                  lineHeight: '50rpx',
                  width: '30%',
                  textAlign: 'center',
                }}>
                {data.issueOverView}
              </View>
              <View
                style={{
                  fontSize: '32rpx',
                  lineHeight: '50rpx',
                  width: '35%',
                  textAlign: 'center',
                  color: '#52c41a',
                }}>
                {data.len}
              </View>
              <View
                style={{
                  fontSize: '32rpx',
                  lineHeight: '70rpx',
                  width: '35%',
                }}>
                <View
                  style={{ float: 'right' }}
                  onClick={() => setActive(true)}>
                  <AtIcon
                    value='chevron-down'
                    size='20'
                    color='#767676'></AtIcon>
                </View>
              </View>
            </View>
          ) : (
            <View className={styles['board-list']}>
              <View
                style={{
                  fontSize: '32rpx',
                  lineHeight: '70rpx',
                  width: '25%',
                  textAlign: 'center',
                }}>
                {data.issueOverView}
              </View>
              <View
                style={{
                  fontSize: '32rpx',
                  width: '25%',
                  textAlign: 'center',
                  color: '#ff4500',
                }}>
                {data.progress.name}
              </View>
              <View
                style={{
                  fontSize: '32rpx',
                  lineHeight: '70rpx',
                  width: '25%',
                  textAlign: 'center',
                  color: '#52c41a',
                }}>
                {len}
              </View>
              <View
                style={{
                  fontSize: '32rpx',
                  lineHeight: '70rpx',
                  width: '20%',
                  textAlign: 'center',
                }}
                className={styles[statusColor[data.status + 1]]}>
                {statusList[Number(data.status) + 1]}
              </View>
              <View style={{ width: '5%' }} onClick={() => setActive(true)}>
                <View style={{ float: 'right' }}>
                  <AtIcon
                    value='chevron-down'
                    size='20'
                    color='#767676'></AtIcon>
                </View>
              </View>
            </View>
          )}
          <AtMessage />
        </View>
      )}
    </>
  );
};
export default Accordion;
