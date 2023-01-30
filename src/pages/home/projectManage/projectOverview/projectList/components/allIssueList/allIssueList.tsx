// import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import React from 'react';
import Accordion from '../../../../../../../common/components/Accordion/index';
import { IProps, DataType, ExpandedDataType, tableProps } from './allIssueType';
import {
  questions,
  opinions,
  reasons,
  conditions,
} from '../../projectListType/projectListType';
import style from './allIssueList.module.css';

export const AllIssueList: React.FC<IProps> = props => {
  const {
    issuesItems,
    problemsItem,
    proceduresItem,
    protocolsItem,
    setIsCheckModal,
    setIsManageModal,
    setSelectRecord,
    setIsAdjustModal,
    setSelectIndex,
    index,
  } = props;
  const listItem = [problemsItem, protocolsItem, proceduresItem, issuesItems];
  const titleList = ['问题概述', '协议清单', '手续清单', '问题概述'];
  const itemListFunction = (
    itemList: questions[] | opinions[] | reasons[] | conditions[],
  ) => {
    const itemArr: ExpandedDataType[] = [];
    for (let i = 0; i < itemList.length; i++) {
      const { id, name, responsibles, status, planTime, code } = itemList[i];
      const idList = [];
      for (let j = 0; j < responsibles.length; j++) {
        idList.push(responsibles[j].id as never);
      }
      itemArr.push({
        key: id,
        reason: name,
        planTime: planTime ? planTime : '未指定时间',
        manage: responsibles,
        manageId: idList,
        current: status,
        code,
      });
    }
    return itemArr;
  };
  const data: DataType[] = [];
  const dataList: any = listItem[index - 1] ? listItem[index - 1] : [];
  for (let i = 0; i < dataList.length; ++i) {
    const { id, name, code, progress, len } = dataList[i];
    let itemList = [];
    switch (index) {
      case 1:
        itemList = dataList[i].reasons;
        break;
      case 2:
        itemList = dataList[i].opinions;
        break;
      case 3:
        itemList = dataList[i].conditions;
        break;
      case 4:
        itemList = dataList[i].questions;
        break;
    }
    data.push({
      key: id,
      index: i + 1,
      issueOverView: name,
      item: itemListFunction(itemList),
      status: code,
      progress,
      len,
    });
  }
  // 重新封装一个表格组件
  const Table: React.FC<tableProps> = tableProp => {
    const { dataSource } = tableProp;
    return (
      <View className={style['issueListTable']}>
        {index === 4 ? (
          <View className={style['issueListTable-title']}>
            <View
              style={{
                fontWeight: '700',
                fontSize: '32rpx',
                width: '30%',
                textAlign: 'center',
              }}>
              {titleList[index - 1]}
            </View>
            <View
              style={{
                fontWeight: '700',
                fontSize: '32rpx',
                width: '35%',
                textAlign: 'center',
              }}>
              需解决问题数
            </View>
          </View>
        ) : (
          <View className={style['issueListTable-title']}>
            <View
              style={{
                fontWeight: '700',
                fontSize: '32rpx',
                width: '25%',
                textAlign: 'center',
              }}>
              {titleList[index - 1]}
            </View>
            <View
              style={{
                fontWeight: '700',
                fontSize: '32rpx',
                width: '25%',
                textAlign: 'center',
              }}>
              所属流程
            </View>
            <View
              style={{
                fontWeight: '700',
                fontSize: '32rpx',
                width: '28%',
                textAlign: 'center',
              }}>
              需解决问题数
            </View>
            <View
              style={{
                fontWeight: '700',
                fontSize: '32rpx',
                width: '20%',
                textAlign: 'center',
              }}>
              问题状态
            </View>
          </View>
        )}
        {dataSource.length == 0 ? (
          <View className={style['issueListTable-tabs']}>
            <View
              style={{
                textAlign: 'center',
                lineHeight: '30rpx',
                fontSize: '30rpx',
                color: '#9A9A9A',
              }}>
              暂无数据
            </View>
          </View>
        ) : (
          <View className={style['issueListTable-tabs']}>
            {dataSource.map((item, ind) => {
              return (
                <View key={'Accordion-' + item + `-` + ind}>
                  <Accordion
                    data={item}
                    index={index}
                    setIsCheckModal={setIsCheckModal}
                    setIsManageModal={setIsManageModal}
                    setSelectRecord={setSelectRecord}
                    setIsAdjustModal={setIsAdjustModal}
                    setSelectIndex={setSelectIndex}
                  />
                </View>
              );
            })}
          </View>
        )}
      </View>
    );
  };
  return (
    <View>
      <Table dataSource={data}></Table>
    </View>
  );
};
