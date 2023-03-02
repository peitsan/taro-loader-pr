import React, { useEffect, useState } from 'react';
import Taro, { useRouter } from '@tarojs/taro';
import { Button, View } from '@tarojs/components';
import httpUtil from '@/utils/httpUtil';
import {
  AtTag,
  AtToast,
  AtModal,
  AtModalHeader,
  AtModalContent,
} from 'taro-ui';
import styles from './index.module.less';
import ProgressItem, {
  IProgressItem,
  IonClickName,
} from '../../components/progressItem';

import {
  StartTimeModal,
  PlanTimeModal,
  EndTimeModal,
} from '../../components/timeSelect';

export interface INowProgressInfo {
  startTime: string | null;
  endTime: string | null;
  planTime: string | null;
  progressId: number;
}

const FatherProjectProgress = () => {
  // 获取父项目id，name，permission
  const { projectId, name, permission } = useRouter().params;
  // 存储目前进行到的步骤，默认是1
  const [progressNow, setProgressNow] = useState<number>(1);
  // 轻提示的显示与隐藏
  const [isOpenToast, setOpenToast] = useState(false);
  // 相关操作的显示与隐藏
  const [isOpenOperateModal, setIsOpenOperateModal] = useState(false);
  // 保存现在所有的小进程
  const [timestamp, setTimestamp] = useState<IProgressItem[]>([]);

  // 控制选择开始时间窗口的打开与关闭
  const [isOpenStartDateSele, setIsOpenStartDataSele] = useState(false);
  // 控制计划时间窗口的打开与关闭
  const [isOpenPlanDateSele, setIsOpenPlanDateSele] = useState(false);
  // 控制完成时间窗口的打开与关闭
  const [isOpenEndDateSele, setIsOpenEndDateSele] = useState(false);
  // 点击选择的index,id
  interface ISelectInfo {
    selectIndex: number;
    selectId: number;
  }
  const [selectInfo, setSelectInfo] = useState<ISelectInfo>();
  // 保存现在正在进行的进程信息

  const [curProgressInfo, setCurProgressInfo] = useState<INowProgressInfo>();

  // 初设批复附件attachment
  const [attachment, setAttachMent] = useState('');

  // 点击项目名称事件
  const onClickProName = (params: IonClickName) => {
    const { type, startTime, endTime, id, attachment } = params;
    setSelectInfo({ selectId: id, selectIndex: type });

    if (type > progressNow) {
      setOpenToast(true);
      setTimeout(() => {
        setOpenToast(false);
      }, 2000);
    } else {
      if ((type === 0 && !startTime) || (type !== 0 && !startTime))
        setIsOpenStartDataSele(true);
    }
  };

  // 获取该项目的过程数据
  const getData = () => {
    // 获取时间戳数据
    return httpUtil
      .getFatherProjectNodeDetail({ projectId: Number(projectId) })
      .then(res => {
        const { progresses } = res.data;
        progresses.forEach((item: IProgressItem) => {
          if (item.status === '进行中') {
            setProgressNow(item.type);
            setCurProgressInfo({
              startTime: item.startTime,
              endTime: item.endTime,
              planTime: item.planTime,
              progressId: item.progressId,
            });
          }
        });

        setTimestamp(progresses);
      });
  };
  // 推进下一节点
  const confirmPushProjectToNextProgress = () => {
    const startTime = curProgressInfo?.startTime;
    const planTime = curProgressInfo?.planTime;
    const endTime = curProgressInfo?.endTime;
    if (!startTime) return console.log('请先填写当前流程开始时间');
    if (!planTime) return console.log('请先填写当前流程计划完成时间');
    if (!endTime) return console.log('请先填写当前流程实际完成时间');

    httpUtil
      .pushFatherProjectToNextProgress({ fatherId: String(projectId) })
      .then(() => {
        getData().then(() => {
          setIsOpenEndDateSele(false);
          setIsOpenOperateModal(false);

          console.log('推进成功');
        });
      });
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <View>
        <View className={styles['name-div']}>
          <AtTag className={styles.tag} circle>
            项目详情
          </AtTag>
          <View className={styles.name}>{name}</View>
          {permission === 'manager' && (
            <View
              className={styles.operate}
              onClick={() => {
                setIsOpenOperateModal(true);
              }}>
              相关操作
            </View>
          )}
        </View>
        <View className={styles['progress-div']}>
          {timestamp && (
            <>
              {timestamp.map((item, index) => {
                return (
                  <ProgressItem
                    key={`ProjectProgress-${index}`}
                    name={item.name}
                    startTime={item.startTime}
                    endTime={item.endTime}
                    planTime={item.planTime}
                    progressId={item.progressId}
                    projectId={item.projectId}
                    status={item.status}
                    finish={item.finish}
                    type={item.type}
                    onClickName={params => onClickProName(params)}
                    hasNext={index !== timestamp.length - 1 && true}
                    attachment={attachment}
                  />
                );
              })}
            </>
          )}
        </View>
      </View>
      <AtToast
        isOpened={isOpenToast}
        text='流程未开始'
        icon='close-circle'></AtToast>
      <AtModal
        isOpened={isOpenOperateModal}
        onClose={() => {
          setIsOpenOperateModal(false);
        }}>
        <AtModalHeader>相关操作</AtModalHeader>
        <AtModalContent>
          <Button
            className={styles.opeBtn}
            onClick={() => {
              setIsOpenOperateModal(false);
              setIsOpenPlanDateSele(true);
            }}>
            {curProgressInfo?.planTime
              ? '申请调整计划完成时间'
              : '填写计划完成时间'}
          </Button>
          <Button
            className={styles.opeBtn}
            onClick={() => {
              setIsOpenOperateModal(false);
              setIsOpenEndDateSele(true);
            }}>
            填写实际完成时间
          </Button>
          <Button
            className={styles.opeBtn}
            onClick={confirmPushProjectToNextProgress}>
            下一节点
          </Button>
        </AtModalContent>
      </AtModal>
      {/* 确定相应时间 */}
      {permission === 'manager' && (
        <>
          <StartTimeModal
            selectIndex={selectInfo?.selectIndex!}
            selectId={selectInfo?.selectId!}
            isStartTimeModalVisible={isOpenStartDateSele}
            setIsStartTimeModalVisible={setIsOpenStartDataSele}
            getData={getData}
            timestamp={timestamp}
            projectId={Number(projectId)}
            isFather
          />
          <PlanTimeModal
            isPlanTimeModalVisible={isOpenPlanDateSele}
            setIsPlanTimeModalVisible={setIsOpenPlanDateSele}
            projectId={Number(projectId)}
            curProgressInfo={curProgressInfo!}
            getData={getData}
            fatherId={projectId!}
          />
          <EndTimeModal
            isEndTimeModalVisible={isOpenEndDateSele}
            setIsEndTimeModalVisible={setIsOpenEndDateSele}
            projectId={Number(projectId)}
            curProgressInfo={curProgressInfo!}
            getData={getData}
          />
        </>
      )}
    </>
  );
};
export default FatherProjectProgress;
