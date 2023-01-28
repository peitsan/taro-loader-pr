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
import * as dayjs from 'dayjs';
import { IProgressItem } from '../../progressItem';
import styles from './index.module.less';

interface IProps {
  selectId: number;
  selectIndex: number;
  projectId: number;
  getData: () => Promise<void>;
  isStartTimeModalVisible: boolean;
  setIsStartTimeModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  timestamp: IProgressItem[];
  isFather: boolean;
}

export const StartTimeModal = (props: IProps) => {
  const {
    selectId,
    selectIndex,
    projectId,
    getData,
    isStartTimeModalVisible,
    setIsStartTimeModalVisible,
    timestamp,
    isFather,
  } = props;
  const [start, setStart] = useState<string>();
  const [end, setEnd] = useState<string>();
  const [isDisabled, setIsDisabled] = useState(false);
  const [time, setTime] = useState<string>();
  const [isOpened, setIsOpened] = useState(false);
  const [toastText, setToastText] = useState<
    '请先选择初步设计启动会时间' | '请将表单填写完整'
  >();

  const initSelectTime = () => {
    setStart('1970-01-01');
    setEnd('2999-01-01');
    setTime('');
  };

  const setTimeHandler = () => {
    initSelectTime();
    if (selectIndex > 1) {
      const preStartTime = timestamp[selectIndex - 1].startTime;
      if (preStartTime) {
        const startTime = new Date(preStartTime!).valueOf() + 86400000;
        const time = dayjs(startTime).format('YYYY-MM-DD');
        setStart(time);
        // setIsStartTimeModalVisible(true);
      }
    }
    if (selectIndex === 0) {
      const nextStartTime = timestamp[1].startTime;
      if (nextStartTime) {
        const endTime = new Date(nextStartTime).valueOf() - 86400000;
        const time = dayjs(endTime).format('YYYY-MM-DD');
        setEnd(time);
      } else {
        setIsStartTimeModalVisible(false);
        setToastText('请先选择初步设计启动会时间');
        setIsOpened(true);
        setTimeout(() => {
          setIsOpened(false);
        }, 2000);
      }
    }
  };

  const submit = () => {
    if (!time) {
      setToastText('请将表单填写完整');
      setIsOpened(true);
      setTimeout(() => {
        setIsOpened(false);
      }, 2000);
    } else {
      const startTime = new Date(time).valueOf();
      const fetch = isFather
        ? httpUtil.setFatherProjectNodeTime({
            project_id: String(projectId),
            progress_id: String(selectId),
            startTime,
          })
        : httpUtil.selectProjectProgressStartTime({
            project_id: Number(projectId),
            progress_id: selectId,
            startTime,
          });
      fetch.then(() => {
        getData().then(() => {
          setIsStartTimeModalVisible(false);
          console.log('成功');
        });
      });
    }
  };

  useEffect(() => {
    setTimeHandler();
  }, [selectIndex]);

  return (
    <>
      <AtModal
        isOpened={isStartTimeModalVisible}
        onClose={() => {
          setIsStartTimeModalVisible(false);
        }}>
        <AtModalHeader>{`选择${
          selectIndex === 0 ? '实际完成' : '开始'
        }时间`}</AtModalHeader>
        <AtModalContent>
          <AtForm onSubmit={submit}>
            <Picker
              mode='date'
              value='YYYY-MM-DD'
              onChange={e => {
                setTime(e.detail.value);
              }}
              disabled={isDisabled}
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
      <AtToast isOpened={isOpened} text={toastText}></AtToast>
    </>
  );
};
