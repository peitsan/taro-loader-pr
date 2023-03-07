import React, { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { Picker, Button } from '@tarojs/components';
import {
  AtModal,
  AtModalHeader,
  AtModalContent,
  AtForm,
  AtList,
  AtListItem,
  AtToast,
} from 'taro-ui';
import httpUtil from '@/utils/httpUtil';
import styles from './index.module.less';
import { INowProgressInfo } from '../../../projectOverview/fatherProjectProgress';

interface IProps {
  isEndTimeModalVisible: boolean;
  setIsEndTimeModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  curProgressInfo: INowProgressInfo;
  projectId: number;
  getData: () => Promise<void>;
}

export const EndTimeModal = (props: IProps) => {
  const {
    isEndTimeModalVisible,
    setIsEndTimeModalVisible,
    curProgressInfo,
    projectId,
    getData,
  } = props;
  const [time, setTime] = useState<string>();
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
      const finishTime = new Date(time).valueOf();
      httpUtil
        .selectProjectProgressFinishTime({
          project_id: projectId,
          progress_id: curProgressInfo?.progressId,
          finishTime,
        })
        .then(() => {
          getData().then(() => {
            setIsEndTimeModalVisible(false);
            Taro.showToast({
              title: '填写完成',
              icon: 'success',
            });
          });
        });
    }
  };

  useEffect(() => {
    setTimeHandler();
  }, [curProgressInfo]);
  return (
    <>
      <AtModal
        isOpened={isEndTimeModalVisible}
        onClose={() => {
          setIsEndTimeModalVisible(false);
        }}>
        <AtModalHeader>选择实际完成时间</AtModalHeader>
        <AtModalContent>
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
        </AtModalContent>
      </AtModal>
      <AtToast isOpened={isOpen} text='请将表单填写完整'></AtToast>
    </>
  );
};
