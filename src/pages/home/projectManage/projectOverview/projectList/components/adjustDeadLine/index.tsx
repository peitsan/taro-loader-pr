import { getStorageSync } from '@tarojs/taro';
import { useState } from 'react';
import {
  AtList,
  AtListItem,
  AtModal,
  AtModalAction,
  AtModalContent,
  AtModalHeader,
} from 'taro-ui';
import { Button, Input, Picker, View } from '@tarojs/components';
import { message } from '@/common/functions';
import httpUtil from '@/utils/httpUtil';
import { adjustDeadLineProps } from './indexProps';
import styles from './index.module.less';

const AdjustDeadLine: React.FC<adjustDeadLineProps> = selfProps => {
  const { isAdjustModal, okAdjustModal, selectRecord, selectIndex } = selfProps;
  const [adjustReason, setAdjustReason] = useState<string>('');
  const [adjustDate, setAdjustDate] = useState<string>('请选择时间');
  const [adjustDateStamp, setAdjustDateStamp] = useState<number>(0);
  const onConfirmDate = e => {
    setAdjustDate(e.detail.value);
    setAdjustDateStamp(e.timeStamp);
  };
  const onCreate = () => {
    let timer: NodeJS.Timer;
    const reply = ['reason', 'opinion', 'condition', 'question'];
    if (selectIndex !== 7) {
      timer = setTimeout(async () => {
        message('请求中', 'warning');
        try {
          const res = await httpUtil.applyAdjust({
            adjustType: reply[selectIndex - 1],
            adjustReason: adjustReason,
            adjustTime: adjustDateStamp,
            reasonId: selectRecord.key,
          });
          if (res.code === 200) {
            message('申请成功', 'success');
          }
        } finally {
        }
      }, 500);
    } else {
      timer = setTimeout(async () => {
        message('请求中', 'warning');
        try {
          const res = await httpUtil.specialAdjustTime({
            progressId: getStorageSync('progressId'),
            adjustReason: adjustReason,
            adjustTime: adjustDateStamp,
            questionId: selectRecord.id,
          });
          if (res.code === 200) {
            message('申请成功', 'success');
          }
        } finally {
        }
      }, 500);
    }
  };
  const onConfirmAdjust = () => {
    onCreate();
    okAdjustModal();
  };
  return (
    <AtModal isOpened={isAdjustModal} onClose={okAdjustModal}>
      <AtModalHeader>申请调整时间</AtModalHeader>
      <AtModalContent>
        {selectIndex === 7 ? (
          <></>
        ) : (
          <View className={styles['reply-title']}>
            {selectRecord?.reason + ':'}
          </View>
        )}
        <View>
          <View className={styles['reply-title']}>申请原因:</View>
          <View className={styles['reply-input']}>
            <Input
              onInput={e => setAdjustReason(e.detail.value)}
              value={adjustReason}></Input>
          </View>
        </View>
        <View>
          <View>
            <Picker mode='date' onChange={e => onConfirmDate(e)}>
              <AtList>
                <AtListItem title='调整时间' extraText={adjustDate} />
              </AtList>
            </Picker>
          </View>
        </View>
        <View className={styles['reply-title']}></View>
      </AtModalContent>
      <AtModalAction>
        {' '}
        <Button onClick={okAdjustModal}>取消</Button>
        <Button onClick={onConfirmAdjust}>确定</Button>{' '}
      </AtModalAction>
    </AtModal>
  );
};

export default AdjustDeadLine;
