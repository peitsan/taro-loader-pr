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

export interface ICheckData {
  projectId: number;
  progressId: number;
}

interface IProps {
  isFinishTimeModalVisibleForHeZhun: boolean;
  setIsFinishTimeModalVisibleForHeZhun: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  getData: () => Promise<void>;
  checkData: ICheckData[];
  curIndex: number;
  setCurIndex: React.Dispatch<React.SetStateAction<number>>;
}

export const FinishTimeForHeZhun = (props: IProps) => {
  const {
    isFinishTimeModalVisibleForHeZhun,
    setIsFinishTimeModalVisibleForHeZhun,
    checkData,
    curIndex,
    setCurIndex,
    getData,
  } = props;
  const [time, setTime] = useState<string>();
  const [isOpen, setIsOpen] = useState<boolean>(false);

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
          project_id: Number(checkData[curIndex].projectId),
          progress_id: Number(checkData[curIndex].progressId),
          finishTime,
        })
        .then(() => {
          getData().then(() => {
            setIsFinishTimeModalVisibleForHeZhun(false);
            Taro.showToast({
              title: '时间设置成功',
              icon: 'success',
              duration: 1000,
            });
          });
        });
    }
  };

  return (
    <>
      <AtModal
        isOpened={isFinishTimeModalVisibleForHeZhun}
        onClose={() => {
          setIsFinishTimeModalVisibleForHeZhun(false);
        }}>
        <AtModalHeader>
          {curIndex === 0
            ? '填写核准要件的实际完成时间'
            : '填写核准批复的实际完成时间'}
        </AtModalHeader>
        <AtModalContent>
          <AtForm onSubmit={submit}>
            <Picker
              mode='date'
              value='YYYY-MM-DD'
              onChange={e => {
                setTime(e.detail.value);
              }}>
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
