import React, { useEffect, useState } from 'react';
import Taro, { useRouter } from '@tarojs/taro';
import { Button, View } from '@tarojs/components';
import httpUtil from '@/utils/httpUtil';
import { navigateTo } from '@/common/functions';
import { AtToast, AtModal, AtModalHeader, AtModalContent } from 'taro-ui';
import styles from './index.module.less';
import ProgressItemList from './progressItemList';
import ProgressItem, {
  IProgressItem,
  IonClickName,
} from '../../components/progressItem';
import { ModalAttachmentComponent } from '../components';

import {
  StartTimeModal,
  PlanTimeModal,
  EndTimeModal,
} from '../../components/timeSelect';
import UploadFile from './uploadFile';
import {
  FinishTimeForHeZhun,
  PlanTimeForHeZhun,
  AdjustTimeForChuShe,
  ICheckData,
  NavTop,
} from './components';

export interface INowProgressInfo {
  startTime: string | null;
  endTime: string | null;
  planTime: string | null;
  progressId: number;
  name: string;
}

const SonProjectProgress = () => {
  const {
    projectId = 394,
    proName = '220KV变电站测试1',
    fatherProName = '项目1',
    fatherId = String(394),
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

  // 控制调整初步设计启动会时间的modal的显示与否
  const [isShowForAdjustChuShe, setIsShowForAdjustChuShe] = useState(false);

  //
  const [
    isFinishTimeModalVisibleForHeZhun,
    setIsFinishTimeModalVisibleForHeZhun,
  ] = useState(false);

  const [isPlanTimeModalVisibleForHeZhun, setIsPlanTimeModalVisibleForHeZhun] =
    useState(false);

  const [isAdjustTimeForChuShe, setIsAdjustTimeForChuShe] = useState(false);

  //
  const [curIndexForHeZhunFini, setCurIndexForHeZhunFini] = useState(0);

  const [curIndexForHeZhunPlan, setCurIndexForHeZhunPlan] = useState(0);

  // 将核准要件和核准批复单独拿出来
  const [checkData, setCheckData] = useState<ICheckData[]>([]);

  // 记录初步设计启动会的id
  const [idForChuShe, setIdForChuShe] = useState('');

  // 设置每次下载的文件
  const [fileUrl, setFileUrl] = useState('');

  // 下载文件modal展示与否
  const [isDolShow, setIsDolShow] = useState(false);

  // 下载文件节点的 progressId
  const [downProgressId, setDownProgressId] = useState('');

  // 下载文件modal的标题
  const [downloadModalFileTitle, setDownloadModalFileTitle] = useState<
    '核准要件' | '核准批复' | '初设批复'
  >('核准要件');

  const [isShowFileName, setIsShowFileName] = useState(false);

  // 点击项目名称事件
  const onClickProName = (params: IonClickName) => {
    const { type, startTime, endTime, id, name, attachment } = params;
    // setSelectInfo({ selectId: id, selectIndex: type });

    // 核准要件上传文件
    if ((name === '核准要件' || name === '核准批复') && attachment) {
      setDownloadModalFileTitle(name);
      setFileUrl(attachment);
      setIsDolShow(true);
      setIsShowFileName(true);
      return;
    } else if (
      (name === '核准要件' || name === '核准批复') &&
      !attachment &&
      permission !== 'manager'
    ) {
      return Taro.showToast({
        title: '还未上传文件',
        icon: 'error',
      });
    } else if (
      (name === '核准要件' || name === '核准批复') &&
      permission === 'manager'
    ) {
      setIsShowFileName(false);
      setDownProgressId(String(id));
      return setIsOpenLoadFile(true);
    }

    if (
      (progressNow >= 20 && (type > progressNow || type <= 8)) ||
      (progressNow <= 8 && type > progressNow)
    ) {
      setOpenToast(true);
      setTimeout(() => {
        setOpenToast(false);
      }, 2000);
      return;
    } else if (type === 7 && startTime && !attachment) {
      permission === 'manager'
        ? setIsOpenLoadFile(true)
        : console.log('还未上传附件');
    } else if (type === 7 && startTime && attachment) {
      setDownloadModalFileTitle('初设批复');
      setFileUrl(attachment);
      setIsDolShow(true);
    } else if (type === 0 && !startTime && permission === 'manager') {
      setIsOpenStartDateSele(true);
    } else if (type === 0 && !startTime && permission !== 'manager') {
      Taro.showToast({
        title: '流程还未设置时间',
        icon: 'error',
        duration: 1000,
      });
    } else if (type < progressNow) {
      Taro.setStorageSync('projectName', proName);
      Taro.setStorageSync('fatherName', fatherProName);
      Taro.setStorageSync('projectId', projectId);
      Taro.setStorageSync('progressId', id);
      Taro.setStorageSync('fatherId', fatherId);
      Taro.setStorageSync('status', '已结束');
      Taro.setStorageSync('name', name);
      Taro.setStorageSync('type', String(type));
      Taro.setStorageSync('progress', JSON.stringify(true));
      navigateTo('/home/projectManage/projectOverview/projectList');
      return;
    } else if (type === progressNow && !startTime) {
      setIsOpenStartDateSele(true);
      return;
    } else if (type === progressNow && startTime) {
      Taro.setStorageSync('projectName', proName);
      Taro.setStorageSync('fatherName', fatherProName);
      Taro.setStorageSync('projectId', projectId);
      Taro.setStorageSync('fatherId', fatherId);
      Taro.setStorageSync('progressId', id);
      Taro.setStorageSync('status', '进行中');
      Taro.setStorageSync('name', name);
      Taro.setStorageSync('type', String(type));
      console.log(type);
      Taro.setStorageSync('progress', JSON.stringify(false));
      // progressyi
      navigateTo('/home/projectManage/projectOverview/projectList');
      // console.log('跳转');
      return;
    }
  };

  // 获取该项目的过程数据
  const getData = () => {
    const specialData: ICheckData[] = [];
    // 初始化操作
    setCurIndexForHeZhunFini(0);
    setCurIndexForHeZhunPlan(0);
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
              name: item.name,
            });
            if (item.type >= 1 && item.type < 20)
              setIsShowForAdjustChuShe(true);
          }
          if (item.name === '核准要件' || item.name === '核准批复') {
            item.endTime && setCurIndexForHeZhunFini(e => e + 1);
            item.planTime && setCurIndexForHeZhunPlan(e => e + 1);
            specialData.push({
              projectId: Number(item.projectId),
              progressId: Number(item.progressId),
            });
          }
          if (item.name === '初步设计启动会') {
            setIdForChuShe(String(item.progressId));
          }
        });
        if (hasFinish) setProgressNow(progresses.length);
        setCheckData(specialData);
        setTimestamp(progresses);
      });
  };
  // 推进下一节点
  const confirmPushProjectToNextProgress = () => {
    const startTime = curProgressInfo?.startTime;
    const planTime = curProgressInfo?.planTime;
    const endTime = curProgressInfo?.endTime;
    const name = curProgressInfo?.name;
    if (!startTime && name != '可研技术收口')
      Taro.showToast({
        title: '请先填写开始时间',
        icon: 'error',
        duration: 1000,
      });
    if (!planTime && name != '可研技术收口')
      return Taro.showToast({
        title: '请先填写计划完成时间',
        icon: 'error',
        duration: 1000,
      });
    if (!endTime && name != '可研技术收口')
      return Taro.showToast({
        title: '请先填写实际完成时间',
        icon: 'error',
        duration: 1000,
      });
    httpUtil
      .pushProjectToNextProgress({ project_id: String(projectId) })
      .then(() => {
        getData().then(() => {
          Taro.showToast({
            title: '推进成功',
            icon: 'success',
            duration: 1000,
          });
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
        <NavTop
          fatherProName={fatherProName}
          proName={proName}
          permission={permission}
          setIsOpenOperateModal={setIsOpenOperateModal}
        />
        <View className={styles['progress-div']}>
          <ProgressItemList
            timeStamp={timestamp}
            onClickProName={onClickProName}
            // 根据流程条是否小于9来判断是否需要隐藏部分节点
            isHiddenItem={timestamp.length <= 9 ? false : true}
            // isHiddenItem 优先级要高于 hiddenIndex 和 hiddenNum
            hiddenIndex={5} // 从哪一位index后面开始隐藏
            hiddenNum={2} // 隐藏节点数量
          />
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
          {/* 设置完时间按钮消失 */}
          {isShowForAdjustChuShe && (
            <Button
              className={styles.opeBtn}
              style={{ fontSize: 32 + 'rpx' }}
              onClick={() => {
                setIsAdjustTimeForChuShe(true);
                setIsOpenOperateModal(false);
              }}>
              调整初步设计启动会的开始时间
            </Button>
          )}
          {/* 设置完时间按钮消失 */}
          {curIndexForHeZhunPlan <= 1 && (
            <Button
              className={styles.opeBtn}
              onClick={() => {
                setIsPlanTimeModalVisibleForHeZhun(true);
                setIsOpenOperateModal(false);
              }}>
              填写核准计划完成时间
            </Button>
          )}
          {curIndexForHeZhunFini <= 1 && (
            <Button
              className={styles.opeBtn}
              onClick={() => {
                setIsFinishTimeModalVisibleForHeZhun(true);
                setIsOpenOperateModal(false);
              }}>
              填写核准实际完成时间
            </Button>
          )}
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
          <PlanTimeForHeZhun
            isPlanTimeModalVisibleForHeZhun={isPlanTimeModalVisibleForHeZhun}
            setIsPlanTimeModalVisibleForHeZhun={
              setIsPlanTimeModalVisibleForHeZhun
            }
            checkData={checkData}
            curIndex={curIndexForHeZhunPlan}
            setCurIndex={setCurIndexForHeZhunPlan}
            getData={getData}
          />
          <FinishTimeForHeZhun
            isFinishTimeModalVisibleForHeZhun={
              isFinishTimeModalVisibleForHeZhun
            }
            setIsFinishTimeModalVisibleForHeZhun={
              setIsFinishTimeModalVisibleForHeZhun
            }
            getData={getData}
            curIndex={curIndexForHeZhunFini}
            setCurIndex={setCurIndexForHeZhunFini}
            checkData={checkData}
          />
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
            fatherId={fatherId!}
          />
          <EndTimeModal
            isEndTimeModalVisible={isOpenEndDateSele}
            setIsEndTimeModalVisible={setIsOpenEndDateSele}
            projectId={Number(projectId)}
            curProgressInfo={curProgressInfo!}
            getData={getData}
          />
          <AdjustTimeForChuShe
            isAdjustTimeForChuShe={isAdjustTimeForChuShe}
            setIsAdjustTimeForChuShe={setIsAdjustTimeForChuShe}
            getData={getData}
            projectId={Number(projectId)}
            progressId={Number(idForChuShe)}
          />
          <UploadFile
            isUploadVisible={isOpenLoadFile}
            setIsUploadVisible={setIsOpenLoadFile}
            getData={getData}
            progressId={Number(downProgressId)}
            projectId={Number(projectId)}
            isShowFileName={isShowFileName}
            setIsShowFileName={setIsShowFileName}
          />
        </>
      )}
      <ModalAttachmentComponent
        isShow={isDolShow}
        setIsShow={setIsDolShow}
        url={fileUrl}
        titleName={downloadModalFileTitle}
      />
    </>
  );
};

export default SonProjectProgress;
