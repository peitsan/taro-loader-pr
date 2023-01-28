import React, { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { Picker, Button, View } from '@tarojs/components';
import {
  AtModal,
  AtModalHeader,
  AtModalContent,
  AtForm,
  AtList,
  AtListItem,
  AtToast,
  AtTextarea,
} from 'taro-ui';
import httpUtil from '@/utils/httpUtil';
import styles from './index.module.less';
import { INowProgressInfo } from '../../../projectOverview/fatherProjectProgress';

interface IProps {
  isPlanTimeModalVisible: boolean;
  setIsPlanTimeModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  curProgressInfo: INowProgressInfo;
  projectId: number;
  getData: () => Promise<void>;
}

export const PlanTimeModal = (props: IProps) => {
  const {
    isPlanTimeModalVisible,
    setIsPlanTimeModalVisible,
    curProgressInfo,
    projectId,
    getData,
  } = props;

  const [time, setTime] = useState<string>();
  const [adjustTime, setAdjustTime] = useState<string>();
  const [reason, setReason] = useState<string>('');
  const [start, setStart] = useState<string>();
  const [end, setEnd] = useState<string>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const initSelectTime = () => {
    setStart('1970-01-01');
    setEnd('2999-01-01');
    setTime('');
  };
  const setTimeHandler = () => {
    initSelectTime();
    const time = curProgressInfo?.startTime;
    if (time) setStart(time);
  };
  const submit = () => {
    if (!time) {
      setIsOpen(true);
      setTimeout(() => {
        setIsOpen(false);
      }, 2000);
    } else {
      const planTime = new Date(time).valueOf();
      httpUtil
        .selectProjectProgressPlanTime({
          project_id: projectId,
          progress_id: curProgressInfo?.progressId,
          planTime,
        })
        .then(() => {
          getData().then(() => {
            setIsPlanTimeModalVisible(false);
            console.log('成功');
          });
        });
    }
  };

  const AdjustModalContent = () => {
    initSelectTime();
    setStart(curProgressInfo?.planTime!);
    return (
      <>
        <AtForm className={styles.adjustForm}>
          <View className={styles.preplan}>
            原计划完成时间：{curProgressInfo?.planTime}
          </View>
          <Picker
            mode='date'
            value='YYYY-MM-DD'
            onChange={e => {
              setAdjustTime(e.detail.value);
            }}
            start={start}
            end={end}>
            <AtList>
              <AtListItem
                title='时间'
                extraText={adjustTime ? adjustTime : '请选择时间'}
              />
            </AtList>
          </Picker>
          <View className={styles.reason_div}>
            <View>调整原因</View>
            <View>
              <AtTextarea
                value={reason}
                onChange={e => {
                  console.log(e);
                }}
                placeholder='调整原因'
                focus
              />
            </View>
          </View>
          <View></View>
          <Button formType='submit'>确认上报</Button>
        </AtForm>
      </>
    );
  };

  useEffect(() => {
    setTimeHandler();
  }, [curProgressInfo]);
  return (
    <>
      <AtModal
        isOpened={isPlanTimeModalVisible}
        onClose={() => {
          setIsPlanTimeModalVisible(false);
        }}>
        <AtModalHeader>选择计划完成时间</AtModalHeader>
        <AtModalContent>
          {curProgressInfo?.planTime ? (
            <AdjustModalContent />
          ) : (
            <AtForm onSubmit={submit}>
              <Picker
                mode='date'
                value='YYYY-MM-DD'
                onChange={e => {
                  setTime(e.detail.value);
                }}
                start={start}
                end={end}>
                <AtList>
                  <AtListItem
                    title='时间'
                    extraText={time ? time : '请选择时间'}
                  />
                </AtList>
              </Picker>
              <Button className={styles.opeBtn} formType='submit'>
                确定
              </Button>
            </AtForm>
          )}
        </AtModalContent>
      </AtModal>
      <AtToast isOpened={isOpen} text={'请将表单填写完整'}></AtToast>
    </>
  );
};
