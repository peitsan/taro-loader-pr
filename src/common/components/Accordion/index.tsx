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
} from 'taro-ui';
import { Item, AccordionProps } from './indexProps';
import { canCheckOtherReply, message } from '../../functions/index';
import httpUtil from '../../../utils/httpUtil';

import styles from './index.module.less';

const Accordion: React.FC<AccordionProps> = selfProps => {
  const { data, index } = selfProps;
  const [active, setActive] = useState<Boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [reasonId, setReasonId] = useState<number>(0);
  const [isAdjustTime, setIsAdjustTime] = useState<boolean>(false);
  const [planTime, setPlanTime] = useState<string>('');
  const [isCheckModal, setIsCheckModal] = useState<boolean>(false);
  const [attachmentUrl, setAttachmentUrl] = useState<string>('');
  const [replyText, setReplyText] = useState<string>('空');
  // const Height = String(85 * (data.item.length + 1)) + `px`;
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
    setIsCheckModal(true);
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
        console.log(isCheckModal);
      });
  };

  const showCheckModal = (record: Item) => {
    lookReply(String(record.key));
    setIsCheckModal(true);
  };
  const okCheckModal = () => {
    setIsCheckModal(false);
  };
  const CheckModal: React.FC = () => {
    const [canDownload, setCanDownload] = useState(false);
    // 文件下载的URL和name
    const [downloadURL, setDownloadURL] = useState('');
    const [downloadName, setDownloadName] = useState('');

    const downloadFile = () => {
      setCanDownload(false);
      const hiding = message('下载中', 'warning');
      httpUtil.downloadFile({ replyFile: attachmentUrl }).then(res => {
        const blob = new Blob([res.blob], {
          type: 'application/octet-stream',
        });
        const URL = window.URL.createObjectURL(blob);
        // const URL = Taro.downloadFile
        const Name = res.fileName;
        setDownloadURL(URL);
        setDownloadName(Name);
        setCanDownload(true);
        hiding();
      });
    };
    return (
      <AtModal
        isOpened={isCheckModal}
        onConfirm={okCheckModal}
        onCancel={okCheckModal}>
        <AtModalContent>
          <View className={styles['reply-wrapper']}>
            <View className={styles['reply-title']}>文字内容：</View>
            <AtTextarea
              className={styles['reply-text-area']}
              disabled
              height={5}
              value={replyText}
              onChange={e => setReplyText(e)}
            />
            <View className={styles['reply-title']}>附件：</View>
            <View className={styles['reply-files']}>
              {attachmentUrl !== '' ? (
                canDownload ? (
                  <a href={downloadURL} download={downloadName}>
                    <AtIcon value='file-generic' size='30' color='#F00' />
                    下载成功，点击查看
                  </a>
                ) : (
                  <a onClick={downloadFile}>
                    <AtIcon value='file-generic' size='30' color='#F00' />
                    下载附件
                  </a>
                )
              ) : (
                <a style={{ color: 'silver' }}>
                  <AtIcon value='file-generic' size='30' color='#F00' />
                  无附件
                </a>
              )}
            </View>
          </View>
        </AtModalContent>
        <AtModalAction>
          {' '}
          <AtButton>取消</AtButton> <AtButton>确定</AtButton>{' '}
        </AtModalAction>
      </AtModal>
    );
  };
  const GetOperation: React.FC<any> = props => {
    const { records } = props;
    const { manageId, code } = records;
    const { id } = JSON.parse(Taro.getStorageSync('user')!);
    return code === 1 && manageId.includes(id) ? (
      <>
        <AtButton
          size='small'
          type='primary'
          onClick={() => showModal(records)}>
          回复
        </AtButton>

        <AtButton
          size='small'
          type='primary'
          onClick={() => showApplyModal(records)}>
          申请调整时间
        </AtButton>
      </>
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
      <AtModal
        isOpened={isCheckModal}
        onConfirm={okCheckModal}
        onClose={okCheckModal}>
        <AtModalContent>
          <View className={styles['reply-wrapper']}>
            <View className={styles['reply-title']}>文字内容：</View>
            <AtTextarea
              className={styles['reply-text-area']}
              disabled
              height={5}
              value={replyText}
              onChange={e => setReplyText(e)}
            />
            <View className={styles['reply-title']}>附件：</View>
            <View className={styles['reply-files']}>
              {/* {attachmentUrl !== '' ? (
                canDownload ? (
                  <a href={downloadURL} download={downloadName}>
                    <AtIcon value='file-generic' size='30' color='#F00' />
                    下载成功，点击查看
                  </a>
                ) : (
                  <a onClick={downloadFile}>
                    <AtIcon value='file-generic' size='30' color='#F00' />
                    下载附件
                  </a>
                )
              ) : (
                <a style={{ color: 'silver' }}>
                  <AtIcon value='file-generic' size='30' color='#F00' />
                  无附件
                </a>
              )} */}
            </View>
          </View>
        </AtModalContent>
        <AtModalAction>
          {' '}
          <AtButton>取消</AtButton> <AtButton>确定</AtButton>{' '}
        </AtModalAction>
      </AtModal>
      {active && active ? (
        <View className={styles['boardw']}>
          {index === 4 ? (
            <View className={styles['boardw-list']}>
              <View
                style={{
                  width: '30%',
                  textAlign: 'center',
                  fontSize: '32rpx',
                }}>
                {data.issueOverView}
              </View>
              <View
                style={{
                  fontSize: '32rpx',
                  lineHeight: '70rpx',
                  width: '35%',
                  textAlign: 'center',
                  color: '#52c41a',
                }}>
                {len}
              </View>
              <View style={{ width: '35%' }} onClick={() => setActive(false)}>
                <View style={{ float: 'right' }}>
                  <AtIcon value='chevron-up' size='20' color='#767676'></AtIcon>
                </View>
              </View>
            </View>
          ) : (
            <View className={styles['boardw-list']}>
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
          <View className={styles['boardw-list']}>
            <View className={styles['boardw-subList']} style={{ width: '20%' }}>
              原因
            </View>
            <View className={styles['boardw-subList']} style={{ width: '25%' }}>
              计划完成时间
            </View>
            <View className={styles['boardw-subList']} style={{ width: '25%' }}>
              责任人及责任单位
            </View>
            <View className={styles['boardw-subList']} style={{ width: '15%' }}>
              当前整改情况
            </View>
            <View className={styles['boardw-subList']} style={{ width: '10%' }}>
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
                    <GetOperation records={list} />
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
          {index === 4 ? (
            <View className={styles['board-list']}>
              <View
                style={{
                  fontSize: '32rpx',
                  lineHeight: '70rpx',
                  width: '30%',
                  textAlign: 'center',
                }}>
                {data.issueOverView}
              </View>
              <View
                style={{
                  fontSize: '32rpx',
                  width: '35%',
                  textAlign: 'center',
                  color: '#52c41a',
                }}>
                {len}
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
        </View>
      )}
    </>
  );
};
export default Accordion;
