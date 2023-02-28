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

interface IProps {
  isAdjustTimeForChuShe: boolean;
  setIsAdjustTimeForChuShe: React.Dispatch<React.SetStateAction<boolean>>;
  getData: () => Promise<void>;
  projectId: number;
  progressId: number;
}

export const AdjustTimeForChuShe = (props: IProps) => {
  const {
    isAdjustTimeForChuShe,
    setIsAdjustTimeForChuShe,
    getData,
    projectId,
    progressId,
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
      const startTime = new Date(time).valueOf();
      httpUtil
        .adjustTimeAfterChuShe({
          progress_id: progressId,
          project_id: projectId,
          adjustTime: startTime,
        })
        .then(() => {
          getData().then(() => {
            setIsAdjustTimeForChuShe(false);
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
        isOpened={isAdjustTimeForChuShe}
        onClose={() => {
          setIsAdjustTimeForChuShe(false);
        }}>
        <AtModalHeader>调整初步设计启动会时间</AtModalHeader>
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
