import React, { useState } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Button } from '@tarojs/components';
import styles from './index.module.less';
import { GetNumberTime } from '../../../../../common/functions/getNumberTime';

// 响使用改组件的组件传递相应的信息
export interface IonClickName {
  type: number;
  name: string | null;
  startTime: string | null;
  endTime: string | null;
  id: number;
  attachment: string;
}

export interface IProgressItem {
  status: '已结束' | '进行中' | '未开始'; // 标记现在的任务状态
  name: string; // 该过程的名字
  startTime: string | null; // 开始时间
  endTime: string | null; // 实际完成时间
  planTime: string | null; // 计划完成时间
  progressId: number; // 该进程的id
  finish: boolean; // 标识改进程有没有完成
  projectId: number; // 该进程所属项目的id
  type: number; // 流程状态码
  attachment: string;
  hasNext?: boolean; // 表示有无下一个进程
  doingColor?: string; // 正在进行的 color
  doneColor?: string; // 已经完成的 color
  willColor?: string; // 没有开始的 color
  onClickName?: (params: IonClickName) => void;
  timeStamp?: IProgressItem[];
  isHiddenItem?: boolean;
  hiddenIndex?: number; // 开始隐藏节点的index下标
  hiddenNum?: number; // 隐藏节点数目
  hiddenName?: string[];
  isShrink?: boolean; // 是否缩小比例
  addLen?: number; // 增加左边进度条的比例，设置的长度为 x*50
  isAddLen?: boolean; // 是否增加左边的长度
  // 下面两个解决断条问题，但是现在还没有解决
  extraLen?: number;
  setExtraLen?: React.Dispatch<React.SetStateAction<number>>;
}

const initProps = {
  type: 0,
  hasNext: true,
  finish: false,
  doingColor: 'rgb(241, 179, 60)',
  doneColor: 'rgb(0,107,84)',
  willColor: 'rgb(167,166,166)',
  status: '进行中',
};

interface ITimeComponentProps {
  title: string;
  time: string | null;
  timeClassName?: string;
}

const Time = (props: ITimeComponentProps) => {
  const { time, title, timeClassName = '' } = props;

  return (
    <View>
      {title}:
      {time ? (
        <Text className={styles[timeClassName]}> {time}</Text>
      ) : (
        <Text className={styles['item-noTime']}>未选择</Text>
      )}
    </View>
  );
};

const ProgressItem = (props: IProgressItem) => {
  const {
    status = initProps.status,
    name,
    startTime,
    endTime,
    planTime,
    progressId,
    finish = initProps.finish,
    projectId,
    type = initProps.type,
    hasNext = initProps.hasNext,
    doingColor = initProps.doingColor,
    doneColor = initProps.doneColor,
    willColor = initProps.willColor,
    timeStamp,
    isHiddenItem = false,
    hiddenIndex = -1,
    hiddenNum = 0,
    hiddenName = ['核准要件', '核准批复'],
    isShrink = false,
    addLen = 0,
    isAddLen = false,
    extraLen = 0,
    setExtraLen,
    onClickName,
  } = props;
  const colorSelect = {
    未开始: initProps.willColor,
    进行中: initProps.doingColor,
    已结束: initProps.doneColor,
  };
  const [isShow, setIsShow] = useState(false);

  const showHidden = () => {
    setIsShow(e => !e);
    // 出了一点bug
  };

  const HiddenComponents = () => {
    return (
      <>
        {timeStamp?.map((item, index) => {
          if (
            isHiddenItem === true &&
            index >= hiddenIndex + 1 &&
            index <= hiddenIndex + hiddenNum &&
            hiddenName.includes(item.name)
          ) {
            return (
              <>
                <ProgressItem
                  name={item.name}
                  status={item.status}
                  endTime={item.endTime}
                  startTime={item.startTime}
                  planTime={item.planTime}
                  progressId={item.progressId}
                  projectId={item.projectId}
                  finish={item.finish}
                  type={item.type}
                  isShrink
                  extraLen={extraLen}
                  setExtraLen={setExtraLen}
                  onClickName={props.onClickName}
                  attachment={item.attachment}
                />
              </>
            );
          }
        })}
      </>
    );
  };

  return (
    <View className={`${styles.item} ${isShrink && styles.itemShrink}`}>
      <View
        className={`${styles.leftSign} ${isShrink && styles.leftSignShrink}`}>
        <View
          className={styles.circle}
          style={{ backgroundColor: colorSelect[status] }}></View>
        {hasNext && (
          <View
            className={`${styles.nextLine} ${
              isShow && !isAddLen && (type === 0 ? styles.longT : styles.long)
            }`}
            style={{
              backgroundColor: colorSelect[status],
              height: isShow
                ? isAddLen
                  ? addLen * 50 + extraLen * 50 + 'px'
                  : ''
                : '',
            }}></View>
        )}
      </View>
      <View className={styles.rightContent}>
        <View
          className={`${
            isShrink ? styles.itemContentShrink : styles.itemContent
          }`}
          onClick={showHidden}>
          <View
            className={styles.itemName}
            onClick={e => {
              e.stopPropagation();
              props.onClickName &&
                props.onClickName({
                  name: props.name,
                  type: props.type,
                  startTime: props.startTime,
                  endTime: endTime,
                  id: props.progressId,
                  attachment: props.attachment,
                });
            }}>
            {name}
          </View>
          <View className={styles.planTime}>
            {planTime ? planTime : '未指定'}
          </View>
        </View>
        <View
          className={`${isShrink ? styles.timeSpaceShrink : styles.timeSpace} ${
            isShow && (type === 0 ? styles.showT : styles.show)
          }`}>
          {type === 0 ? (
            <>
              <Time title='实际完成' time={startTime}></Time>
            </>
          ) : (
            <>
              {name !== '核准要件' && name !== '核准批复' && (
                <Time title='开始时间' time={startTime}></Time>
              )}
              <Time
                title='计划完成'
                time={planTime}
                timeClassName={
                  GetNumberTime(endTime!) > GetNumberTime(planTime!)
                    ? 'item-time-warning'
                    : ''
                }></Time>
              <Time
                title='实际完成'
                time={endTime}
                timeClassName={
                  GetNumberTime(endTime!) > GetNumberTime(planTime!)
                    ? 'item-time-error'
                    : 'item-time-success'
                }></Time>
            </>
          )}
        </View>
        <View
          className={`${styles.timeSpaceHiddenItem} ${
            isShow && styles.showHidden
          }`}>
          {isHiddenItem && <HiddenComponents />}
        </View>
      </View>
    </View>
  );
};

export default ProgressItem;
