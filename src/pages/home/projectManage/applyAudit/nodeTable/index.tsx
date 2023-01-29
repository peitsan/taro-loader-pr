import React, { useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import { useSelector, useDispatch } from '@/redux/hooks';
import { getApplyListAC } from '@/redux/actionCreators';
import { NodTable } from '../components/nodeTable';
import styles from './index.module.less';

const NodeTable = () => {
  const dispatch = useDispatch();
  const column = ['父项目名称', '项目名字', '所属流程', '更多'];
  const list = useSelector(state => state.applyAudit.projectApprovals);

  useEffect(() => {
    dispatch(getApplyListAC());
  }, []);

  return (
    <>
      <View className={styles.box}>
        <View className={styles.title}>项目节点预计完成时间调整上报审批</View>
        <NodTable column={column} data={list} />
      </View>
    </>
  );
};

export default NodeTable;
