import React, { FC, useState } from 'react';
import Taro from '@tarojs/taro';
import ProgressItem, {
  IProgressItem,
  IonClickName,
} from '../../../components/progressItem';

interface IProps {
  timeStamp: IProgressItem[];
  isHiddenItem?: boolean;
  hiddenIndex?: number;
  hiddenNum?: number;
  onClickProName: (params: IonClickName) => void;
}

const ProgressItemList: FC<IProps> = (props: IProps) => {
  const [extraLen, setExtraLen] = useState(0);
  const {
    timeStamp,
    isHiddenItem,
    onClickProName,
    hiddenIndex = -1,
    hiddenNum = 0,
  } = props;
  return (
    <>
      {/* 处理是否要隐藏部分 */}
      {timeStamp && isHiddenItem ? (
        <>
          {timeStamp.map((item, index) => {
            if (index === hiddenIndex) {
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
                  hasNext={index !== timeStamp.length - 1 && true}
                  timeStamp={timeStamp}
                  attachment={item.attachment}
                  isHiddenItem={isHiddenItem}
                  hiddenIndex={hiddenIndex}
                  hiddenNum={hiddenNum}
                  isAddLen
                  addLen={5}
                  extraLen={extraLen}
                  setExtraLen={setExtraLen}
                />
              );
            } else if (
              index < hiddenIndex + 1 ||
              index > hiddenIndex + hiddenNum
            ) {
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
                  hasNext={index !== timeStamp.length - 1 && true}
                  extraLen={extraLen}
                  setExtraLen={setExtraLen}
                  attachment={item.attachment}
                />
              );
            }
          })}
        </>
      ) : (
        <>
          {timeStamp.map((item, index) => {
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
                hasNext={index !== timeStamp.length - 1 && true}
                timeStamp={timeStamp}
                attachment={item.attachment}
              />
            );
          })}
        </>
      )}
    </>
  );
};

export default ProgressItemList;
