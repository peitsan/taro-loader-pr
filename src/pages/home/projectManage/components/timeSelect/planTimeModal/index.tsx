import React, { useState, useEffect, useRef } from 'react';
import Taro from '@tarojs/taro';
import { Picker, Button, View } from '@tarojs/components';
import { useDispatch, useSelector } from '@/redux/hooks';
import { getUnitsAC } from '@/redux/actionCreators';
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
import PersonSelector from '@/common/components/personSelector/personSelector';
import styles from './index.module.less';
import { INowProgressInfo } from '../../../projectOverview/fatherProjectProgress';

interface IProps {
  isPlanTimeModalVisible: boolean;
  setIsPlanTimeModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  curProgressInfo: INowProgressInfo;
  projectId: number;
  fatherId: string;
  getData: () => Promise<void>;
}

export const PlanTimeModal = (props: IProps) => {
  const dispatch = useDispatch();
  const units = useSelector(state => state.units.data.units);

  const {
    isPlanTimeModalVisible,
    setIsPlanTimeModalVisible,
    curProgressInfo,
    projectId,
    getData,
    fatherId,
  } = props;

  useEffect(() => {
    dispatch(getUnitsAC({ fatherId: fatherId, getTeamPerson: true }));
  }, []);

  const PersonValue = useRef();

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

    const isSelect = () => {
      // 由于PersonValue用的anyScript，所以下面只好ignore了
      // @ts-ignore
      for (const i of PersonValue.current.state.value) {
        if (i < 0) return false;
      }
      return true;
    };

    const submitDelay = () => {
      if (adjustTime === '' || reason === '' || !isSelect()) {
        Taro.showToast({
          title: '请先填写完整',
          icon: 'error',
          duration: 1000,
        });
        return;
      }
      // startTime的时间戳
      const startTimeTramp = new Date(adjustTime!).getTime();
      const {
        // 由于PersonValue用的anyScript，所以下面只好ignore了
        // @ts-ignore
        state: {
          value: [first, second, third],
          newList,
        },
      } = PersonValue.current;
      const selectId = newList[first].depts[second].workers[third].id;
      httpUtil
        .managerSubmitProjectProgressPlanTimeApply({
          projectId: projectId,
          progressId: curProgressInfo.progressId,
          responsibleId: selectId,
          adjustTime: startTimeTramp,
          adjustReason: reason,
        })
        .then(res => {
          if (res?.code === 200) {
            getData().then(() => {
              Taro.showToast({
                title: '申请发出',
                icon: 'success',
                duration: 1000,
              });
              setIsPlanTimeModalVisible(false);
            });
          } else {
            Taro.showToast({
              title: '网络错误，请重新再试',
              icon: 'error',
              duration: 1000,
            });
          }
        });
    };
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
                height={50}
                onChange={e => {
                  setReason(e);
                }}
                placeholder='调整原因'
                focus
              />
            </View>
          </View>
          <View>
            <PersonSelector
              title='上报领导'
              data={units}
              width={350}
              multiple
              placeholder='选择上报的领导'
              ref={PersonValue}
            />
          </View>
          <Button
            formType='submit'
            className={styles.btn}
            onClick={submitDelay}>
            确认上报
          </Button>
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
      <AtToast isOpened={isOpen} text='请将表单填写完整'></AtToast>
    </>
  );
};
