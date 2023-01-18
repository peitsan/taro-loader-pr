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
    index,
    fresh,
  } = props;
  // const expandedRowRender = (record: DataType) => {
  //   const { item } = record;
  //   console.log('item', item);
  //   return <ChildrenTable item={item} index={index} fresh={fresh} />;
  // };
  const listItem = [problemsItem, protocolsItem, proceduresItem, issuesItems];
  const titleList = ['问题概述', '协议清单', '手续清单', '问题概述'];
  // const columns: ColumnsType<DataType> = [
  //   // { title: '序号', dataIndex: 'index', key: 'index', width:"25%" },
  //   {
  //     title: `${titleList[index - 1]}`,
  //     dataIndex: 'issueOverView',
  //     key: 'issueOverView',
  //     width: '20%',
  //   },
  //   index === 4
  //     ? {}
  //     : {
  //         title: '所属流程',
  //         key: 'progress',
  //         width: '30%',
  //         render: (_: any, record: DataType) => {
  //           const { name } = record.progress;
  //           return <span>{name}</span>;
  //         },
  //         sorter: (a, b) => {
  //           if (b.len - a.len > 0) {
  //             return a.progress.type - b.progress.type;
  //           }
  //           return b.progress.type - a.progress.type;
  //         },
  //         defaultSortOrder: 'ascend',
  //       },
  //   {
  //     title: '需解决问题数',
  //     key: 'number',
  //     render: (_: any, record: DataType) => {
  //       const { item } = record;
  //       let len = 0;
  //       for (let i = 0; i < item.length; i++) {
  //         const { manageId, code } = item[i];
  //         const { id } = JSON.parse(Taro.getStorageSync('user')!);
  //         if (manageId.includes(id) && code === 1) {
  //           len++;
  //         }
  //       }
  //       const className = len > 0 ? 'num1-color' : 'num-color';
  //       return <span className={styles[className]}>{len}</span>;
  //     },
  //     sorter: (a, b) => b.len - a.len,
  //   },
  //   index == 4
  //     ? {}
  //     : {
  //         title: '问题状态',
  //         dataIndex: 'status',
  //         key: 'status',
  //         width: '30%',
  //         render: (text, record) => {
  //           const { status } = record;
  //           const statusList = ['被驳回', '待审批', '通过'];
  //           const statusColor = ['reply', 'approval', 'solve'];
  //           return status === undefined ? (
  //             <span className={styles['solve']}>{'通过'}</span>
  //           ) : (
  //             <span className={styles[statusColor[status + 1]]}>
  //               {statusList[Number(status) + 1]}
  //             </span>
  //           );
  //         },
  //         sorter: (a, b) => a.len - b.len,
  //       },
  // ];

  const itemListFunction = (
    itemList: questions[] | opinions[] | reasons[] | conditions[],
  ) => {
    const itemArr: ExpandedDataType[] = [];
    for (let i = 0; i < itemList.length; i++) {
      const { id, name, responsibles, status, planTime, code } = itemList[i];
      const idList = [];
      for (let j = 0; j < responsibles.length; j++) {
        idList.push(responsibles[j].id);
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

        <View className={style['issueListTable-tabs']}>
          {dataSource.map((item, ind) => {
            return (
              <View key={'Accordion-' + item + `-` + ind}>
                <Accordion data={item} index={index} />
              </View>
            );
          })}
        </View>
      </View>
    );
  };
  return (
    <View>
      <Table dataSource={data}></Table>
    </View>
  );
};
