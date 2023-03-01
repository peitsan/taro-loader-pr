import Taro from '@tarojs/taro';
import React from 'react';
import { View } from '@tarojs/components';
// 下面注释的 MTable 是为了测试 MTable 组件
// import { MTable } from '@/common/components';
// import { IColumns } from '@/common/components/MTable/types';
import { AtTag } from 'taro-ui';
import { ProjectLists } from './components';
import styles from './index.module.less';

const ProjectAudit = () => {
  // const sourceData = [
  //   {
  //     name: 'mzy',
  //     age: '18',
  //     address: 'China',
  //     operate: '2',
  //   },
  //   {
  //     name: 'mzy',
  //     age: '18',
  //     address: 'China',
  //     operate: '2',
  //   },
  //   {
  //     name: 'mzy',
  //     age: '18',
  //     address: 'China',
  //     operate: '2',
  //   },
  // ];

  // const columns: IColumns = [
  //   {
  //     dataIndex: 'name',
  //     key: 'name',
  //     title: '姓名',
  //     width: '20%',
  //   },
  //   {
  //     dataIndex: 'age',
  //     title: '年龄',
  //     key: 'age',
  //     width: '20%',
  //   },
  //   {
  //     dataIndex: 'address',
  //     title: '住址',
  //     width: '40%',
  //     key: 'address',
  //   },
  //   {
  //     dataIndex: 'operation',
  //     title: '操作',
  //     width: '20%',
  //     key: 'operate',
  //     render: (key, record, allData) => {
  //       return <View style={{ color: 'red' }}>删除</View>;
  //     },
  //   },
  // ];

  // const renderExpanded = e => {
  //   return <>123</>;
  // };

  const permission = Taro.getStorageSync('permission');
  return (
    <>
      {permission === 'manager' ? (
        <>
          <View className={styles.top}>
            <AtTag className={styles.tag} circle>
              工程审核
            </AtTag>
          </View>
          <ProjectLists />
        </>
      ) : (
        <View style={{ margin: '50px auto', textAlign: 'center' }}>
          该模块只对项目经理开放
        </View>
      )}
      {/* <MTable
        columns={columns}
        header={() => 'header'}
        footer={() => 'footer'}
        sourceData={sourceData}
        expandable={{ expandedRowRender: e => renderExpanded(e) }}
        bordered
      /> */}
    </>
  );
};

export default ProjectAudit;
