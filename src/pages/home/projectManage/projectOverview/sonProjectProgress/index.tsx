import React, { useEffect, useState } from 'react';
import Taro, { useRouter } from '@tarojs/taro';
import { Button, View } from '@tarojs/components';
import httpUtil from '@/utils/httpUtil';
import { navigateTo } from '@/common/functions';
import {
  AtTag,
  AtIcon,
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
import UploadFile from './uploadFile';

export interface INowProgressInfo {
  startTime: string | null;
  endTime: string | null;
  planTime: string | null;
  progressId: number;
}

const SonProjectProgress = () => {
  const {
    projectId = 304,
    proName,
    fatherProName,
    fatherId,
    permission = 'manager',
  } = useRouter().params;

  // 存储目前进行到的步骤，默认是1
  const [progressNow, setProgressNow] = useState<number>(0);
  // 轻提示的显示与隐藏
  const [isOpenToast, setOpenToast] = useState(false);
  // 相关操作的显示与隐藏
  const [isOpenOperateModal, setIsOpenOperateModal] = useState(false);
  // 保存现在所有的小进程
  const [timestamp, setTimestamp] = useState<IProgressItem[]>([]);

  // 控制选择开始时间窗口的打开与关闭
  const [isOpenStartDateSele, setIsOpenStartDateSele] = useState(false);
  // 控制计划时间窗口的打开与关闭
  const [isOpenPlanDateSele, setIsOpenPlanDateSele] = useState(false);
  // 控制完成时间窗口的打开与关闭
  const [isOpenEndDateSele, setIsOpenEndDateSele] = useState(false);
  // 上传附件与否
  const [isUpload, setIsUpload] = useState(false);
  // 控制打开上传文件与关闭
  const [isOpenLoadFile, setIsOpenLoadFile] = useState(false);
  // 点击选择的index,id
  interface ISelectInfo {
    selectIndex: number;
    selectId: number;
  }
  const [selectInfo, setSelectInfo] = useState<ISelectInfo>();
  // 保存现在正在进行的进程信息

  const [curProgressInfo, setCurProgressInfo] = useState<INowProgressInfo>();

  // 点击项目名称事件
  const onClickProName = (params: IonClickName) => {
    const { type, startTime, endTime, id, name } = params;

    setSelectInfo({ selectId: id, selectIndex: type });

    if (type > progressNow) {
      setOpenToast(true);
      setTimeout(() => {
        setOpenToast(false);
      }, 2000);
      return;
    } else if (type === 7 && startTime && !isUpload) {
      permission === 'manager'
        ? setIsOpenLoadFile(true)
        : console.log('还未上传附件');
    } else if (type === 0 && !startTime) {
      setIsOpenStartDateSele(true);
    } else if (type < progressNow) {
      // console.log('跳转');
      Taro.setStorageSync('projectName', proName);
      Taro.setStorageSync('fatherName', fatherProName);
      Taro.setStorageSync('projectId', projectId);
      Taro.setStorageSync('progressId', id);
      Taro.setStorageSync('status', '已结束');
      Taro.setStorageSync('name', name);
      Taro.setStorageSync('type', String(type));
      Taro.setStorageSync('progress', JSON.stringify(true));
      navigateTo('/home/projectManage/projectOverview/projectList');
      return;
    } else if (type === progressNow && !startTime) {
      console.log('*****');

      setIsOpenStartDateSele(true);
      return;
    } else if (type === progressNow && startTime) {
      Taro.setStorageSync('projectName', proName);
      Taro.setStorageSync('fatherName', fatherProName);
      Taro.setStorageSync('projectId', projectId);
      Taro.setStorageSync('progressId', id);
      Taro.setStorageSync('status', '进行中');
      Taro.setStorageSync('name', name);
      Taro.setStorageSync('type', String(type));
      Taro.setStorageSync('progress', JSON.stringify(false));
      // progressyi
      navigateTo('/home/projectManage/projectOverview/projectList');
      // console.log('跳转');
      return;
    }
  };

  // 获取该项目的过程数据
  const getData = () => {
    // 获取时间戳数据
    return httpUtil
      .getProjectProgress({ project_id: String(projectId) })
      .then(res => {
        let hasFinish = true;
        const { progresses } = res.data;
        progresses.forEach((item: IProgressItem) => {
          if (item.status === '进行中') {
            hasFinish = false;
            setProgressNow(item.type);
            setCurProgressInfo({
              startTime: item.startTime,
              endTime: item.endTime,
              planTime: item.planTime,
              progressId: item.progressId,
            });
          }
        });
        if (hasFinish) setProgressNow(progresses.length);

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
      .pushProjectToNextProgress({ project_id: String(projectId) })
      .then(() => {
        getData().then(() => {
          setIsOpenEndDateSele(false);
          setIsOpenOperateModal(false);
        });
      });
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <View>
        <View
          className={styles.top}
          onClick={() => {
            console.log('后退');
          }}>
          <AtIcon value='chevron-left' />
          <View>返回</View>
        </View>
        <View className={styles['name-div']}>
          <AtTag className={styles.tag} circle>
            项目详情
          </AtTag>
          <View className={styles.name}>
            {fatherProName}/{proName}
          </View>
          <View
            className={styles.operate}
            onClick={() => {
              setIsOpenOperateModal(true);
            }}>
            相关操作
          </View>
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
                  />
                );
              })}
            </>
          )}
        </View>
      </View>
      <AtToast
        isOpened={isOpenToast}
        text={'流程未开始'}
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
      <StartTimeModal
        selectIndex={selectInfo?.selectIndex!}
        selectId={selectInfo?.selectId!}
        isStartTimeModalVisible={isOpenStartDateSele}
        setIsStartTimeModalVisible={setIsOpenStartDateSele}
        getData={getData}
        timestamp={timestamp}
        projectId={Number(projectId)}
        isFather={false}
      />
      <PlanTimeModal
        isPlanTimeModalVisible={isOpenPlanDateSele}
        setIsPlanTimeModalVisible={setIsOpenPlanDateSele}
        projectId={Number(projectId)}
        curProgressInfo={curProgressInfo!}
        getData={getData}
      />
      <EndTimeModal
        isEndTimeModalVisible={isOpenEndDateSele}
        setIsEndTimeModalVisible={setIsOpenEndDateSele}
        projectId={Number(projectId)}
        curProgressInfo={curProgressInfo!}
        getData={getData}
      />
      <UploadFile
        isUploadVisible={isOpenLoadFile}
        setIsUploadVisible={setIsOpenLoadFile}
      />
    </>
  );
};

export default SonProjectProgress;
