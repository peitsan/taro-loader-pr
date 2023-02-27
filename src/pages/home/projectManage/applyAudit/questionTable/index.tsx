import React, { useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import { useSelector, useDispatch } from '@/redux/hooks';
import { getApplyListAC } from '@/redux/actionCreators';
import { QuesTable } from '../components/quesTable';
import styles from './index.module.less';

const QuestionTable = () => {
  const dispatch = useDispatch();
  const column = ['父项目名称', '项目名字', '所属流程', '更多'];
  const list = useSelector(state => state.applyAudit.questionApprovals);

  useEffect(() => {
    dispatch(getApplyListAC());
  }, []);

  return (
    <>
      <View className={styles.box}>
        <View className={styles.title}>问题完成时间调整上报审批</View>
        <QuesTable column={column} data={list} />
      </View>
    </>
  );
};

export default QuestionTable;
